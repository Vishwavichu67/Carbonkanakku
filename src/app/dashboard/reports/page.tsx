
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileUp, Star, Award, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
        setFileName(file.name);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid Excel file (.xlsx).',
        });
        event.target.value = ''; // Clear the input
        setFileName('');
      }
    }
  };

  const handleGenerateReport = () => {
    if (!fileName) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please upload an Excel file to generate a report.',
      });
      return;
    }
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Report Generation Started',
        description: 'Your new sustainability report will be available soon.',
      });
    }, 3000);
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

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Past Reports</CardTitle>
          <CardDescription>Access and download previously generated reports.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg">
                <ul className="divide-y">
                    <li className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Monthly Report - May 2024</p>
                            <p className="text-sm text-muted-foreground">Generated on: June 1, 2024</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Download className="w-5 h-5" />
                        </Button>
                    </li>
                    <li className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Quarterly Report - Q1 2024</p>
                            <p className="text-sm text-muted-foreground">Generated on: April 5, 2024</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Download className="w-5 h-5" />
                        </Button>
                    </li>
                     <li className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Annual Report - 2023</p>
                            <p className="text-sm text-muted-foreground">Generated on: Jan 15, 2024</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Download className="w-5 h-5" />
                        </Button>
                    </li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
