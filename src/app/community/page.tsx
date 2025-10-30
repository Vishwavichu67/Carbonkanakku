import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Community &amp; Support Zone</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A future space for collaboration, discussion, and expert advice on textile sustainability.
          </p>
        </div>

        <div className="pb-16 lg:pb-24">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="text-center">
                        <CardHeader>
                            <Users className="mx-auto h-10 w-10 text-accent" />
                            <CardTitle className="font-headline mt-4">Connect with Peers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Share challenges and solutions with other textile industry members on the same journey.</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <Award className="mx-auto h-10 w-10 text-accent" />
                            <CardTitle className="font-headline mt-4">Ask the Experts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Get insights from ESG consultants and policy experts in dedicated Q&amp;A sessions.</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <MessageSquare className="mx-auto h-10 w-10 text-accent" />
                            <CardTitle className="font-headline mt-4">Join the Discussion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Participate in forums about new technologies, compliance hurdles, and best practices.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-16 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-headline font-bold">Coming Soon</h2>
                    <p className="text-muted-foreground mt-4">
                        Our community platform is under development. Join the waitlist to be the first to know when it launches and gain early access.
                    </p>
                    <form className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <Input type="email" placeholder="Enter your email" className="max-w-sm" />
                        <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground">Join Waitlist</Button>
                    </form>
                </div>
            </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
