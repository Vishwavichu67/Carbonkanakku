'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileUp, Star, Award, Loader2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { read, utils, WorkBook } from 'xlsx';
import jsPDF from 'jspdf';
import { useUser, useDoc } from '@/firebase';

interface ReportOutput {
  reportHtml: string;
  totalEmissions: number;
  sustainabilityScore: string;
  recommendations: string[];
}

const generateLocalReport = (excelData: any[], companyName: string): ReportOutput => {
  let totalMonthlyKg = 0;
  const recommendations: string[] = [];

  // Assuming the first row of data is representative for the calculation
  const data = excelData[0] || {};
  
  const emissionSources = [
    { key: 'Electricity usage', factor: 0.82, unit: 'kWh', threshold: 20000, recommendation: "High electricity usage detected. Consider upgrading to BEE 5-star rated motors or installing solar panels to reduce grid dependency." },
    { key: 'Diesel usage', factor: 2.68, unit: 'litres', threshold: 1500, recommendation: "Diesel consumption is high. Explore using cleaner fuels like LPG or CNG for heating processes, or optimize boiler efficiency." },
    { key: 'Coal usage', factor: 2420, unit: 'tons', threshold: 3, recommendation: "Coal is a major emission source. We strongly recommend switching to biomass or natural gas to significantly lower your carbon footprint." },
    { key: 'LPG usage', factor: 1.51, unit: 'kg' },
    { key: 'Transport distance', factor: 0.27, unit: 'km' },
    { key: 'Water used', factor: 0.0003, unit: 'liters' },
    { key: 'Fabric waste', factor: 0.5, unit: 'kg' }
  ];

  const reductionSources = [
    { key: 'Recycled fabric waste', factor: -0.2, unit: 'kg' },
    { key: 'Recycled water', factor: -0.0001, unit: 'liters' }
  ];
  
  let breakdownHtml = '';

  emissionSources.forEach(source => {
    const value = parseFloat(data[source.key] || '0');
    if (value > 0) {
      const emission = value * source.factor;
      totalMonthlyKg += emission;
      breakdownHtml += `<tr><td>${source.key}</td><td>${value.toLocaleString()} ${source.unit}</td><td>${emission.toFixed(2)} kg CO₂e</td></tr>`;
      if (source.threshold && value > source.threshold) {
        recommendations.push(source.recommendation);
      }
    }
  });

  reductionSources.forEach(source => {
      const value = parseFloat(data[source.key] || '0');
      if (value > 0) {
        const reduction = value * source.factor;
        totalMonthlyKg += reduction;
        breakdownHtml += `<tr><td>${source.key} (Credit)</td><td>${value.toLocaleString()} ${source.unit}</td><td style="color: green;">${reduction.toFixed(2)} kg CO₂e</td></tr>`;
      }
  });

  if (recommendations.length === 0) {
    recommendations.push("Your operations appear efficient. Continue monitoring and explore new green technologies to maintain high performance.");
  }


  const totalEmissions = (totalMonthlyKg * 12) / 1000; // Total tCO2e per year

  let sustainabilityScore = "Needs Improvement";
  if (totalEmissions < 100) {
    sustainabilityScore = "High Performer";
  } else if (totalEmissions <= 250) {
    sustainabilityScore = "Compliant";
  }

  const reportHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #3F704D; border-bottom: 2px solid #E9E7DA; padding-bottom: 10px;">Sustainability Report for ${companyName}</h1>
      
      <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #3F704D; margin-top: 0;">Executive Summary</h2>
        <p>This report provides an analysis of your company's carbon footprint based on the data provided. The total estimated annual emission is <strong>${totalEmissions.toFixed(2)} tCO2e</strong>.</p>
        <p>Your current sustainability score is: <strong style="color: ${sustainabilityScore === 'High Performer' ? 'green' : (sustainabilityScore === 'Compliant' ? 'orange' : 'red')}">${sustainabilityScore}</strong>.</p>
      </div>

      <h3 style="color: #A07855;">Emission Breakdown (Monthly)</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #E9E7DA;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Source</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Usage</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Emission (kg CO₂e)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownHtml}
          <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td colSpan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Monthly Emissions</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${totalMonthlyKg.toFixed(2)} kg CO₂e</td>
          </tr>
        </tbody>
      </table>

      <h3 style="color: #A07855;">Future Emission Reduction Strategies</h3>
      <ul style="list-style-type: disc; padding-left: 20px;">
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>

      <h3 style="color: #A07855;">Predictive Analysis</h3>
      <p>If current operational levels continue without intervention, your annual emissions are projected to remain around <strong>${totalEmissions.toFixed(2)} tCO2e/year</strong>. Implementing the recommended strategies could potentially reduce this by 15-20% within the next fiscal year.</p>
    </div>
  `;

  return { reportHtml, totalEmissions, sustainabilityScore, recommendations };
};


export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [report, setReport] = useState<ReportOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const userDocPath = user ? `users/${user.uid}` : null;
  const { data: userDoc, loading: userDocLoading } = useDoc<any>(userDocPath);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setReport(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid Excel file (.xlsx).',
        });
        event.target.value = '';
        setFile(null);
        setFileName('');
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please upload an Excel file to generate a report.',
      });
      return;
    }

    setIsGenerating(true);
    setReport(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Empty File',
          description: 'The uploaded Excel file contains no data.',
        });
        setIsGenerating(false);
        return;
      }
      
      const result = generateLocalReport(jsonData, userDoc?.companyName || "Your Company");

      setReport(result);
      toast({
        title: 'Report Generated Successfully!',
        description: 'Your new sustainability report is now available below.',
      });
    } catch (error: any) {
      console.error('Report generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: error.message || 'An error occurred while analyzing your data.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!report || !report.reportHtml) return;

    const doc = new jsPDF();
    
    doc.html(report.reportHtml, {
      callback: function (doc) {
        doc.save(`Sustainability-Report-${userDoc?.companyName || 'report'}.pdf`);
      },
      x: 10,
      y: 10,
      width: 180,
      windowWidth: 800
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">AI-Powered Insights &amp; Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate Sustainability Report</CardTitle>
              <CardDescription>Upload an Excel sheet with your monthly data to generate a new AI-powered sustainability report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <>
                <div className="space-y-2">
                  <Label htmlFor="report-file">Excel Data File (.xlsx)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="report-file" type="file" onChange={handleFileChange} accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="flex-grow"/>
                  </div>
                  {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
                </div>
                <Button onClick={handleGenerateReport} disabled={isGenerating || !file} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                     <FileUp className="mr-2 h-4 w-4" />
                      Generate New Report
                    </>
                  )}
                </Button>
              </>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Award />
                Sustainability Score
              </CardTitle>
              <CardDescription>Your badge reflects your commitment to sustainability.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-background rounded-lg p-4 flex flex-col items-center">
                <Star className="h-16 w-16 text-yellow-500 fill-yellow-400 mb-2" />
                <p className="font-bold text-lg font-headline">High Performer</p>
                <p className="text-sm text-muted-foreground">Top 20% in Industry</p>
              </div>
               <Button variant="outline" className="mt-4 w-full">Share Badge</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {report && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline flex items-center gap-2">
                  <FileText />
                  Generated Report
                </CardTitle>
                <CardDescription>
                  Total Emissions: <span className="font-bold text-primary">{report.totalEmissions.toFixed(2)} tCO2e/year</span> | Score: <span className="font-bold text-primary">{report.sustainabilityScore}</span>
                </CardDescription>
              </div>
              <Button onClick={handleDownloadPdf} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-4 bg-background" 
              dangerouslySetInnerHTML={{ __html: report.reportHtml }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
