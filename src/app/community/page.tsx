'use client';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard, FileText, BarChart2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function AboutPage() {
  const { user } = useUser();
  
  const features = [
      {
          icon: LayoutDashboard,
          title: "Live Dashboard",
          description: "Get a real-time overview of your carbon footprint, emission trends, and compliance status on a single, intuitive dashboard."
      },
      {
          icon: FileText,
          title: "Easy Data Input",
          description: "Effortlessly submit your monthly operational data through a simple, guided interface tailored to your specific textile subdomain."
      },
      {
          icon: BarChart2,
          title: "Automated Reporting",
          description: "Generate professional sustainability reports from your data with a single click, ready for internal review or external audits."
      }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">About CarbonKanakku</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            We are dedicated to empowering India's textile industry with accessible and powerful tools to navigate the complexities of ESG compliance and sustainability.
          </p>
        </div>

        <div className="pb-16 lg:pb-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-headline font-bold">What We Do</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">CarbonKanakku is an all-in-one platform designed to help small to medium-sized textile units measure, manage, and report their environmental impact.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <Card key={feature.title}>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                  <feature.icon className="w-8 h-8 text-primary" />
                                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center max-w-2xl mx-auto bg-secondary p-8 rounded-lg">
                    <h2 className="text-3xl font-headline font-bold">Join the Movement</h2>
                    <p className="text-muted-foreground mt-4">
                        Ready to take the next step in your sustainability journey? Register your factory today and start transforming your environmental data into actionable insights.
                    </p>
                    <Button asChild size="lg" className="mt-6 bg-primary text-primary-foreground">
                        <Link href={user ? "/dashboard" : "/register"}>
                            {user ? "Go to Dashboard" : "Register Your Factory"} <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
