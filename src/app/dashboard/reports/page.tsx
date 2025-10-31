'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileUp, Star, Award, Loader2, FileText, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { read, utils } from 'xlsx';
import jsPDF from 'jspdf';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

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
  const rawData = excelData[0] || {};
  
  // Normalize keys to be lowercase to handle case-insensitivity
  const data: { [key: string]: any } = {};
  for (const key in rawData) {
    if (Object.prototype.hasOwnProperty.call(rawData, key)) {
      data[key.toLowerCase()] = rawData[key];
    }
  }

  const emissionSources = [
    { key: 'electricity usage', factor: 0.82, unit: 'kWh', threshold: 20000, recommendation: "High electricity usage detected. Consider upgrading to BEE 5-star rated motors or installing solar panels to reduce grid dependency." },
    { key: 'diesel usage', factor: 2.68, unit: 'litres', threshold: 1500, recommendation: "Diesel consumption is high. Explore using cleaner fuels like LPG or CNG for heating processes, or optimize boiler efficiency." },
    { key: 'coal usage', factor: 2420, unit: 'tons', threshold: 3, recommendation: "Coal is a major emission source. We strongly recommend switching to biomass or natural gas to significantly lower your carbon footprint." },
    { key: 'lpg usage', factor: 1.51, unit: 'kg', displayName: 'LPG Usage' },
    { key: 'transport distance', factor: 0.27, unit: 'km', displayName: 'Transport Distance' },
    { key: 'water used', factor: 0.0003, unit: 'liters', displayName: 'Water Used' },
    { key: 'fabric waste', factor: 0.5, unit: 'kg', displayName: 'Fabric Waste' }
  ];

  const reductionSources = [
    { key: 'recycled fabric waste', factor: -0.2, unit: 'kg', displayName: 'Recycled Fabric Waste' },
    { key: 'recycled water', factor: -0.0001, unit: 'liters', displayName: 'Recycled Water' }
  ];
  
  let breakdownHtml = '';
  
  const toTitleCase = (str: string) => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());


  emissionSources.forEach(source => {
    const value = parseFloat(data[source.key] || '0');
    if (value > 0) {
      const emission = value * source.factor;
      totalMonthlyKg += emission;
      const displayName = source.displayName || toTitleCase(source.key);
      breakdownHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${displayName}</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${value.toLocaleString()} ${source.unit}</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA; text-align: right;">${emission.toFixed(2)} kg CO₂e</td></tr>`;
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
        const displayName = source.displayName || toTitleCase(source.key);
        breakdownHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${displayName} (Credit)</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${value.toLocaleString()} ${source.unit}</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA; text-align: right; color: green;">${reduction.toFixed(2)} kg CO₂e</td></tr>`;
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
  
  const scoreColor = sustainabilityScore === 'High Performer' ? '#22c55e' : (sustainabilityScore === 'Compliant' ? '#f97316' : '#ef4444');

  const reportHtml = `
    <div style="font-family: 'PT Sans', sans-serif; color: #333; margin: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: middle;">
            <h1 style="color: #3F704D; font-family: 'Space Grotesk', sans-serif; font-size: 28px; margin: 0;">Sustainability Report</h1>
            <p style="font-size: 14px; margin: 0;">For: <strong>${companyName}</strong></p>
            <p style="font-size: 12px; color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
          </td>
          <td style="text-align: right; vertical-align: middle;">
             <img src="/icon.svg" alt="CarbonKanakku Logo" style="height: 40px;"/>
          </td>
        </tr>
      </table>

      <div style="margin: 30px 0; border-top: 2px solid #3F704D;"></div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="width: 65%; background-color: #F8F7F4; border-radius: 8px; padding: 20px; vertical-align: top;">
            <h2 style="color: #3F704D; font-family: 'Space Grotesk', sans-serif; margin-top: 0; font-size: 18px;">Executive Summary</h2>
            <p style="font-size: 14px; line-height: 1.6;">This report provides an analysis of your company's carbon footprint based on the data provided. The total estimated annual emission is <strong>${totalEmissions.toFixed(2)} tCO2e</strong>. This positions your operations in the <strong>'${sustainabilityScore}'</strong> category, suggesting areas for strategic improvement.</p>
          </td>
          <td style="width: 35%; padding-left: 20px; text-align: center; vertical-align: middle;">
            <div style="background-color: #fff; border: 1px solid ${scoreColor}; border-radius: 8px; padding: 15px;">
                <p style="margin:0; font-size: 14px; color: #666;">Sustainability Score</p>
                <p style="margin: 5px 0; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: bold; color: ${scoreColor};">${sustainabilityScore}</p>
            </div>
          </td>
        </tr>
      </table>
      
      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Emission Breakdown (Monthly)</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr style="background-color: #F8F7F4; font-weight: bold;">
            <th style="padding: 10px; text-align: left;">Source</th>
            <th style="padding: 10px; text-align: left;">Usage</th>
            <th style="padding: 10px; text-align: right;">Emission (kg CO₂e)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownHtml}
          <tr style="background-color: #F8F7F4; font-weight: bold;">
            <td colSpan="2" style="padding: 10px; text-align: right;">Total Monthly Emissions</td>
            <td style="padding: 10px; text-align: right;">${totalMonthlyKg.toFixed(2)} kg CO₂e</td>
          </tr>
        </tbody>
      </table>

      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Future Emission Reduction Strategies</h3>
      <ul style="font-size: 14px; line-height: 1.8; list-style-type: '✔  '; padding-left: 20px;">
        ${recommendations.map(rec => `<li><strong style="color: #3F704D;">${rec.split(':')[0]}:</strong>${rec.split(':')[1]}</li>`).join('')}
      </ul>

      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Predictive Analysis</h3>
      <p style="font-size: 14px; line-height: 1.6;">If current operational levels continue without intervention, your annual emissions are projected to remain around <strong>${totalEmissions.toFixed(2)} tCO2e/year</strong>. Implementing the recommended strategies could potentially reduce this by 15-20% within the next fiscal year.</p>
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
  const { user, loading: userLoading } = useUser();

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
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
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
      
      const result = generateLocalReport(jsonData, user?.displayName ? `${user.displayName}'s Factory` : "Your Company");

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

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    });
    
    doc.html(report.reportHtml, {
      callback: function (doc) {
        doc.save(`Sustainability-Report-${user?.displayName || 'report'}.pdf`);
      },
      x: 0,
      y: 0,
      width: 445,
      windowWidth: 445
    });
  };
  
  if (userLoading) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-10 w-96" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-full mt-2" /></CardHeader>
                        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                 </div>
              </div>
          </div>
      )
  }

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
                {isGenerating ? (
                     <div className="bg-background rounded-lg p-4 flex flex-col items-center">
                        <Skeleton className="h-16 w-16 mb-2 rounded-full" />
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                     </div>
                ) : report ? (
                    <div className="bg-background rounded-lg p-4 flex flex-col items-center">
                        <Star className="h-16 w-16 text-yellow-500 fill-yellow-400 mb-2" />
                        <p className="font-bold text-lg font-headline">{report.sustainabilityScore}</p>
                        <p className="text-sm text-muted-foreground">Based on latest report</p>
                    </div>
                ) : (
                     <div className="bg-background rounded-lg p-4 flex flex-col items-center text-muted-foreground">
                        <Award className="h-16 w-16 mb-2" />
                        <p className="font-bold text-lg font-headline">Awaiting Data</p>
                        <p className="text-sm">Upload a file to see your score</p>
                     </div>
                )}
               <Button variant="outline" className="mt-4 w-full" disabled={!report}>Share Badge</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isGenerating && (
          <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
          </Card>
      )}

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

      {!report && !isGenerating && (
         <Card className="text-center py-16">
            <CardHeader>
                <CardTitle className="font-headline flex items-center justify-center gap-2"><AlertTriangle className="text-amber-500" />Your Report Awaits</CardTitle>
                <CardDescription>Upload your monthly data using the panel above to generate your comprehensive sustainability analysis.</CardDescription>
            </CardHeader>
         </Card>
      )}
    </div>
  );
}

    