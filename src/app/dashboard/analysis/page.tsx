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
  Legend
} from 'recharts';
import { useUser, useDoc, useCollection } from "@/firebase";
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalysisPage() {
  const { user } = useUser();
  const userDocPath = user ? `users/${user.uid}` : null;
  const { data: userDoc } = useDoc<any>(userDocPath);
  
  const companyDataPath = userDoc?.companyId ? `companies/${userDoc.companyId}/data` : null;
  const { data: companyData, loading: companyDataLoading } = useCollection<any>(companyDataPath || '', { orderBy: 'createdAt', limit: 12, skip: !companyDataPath });

  const { trendData, benchmarkComparison } = useMemo(() => {
    if (!companyData || companyData.length === 0) {
      return { trendData: [], benchmarkComparison: 0 };
    }

    const sortedData = [...companyData].sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

    const trendData = sortedData.map(entry => {
      const electricity = entry.data['electricity-usage'] || 0;
      const water = entry.data['water-used'] || 0;
      const waste = entry.data['fabric-waste'] || 0;
      
      return {
        name: new Date(entry.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' }),
        electricity,
        water,
        waste
      };
    });

    const latestEntry = sortedData[sortedData.length - 1];
    const latestElectricity = latestEntry.data['electricity-usage'] || 0;
    const latestDiesel = latestEntry.data['diesel-usage'] || 0;
    const latestCoal = latestEntry.data['coal-usage'] || 0;
    const yourCO2 = ((latestElectricity * 0.82 + latestDiesel * 2.68 + latestCoal * 2420) * 12) / 1000;
    const industryAverage = 15.2 * 100; // Example average
    const benchmarkComparison = ((yourCO2 / industryAverage) * 100) - 100;

    return { trendData, benchmarkComparison };
  }, [companyData]);

  if (companyDataLoading) {
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
          <CardDescription>A detailed look at your resource consumption and emissions over time.</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
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
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                <p>Submit data to see your emission trends.</p>
            </div>
          )}
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
            {companyData.length > 0 ? (
                <p>Your unit emits <span className="text-destructive font-bold">{benchmarkComparison.toFixed(0)}% more CO₂</span> than the Tiruppur average for spinning units.</p>
            ) : (
                <p className="text-muted-foreground">Submit data to see your industry benchmark.</p>
            )}
            <div className="h-48 flex items-center justify-center text-muted-foreground">
                [Detailed Benchmark Chart]
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

    