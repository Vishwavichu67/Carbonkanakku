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

const trendData = [
  { name: 'Jan', electricity: 4000, water: 2400, waste: 240 },
  { name: 'Feb', electricity: 3000, water: 1398, waste: 221 },
  { name: 'Mar', electricity: 2000, water: 9800, waste: 229 },
  { name: 'Apr', electricity: 2780, water: 3908, waste: 200 },
  { name: 'May', electricity: 1890, water: 4800, waste: 218 },
  { name: 'Jun', electricity: 2390, water: 3800, waste: 250 },
];

export default function AnalysisPage() {
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
            <p>Your unit emits <span className="text-destructive font-bold">18% more CO₂</span> than the Tiruppur average for spinning units.</p>
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
