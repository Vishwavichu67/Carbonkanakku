'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileUp, Star, Award, Loader2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSustainabilityReport, GenerateSustainabilityReportOutput } from '@/ai/flows/generate-sustainability-report';
import { read, utils } from 'xlsx';
import jsPDF from 'jspdf';
import { useUser, useDoc } from '@/firebase';

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [report, setReport] = useState<GenerateSustainabilityReportOutput | null>(null);
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
      const workbook = read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      const result = await generateSustainabilityReport({
        companyName: userDoc?.companyName || "Your Company",
        excelData: JSON.stringify(jsonData),
      });

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
                <Button onClick={handleGenerateReport} disabled={isGenerating || !file || userDocLoading} className="w-full">
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
