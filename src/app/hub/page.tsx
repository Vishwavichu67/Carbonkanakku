import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { caseStudies, hubTabs, newsFeed } from "@/lib/constants";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

const placeholderMandate = `The Securities and Exchange Board of India (SEBI) has introduced the Business Responsibility and Sustainability Reporting (BRSR) framework, which replaces the existing Business Responsibility Reporting (BRR). This new framework aims to establish more comprehensive and standardized disclosures on ESG (Environmental, Social, and Governance) parameters for listed companies. From the financial year 2022-2023, BRSR reporting is mandatory for the top 1000 listed companies by market capitalization. The BRSR framework is aligned with global reporting standards and is designed to provide greater transparency and accountability from companies on their sustainability performance. It covers nine principles of the National Guidelines on Responsible Business Conduct and requires companies to report on their performance against these principles.`;

export default function HubPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow bg-secondary/50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Industry &amp; Compliance Hub</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
              Your central resource for ESG knowledge, compliance updates, and textile industry innovations.
            </p>
          </div>

          <Tabs defaultValue="news" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4">
                {hubTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="news">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {newsFeed.concat(newsFeed).map((item, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <span className="text-sm text-primary font-semibold">{item.category}</span>
                            <CardTitle className="text-lg font-headline">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground text-sm">{item.summary}</p>
                        </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="innovations">
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Case Studies: Success Stories from India</CardTitle>
                    <CardDescription>Learn from industry leaders who are making a difference.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {caseStudies.map(study => {
                        const image = PlaceHolderImages.find(img => img.id === study.image);
                        return (
                            <div key={study.id} className="grid md:grid-cols-3 gap-6 items-center">
                                <div className="relative h-48 w-full rounded-lg overflow-hidden md:col-span-1">
                                    {image && <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />}
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold font-headline">{study.title}</h3>
                                    <p className="text-muted-foreground mt-2">{study.summary}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regulations">
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">AI-Powered Compliance Summarizer</CardTitle>
                            <CardDescription>Paste any ESG mandate, incentive, or guide to get a quick summary.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="document-text">Document Text</Label>
                                <Textarea id="document-text" rows={10} defaultValue={placeholderMandate} placeholder="Paste your document text here..." />
                            </div>
                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                <FileText className="w-4 h-4 mr-2"/>
                                Summarize with AI
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                    <Card className="bg-primary/5 border-primary">
                        <CardHeader>
                             <CardTitle className="font-headline">Generated Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                SEBI's new Business Responsibility and Sustainability Reporting (BRSR) framework is now mandatory for the top 1000 listed Indian companies by market cap, starting from FY 2022-23. It replaces the older BRR and requires more detailed and standardized ESG disclosures aligned with global standards.
                            </p>
                        </CardContent>
                    </Card>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="policy">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Carbon Policy in India</CardTitle>
                        <CardDescription>An overview of current and proposed carbon-related policies affecting the textile industry.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Perform, Achieve and Trade (PAT) Scheme</h3>
                            <p className="text-sm text-muted-foreground">The PAT scheme is a market-based mechanism to enhance energy efficiency in large energy-intensive industries, including some textile units. It sets targets for energy reduction, and units that over-comply can trade energy-saving certificates.</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">Carbon Credit Trading Scheme (CCTS)</h3>
                            <p className="text-sm text-muted-foreground">The Indian government is developing a domestic carbon market. This will allow companies to trade carbon credits, creating a financial incentive for reducing greenhouse gas emissions.</p>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
