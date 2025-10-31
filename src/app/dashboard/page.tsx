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
import { useUser, useDoc } from "@/firebase";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const benchmarkData = [
  { name: "Industry Avg.", co2: 15.2, color: "hsl(var(--muted-foreground))" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const userDocPath = user ? `users/${user.uid}` : null;
  const { data: userDoc, loading: userDocLoading } = useDoc<any>(userDocPath);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const [lastMonthComparison, setLastMonthComparison] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any>(null);


  useEffect(() => {
    // Simulate fetching dynamic data
    setLoading(true);
    const timer = setTimeout(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockChartData = months.map(month => ({
        name: month,
        value: (Math.random() * (25 - 10) + 10).toFixed(2),
      }));

      const mockCurrentFootprint = parseFloat(mockChartData[mockChartData.length - 1].value);
      const previousFootprint = parseFloat(mockChartData[mockChartData.length - 2].value);
      const mockLastMonthComparison = ((mockCurrentFootprint - previousFootprint) / previousFootprint) * 100;
      
      setChartData(mockChartData);
      setCurrentFootprint(mockCurrentFootprint);
      setLastMonthComparison(mockLastMonthComparison);

      setRecentActivity({
          subdomain: "Spinning Units",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const yourBenchmark = { name: "Your Unit", co2: currentFootprint, color: "hsl(var(--primary))" };
  const combinedBenchmarkData = [yourBenchmark, ...benchmarkData];

  if (loading || userDocLoading) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <TrendingUp className="text-primary" />
            Current Carbon Footprint
          </CardTitle>
          <CardDescription>Your estimated annual CO₂e based on the latest data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-headline">{currentFootprint.toFixed(2)} tons CO₂e</div>
          <p className={`text-sm flex items-center gap-1 mt-1 ${lastMonthComparison >= 0 ? 'text-destructive' : 'text-green-600'}`}>
            <AlertTriangle className="w-4 h-4"/> <span>{Math.abs(lastMonthComparison).toFixed(0)}% {lastMonthComparison >= 0 ? 'higher' : 'lower'} than last month</span>
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
            <Progress value={(currentFootprint / 30)}
              className="h-3" />
            <p className="text-center text-sm mt-2 text-muted-foreground">Your emissions are in the 'Moderate' range.</p>
          </div>
        </CardContent>
      </Card>
      
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bell />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {recentActivity ? (
            <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 mt-1 text-primary" />
                <p>
                <span className="font-semibold">Data Submitted:</span> {recentActivity.subdomain}.
                <span className="block text-xs text-muted-foreground">{recentActivity.date.toLocaleDateString()}</span>
                </p>
            </div>
          ) : <p className="text-muted-foreground">No recent activity.</p>}
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-1 text-green-600" />
            <p>
              <span className="font-semibold">Milestone Achieved:</span> 3 consecutive months of data entry.
              <span className="block text-xs text-muted-foreground">5 days ago</span>
            </p>
          </div>
        </CardContent>
      </Card>

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
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="t" />
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

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Comparative Benchmark</CardTitle>
          <CardDescription>Your CO₂ emissions vs. the Tiruppur industry average (tons CO₂e per unit output).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={combinedBenchmarkData} layout="vertical" barSize={40}>
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
                {combinedBenchmarkData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                ))}
               </Bar>
            </BarChart>
          </ResponsiveContainer>
           <p className="text-center text-sm mt-2 text-destructive font-semibold">Your unit emits {Math.abs(currentFootprint/15.2 * 100 - 100).toFixed(0)}% more CO₂ than the regional average.</p>
        </CardContent>
      </Card>
    </div>
  );
}
