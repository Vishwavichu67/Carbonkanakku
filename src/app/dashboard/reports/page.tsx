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
import autoTable from 'jspdf-autotable';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportOutput {
  reportHtml: string;
  totalEmissions: number;
  sustainabilityScore: string;
  recommendations: string[];
  breakdown: { source: string; usage: string; emission: string; }[];
  totalMonthlyKg: number;
}

const toTitleCase = (str: string) => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const generateLocalReport = (excelData: any[], companyName: string): ReportOutput => {
  let totalMonthlyKg = 0;
  const recommendations: string[] = [];
  const breakdown: { source: string; usage: string; emission: string; }[] = [];
  
  const emissionSources = [
    { key: 'electricity usage', factor: 0.82, unit: 'kWh', threshold: 20000, recommendation: "High electricity usage detected. Consider upgrading to BEE 5-star rated motors or installing solar panels to reduce grid dependency.", randomRange: [15000, 25000] },
    { key: 'diesel usage', factor: 2.68, unit: 'litres', threshold: 1500, recommendation: "Diesel consumption is high. Explore using cleaner fuels like LPG or CNG for heating processes, or optimize boiler efficiency.", randomRange: [1000, 2000] },
    { key: 'coal usage', factor: 2420, unit: 'tons', threshold: 3, recommendation: "Coal is a major emission source. We strongly recommend switching to biomass or natural gas to significantly lower your carbon footprint.", randomRange: [1, 5] },
    { key: 'lpg usage', factor: 1.51, unit: 'kg', randomRange: [100, 300] },
    { key: 'transport distance', factor: 0.27, unit: 'km', randomRange: [200, 500] },
    { key: 'water used', factor: 0.0003, unit: 'liters', randomRange: [40000, 60000] },
    { key: 'fabric waste', factor: 0.5, unit: 'kg', randomRange: [50, 150] }
  ];

  const reductionSources = [
    { key: 'recycled fabric waste', factor: -0.2, unit: 'kg', randomRange: [20, 80] },
    { key: 'recycled water', factor: -0.0001, unit: 'liters', randomRange: [5000, 15000] }
  ];

  let useRandomData = excelData.length === 0;

  if (excelData.length > 0) {
      let totalSum = 0;
      excelData.forEach(row => {
          for (const key in row) {
              const cleanedKey = String(key).toLowerCase().trim();
              const foundSource = [...emissionSources, ...reductionSources].find(s => s.key === cleanedKey);
              if(foundSource && !isNaN(parseFloat(row[key]))) {
                  totalSum += parseFloat(row[key]);
              }
          }
      });
      if (totalSum === 0) useRandomData = true;
  }
  
  let averageRow: { [key: string]: number } = {};

  if (!useRandomData) {
      const totals: { [key: string]: number } = {};
      const counts: { [key: string]: number } = {};
      
      excelData.forEach(row => {
          for(const key in row) {
              const cleanedKey = String(key).toLowerCase().trim();
              if(!isNaN(parseFloat(row[key]))) {
                  totals[cleanedKey] = (totals[cleanedKey] || 0) + parseFloat(row[key]);
                  counts[cleanedKey] = (counts[cleanedKey] || 0) + 1;
              }
          }
      });

      for (const key in totals) {
          if (counts[key] > 0) {
              averageRow[key] = totals[key] / counts[key];
          }
      }
  }

  let breakdownHtml = '';
  
  [...emissionSources, ...reductionSources].forEach(source => {
    let value = 0;
    let isReduction = source.factor < 0;

    if (useRandomData && source.randomRange) {
        value = Math.floor(Math.random() * (source.randomRange[1] - source.randomRange[0]) + source.randomRange[0]);
    } else if (averageRow[source.key.toLowerCase().trim()]) {
        value = averageRow[source.key.toLowerCase().trim()];
    }

    if (value > 0) {
      const emission = value * source.factor;
      totalMonthlyKg += emission;
      let displayName = toTitleCase(source.key.replace(/ usage| distance| used| waste/gi, ''));
      if(isReduction) displayName += " (Credit)";

      breakdownHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${displayName}</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA;">${value.toLocaleString(undefined, {maximumFractionDigits: 2})} ${source.unit}</td><td style="padding: 8px; border-bottom: 1px solid #E9E7DA; text-align: right; color: ${isReduction ? 'green' : 'inherit'};">${emission.toFixed(2)} kg CO₂e</td></tr>`;
      breakdown.push({ source: displayName, usage: `${value.toLocaleString(undefined, {maximumFractionDigits: 2})} ${source.unit}`, emission: `${emission.toFixed(2)} kg CO₂e` });
      
      if (!isReduction && source.threshold && value > source.threshold && source.recommendation) {
        recommendations.push(source.recommendation);
      }
    }
  });
  
  if (totalMonthlyKg === 0 && useRandomData) {
    totalMonthlyKg = Math.random() * 30000 + 5000;
  }

  if (recommendations.length === 0) {
    recommendations.push("Your operations appear efficient based on the data. Continue monitoring and explore new green technologies to maintain high performance.");
    recommendations.push("Invest in energy-efficient lighting (LEDs) across all units to reduce electricity consumption.");
    recommendations.push("Implement a robust waste segregation system to maximize recycling and minimize landfill contributions.");
  }

  const totalEmissions = (totalMonthlyKg * 12) / 1000;

  let sustainabilityScore = "Needs Improvement";
  if (totalEmissions < 100) {
    sustainabilityScore = "High Performer";
  } else if (totalEmissions <= 250) {
    sustainabilityScore = "Compliant";
  }
  
  const rowCount = useRandomData ? 'sample' : excelData.length;

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
             <img src="/icon.svg" alt="EcoTextile Insights Logo" style="height: 40px;"/>
          </td>
        </tr>
      </table>

      <div style="margin: 30px 0; border-top: 2px solid #3F704D;"></div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="width: 65%; background-color: #F8F7F4; border-radius: 8px; padding: 20px; vertical-align: top;">
            <h2 style="color: #3F704D; font-family: 'Space Grotesk', sans-serif; margin-top: 0; font-size: 18px;">Executive Summary</h2>
            <p style="font-size: 14px; line-height: 1.6;">This report provides an analysis of your company's carbon footprint based on the average of ${rowCount} data entries. The total estimated annual emission is <strong>${totalEmissions.toFixed(2)} tCO2e</strong>. This positions your operations in the <strong>'${sustainabilityScore}'</strong> category.</p>
          </td>
          <td style="width: 35%; padding-left: 20px; text-align: center; vertical-align: middle;">
            <div style="background-color: #fff; border: 1px solid ${scoreColor}; border-radius: 8px; padding: 15px;">
                <p style="margin:0; font-size: 14px; color: #666;">Sustainability Score</p>
                <p style="margin: 5px 0; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: bold; color: ${scoreColor};">${sustainabilityScore}</p>
            </div>
          </td>
        </tr>
      </table>
      
      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Average Monthly Emission Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr style="background-color: #F8F7F4; font-weight: bold;">
            <th style="padding: 10px; text-align: left;">Source</th>
            <th style="padding: 10px; text-align: left;">Avg. Usage</th>
            <th style="padding: 10px; text-align: right;">Avg. Emission (kg CO₂e)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownHtml}
          <tr style="background-color: #F8F7F4; font-weight: bold;">
            <td colSpan="2" style="padding: 10px; text-align: right;">Total Average Monthly Emissions</td>
            <td style="padding: 10px; text-align: right;">${totalMonthlyKg.toFixed(2)} kg CO₂e</td>
          </tr>
        </tbody>
      </table>

      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Future Emission Reduction Strategies</h3>
      <ul style="font-size: 14px; line-height: 1.8; list-style-type: '✔ '; padding-left: 20px;">
        ${recommendations.map(rec => {
          const parts = rec.split(':');
          const title = parts[0];
          const body = parts.slice(1).join(':');
          return `<li><strong style="color: #3F704D;">${title}:</strong>${body}</li>`;
        }).join('')}
      </ul>

      <h3 style="color: #A07855; font-family: 'Space Grotesk', sans-serif; border-bottom: 1px solid #E9E7DA; padding-bottom: 5px; font-size: 16px;">Predictive Analysis</h3>
      <p style="font-size: 14px; line-height: 1.6;">If current operational levels continue without intervention, your annual emissions are projected to remain around <strong>${totalEmissions.toFixed(2)} tCO2e/year</strong>. Implementing the recommended strategies could potentially reduce this by 15-20% within the next fiscal year.</p>
    </div>
  `;

  return { reportHtml, totalEmissions, sustainabilityScore, recommendations, breakdown, totalMonthlyKg };
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
    setIsGenerating(true);
    setReport(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      let jsonData: any[] = [];
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = utils.sheet_to_json(worksheet, { defval: "" });
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
    if (!report) return;
  
    const doc = new jsPDF();
    const pageMargin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - pageMargin * 2;
    let currentY = pageMargin;
  
    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(63, 112, 77); // primary color
    doc.text('Sustainability Report', pageMargin, currentY);
    
    currentY += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100); // muted-foreground
    doc.text(`For: ${user?.displayName ? `${user.displayName}'s Factory` : 'Your Company'}`, pageMargin, currentY);
    currentY += 15;
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageMargin, currentY);
    
    currentY += 25;
    doc.setDrawColor(63, 112, 77);
    doc.setLineWidth(1.5);
    doc.line(pageMargin, currentY, contentWidth + pageMargin, currentY);
    currentY += 30;
  
    // --- Executive Summary & Score ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(63, 112, 77);
    doc.text('Executive Summary', pageMargin, currentY);
    currentY += 20;
  
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const summaryText = `This report provides an analysis of your company's carbon footprint. The total estimated annual emission is ${report.totalEmissions.toFixed(2)} tCO2e. This positions your operations in the '${report.sustainabilityScore}' category.`;
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(summaryLines, pageMargin, currentY);
    currentY += (summaryLines.length * 12) + 20;

    let scoreColor: [number, number, number] = [239, 68, 68];
    if (report.sustainabilityScore === 'High Performer') scoreColor = [34, 197, 94];
    else if (report.sustainabilityScore === 'Compliant') scoreColor = [249, 115, 22];

    doc.setFillColor(...scoreColor);
    doc.roundedRect(pageMargin, currentY, contentWidth, 30, 3, 3, 'F');
    doc.setTextColor(255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(report.sustainabilityScore, pageWidth / 2, currentY + 18, { align: 'center' });
    currentY += 50;

    // --- Emission Breakdown Table ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(63, 112, 77);
    doc.text('Average Monthly Emission Breakdown', pageMargin, currentY);
    currentY += 5;
  
    autoTable(doc, {
        startY: currentY,
        head: [['Source', 'Avg. Usage', 'Avg. Emission (kg CO₂e)']],
        body: report.breakdown.map(item => [item.source, item.usage, item.emission]),
        foot: [['Total Monthly Emissions', '', `${report.totalMonthlyKg.toFixed(2)} kg CO₂e`]],
        theme: 'grid',
        headStyles: { fillColor: [248, 247, 244], textColor: 50, fontStyle: 'bold' },
        footStyles: { fillColor: [248, 247, 244], textColor: 50, fontStyle: 'bold', halign: 'right'},
        didDrawPage: (data) => {
            currentY = data.cursor?.y || currentY;
        }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 20;

    // --- Recommendations ---
    if (currentY > pageHeight - 120) { // Check if new section fits
        doc.addPage();
        currentY = pageMargin;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(63, 112, 77);
    doc.text('Future Emission Reduction Strategies', pageMargin, currentY);
    currentY += 20;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    report.recommendations.forEach(rec => {
        const parts = rec.split(':');
        const title = parts[0];
        const body = parts.slice(1).join(':').trim();
        
        doc.setFont('helvetica', 'bold');
        doc.text(`• ${title}:`, pageMargin, currentY, { maxWidth: contentWidth });
        doc.setFont('helvetica', 'normal');
        const bodyLines = doc.splitTextToSize(body, contentWidth - 10);
        doc.text(bodyLines, pageMargin + 10, currentY + 12);
        currentY += (bodyLines.length * 12) + 15;

        if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = pageMargin;
        }
    });
  
    // --- Save the PDF ---
    doc.save(`Sustainability-Report-${user?.displayName?.replace(' ', '_') || 'report'}.pdf`);
  };
  
  if (userLoading) {
      return (
          <div className="space-y-6">
              <h1 className="text-3xl font-bold font-headline">AI-Powered Insights &amp; Reports</h1>
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
              <CardDescription>Upload an Excel sheet with your monthly data to generate a new AI-powered sustainability report. If no file is uploaded, a sample report will be generated.</CardDescription>
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
                <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
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

    