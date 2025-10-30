import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FilePlus, Star, Award } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">AI-Powered Insights &amp; Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate Sustainability Report</CardTitle>
              <CardDescription>Create a comprehensive, AI-generated sustainability report (PDF/HTML) suitable for stakeholders and ESG certifications.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <FilePlus className="mx-auto h-24 w-24 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Click the button to generate a new report based on your latest data.</p>
              <Button>Generate New Report</Button>
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
