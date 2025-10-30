'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Lightbulb,
  FileText,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const benchmarkData = [
  { name: "Your Unit", co2: 18.5, color: "hsl(var(--primary))" },
  { name: "Industry Avg.", co2: 15.2, color: "hsl(var(--muted-foreground))" },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Carbon Footprint */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <TrendingUp className="text-primary" />
            Current Carbon Footprint
          </CardTitle>
          <CardDescription>Your estimated CO₂e for this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-headline">18.5 tons CO₂e</div>
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertTriangle className="w-4 h-4"/> <span>5% higher than last month</span>
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
            <Progress value={65} className="h-3" />
            <p className="text-center text-sm mt-2 text-muted-foreground">Your emissions are in the 'Moderate-High' range.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Insights */}
      <Card className="lg:col-span-2 bg-accent/10 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-accent">
            <Lightbulb />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <p className="text-sm">"Switching to reactive dye 'EcoDye-300' could reduce your COD load by up to 22%."</p>
            <p className="text-sm">"Based on your machine usage, we recommend optimizing boiler operational hours to 5.6/day to save energy."</p>
            <Button variant="link" asChild className="p-0 h-auto text-accent">
              <Link href="/dashboard/analysis">
                View All Suggestions <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bell />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 mt-1 text-primary" />
            <p>
              <span className="font-semibold">Data Submitted:</span> Water &amp; Chemical usage for Dyeing Unit.
              <span className="block text-xs text-muted-foreground">2 days ago</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-1 text-green-600" />
            <p>
              <span className="font-semibold">Milestone Achieved:</span> 3 consecutive months of data entry.
              <span className="block text-xs text-muted-foreground">5 days ago</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle />
            Compliance Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <p>
              <span className="font-semibold">SEBI BRSR Filing:</span>
              <span className="block text-xs text-red-500">Due in 15 days</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <p>
              <span className="font-semibold">MSME Green Scheme Report:</span>
              <span className="block text-xs text-orange-500">Due in 45 days</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Emission Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <BarChart2 />
            Emission Trends
          </CardTitle>
          <CardDescription>Monthly CO₂e emissions over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparative Benchmark */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Comparative Benchmark</CardTitle>
          <CardDescription>Your CO₂ emissions vs. the Tiruppur industry average (tons CO₂e per unit output).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={benchmarkData} layout="vertical" barSize={40}>
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
               <Tooltip
                cursor={{fill: 'transparent'}}
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
               <Bar dataKey="co2" radius={[0, 4, 4, 0]}>
                {benchmarkData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                ))}
               </Bar>
            </BarChart>
          </ResponsiveContainer>
           <p className="text-center text-sm mt-2 text-destructive font-semibold">Your unit emits 18% more CO₂ than the regional average.</p>
        </CardContent>
      </Card>
    </div>
  );
}
