'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart2, Lightbulb, CheckCircle } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from 'recharts';
import { useUser } from "@/firebase";
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const benchmarkChartData = [
    { name: 'Water Usage', your_unit: 1500, industry_avg: 1800 },
    { name: 'Energy (kWh/ton)', your_unit: 850, industry_avg: 720 },
    { name: 'Waste (kg/ton)', your_unit: 45, industry_avg: 60 },
    { name: 'CO2e (t/year)', your_unit: 220, industry_avg: 190 },
]

export default function AnalysisPage() {
    const { user, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState<any[]>([]);
    const [benchmarkComparison, setBenchmarkComparison] = useState(0);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mockTrendData = months.map(month => ({
                name: month,
                electricity: Math.floor(Math.random() * (25000 - 15000) + 15000),
                water: Math.floor(Math.random() * (1600000 - 1400000) + 1400000),
                waste: Math.floor(Math.random() * (500 - 300) + 300),
            }));
            
            const latestElectricity = mockTrendData[mockTrendData.length - 1].electricity;
            const yourCO2 = (latestElectricity * 0.82 * 12) / 1000;
            const industryAverage = 15.2 * 100; // Example average tCO2e
            const mockBenchmarkComparison = ((yourCO2 / industryAverage) * 100) - 100;

            setTrendData(mockTrendData);
            setBenchmarkComparison(mockBenchmarkComparison);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

  if (loading || userLoading) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-96" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                         <Skeleton className="h-8 w-56" />
                         <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <Skeleton className="h-8 w-48" />
                         <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Data Analysis &amp; Visualization</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <TrendingUp />
            Emission Trend Analysis
          </CardTitle>
          <CardDescription>A detailed look at your resource consumption and emissions over the past year.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }}/>
              <Line type="monotone" dataKey="electricity" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Electricity (kWh)" />
              <Line type="monotone" dataKey="water" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Water (Liters)" />
              <Line type="monotone" dataKey="waste" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Waste (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BarChart2 />
              Comparative Benchmark
            </CardTitle>
            <CardDescription>Your performance against industry averages.</CardDescription>
          </CardHeader>
          <CardContent>
             <p>Your unit emits <span className="text-destructive font-bold">{Math.abs(benchmarkComparison).toFixed(0)}% {benchmarkComparison > 0 ? 'more' : 'less'} CO₂</span> than the Tiruppur average for spinning units.</p>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                      <Tooltip 
                        contentStyle={{
                          background: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "14px" }}/>
                      <Bar dataKey="your_unit" fill="hsl(var(--primary))" name="Your Unit" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="industry_avg" fill="hsl(var(--muted))" name="Industry Average" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb />
              AI Suggestions
            </CardTitle>
            <CardDescription>Actionable steps to improve your sustainability metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 text-primary" />
              <p><span className="font-semibold">Reactive Dyes:</span> Switch to reactive dye X to reduce COD load by 22% and water consumption by 15%.</p>
            </div>
             <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 text-primary" />
              <p><span className="font-semibold">Boiler Optimization:</span> Optimize boiler usage to recommended operational hours of 5.6/day to cut fuel costs by 8%.</p>
            </div>
             <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 text-primary" />
              <p><span className="font-semibold">Waste Reduction:</span> Implement pattern-cutting software to reduce fabric waste by an average of 12% per garment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
