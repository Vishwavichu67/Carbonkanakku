import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { subdomains, newsFeed, whySustainabilityMatters } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Zap, Droplets, Factory, MoveRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-banner');
  const infographicImage = PlaceHolderImages.find((img) => img.id === 'emission-infographic');

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-md">
              Empowering Textile Industries for a Greener Tomorrow.
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mb-8 drop-shadow">
              The all-in-one platform for Indian textile SMBs to track emissions, ensure compliance, and embrace sustainability.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Link href="/register">
                Register Your Factory <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Why Sustainability Matters Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Sustainability in Textiles Matters</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                India's textile industry is vital, but faces significant environmental challenges. Small changes can lead to a massive positive impact.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {whySustainabilityMatters.map((item, index) => {
                const Icon = item.icon;
                return (
                <Card key={index} className="border-2 border-primary/10 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline mt-4">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.stat}</p>
                  </CardContent>
                </Card>
              )})}
            </div>
            <div className="mt-16">
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-8 md:p-12">
                    <h3 className="text-2xl font-headline font-bold mb-4">A Visual Journey of Emissions</h3>
                    <p className="text-muted-foreground mb-6">From raw materials to finished garments, every step has an environmental footprint. Understanding this flow is the first step towards reducing it.</p>
                    <div className="space-y-4">
                      {['Cotton Farming', 'Spinning & Weaving', 'Dyeing & Finishing', 'Garment Assembly'].map((step, index) => (
                         <div key={index} className="flex items-center">
                           <MoveRight className="text-primary mr-4" />
                           <span>{step}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-64 md:h-full w-full relative">
                    {infographicImage && (
                       <Image src={infographicImage.imageUrl} alt={infographicImage.description} fill className="object-cover" data-ai-hint={infographicImage.imageHint}/>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Subdomains Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Find Your Niche</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                Every textile subdomain has unique ESG challenges. We provide tailored tools and insights for your specific needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {subdomains.map((subdomain) => {
                const image = PlaceHolderImages.find((img) => img.id === subdomain.image);
                return (
                  <Link href="/register" key={subdomain.name}>
                    <Card className="group overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 w-full">
                        {image && (
                          <Image src={image.imageUrl} alt={image.description} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={image.imageHint}/>
                        )}
                      </div>
                      <CardHeader className="flex-grow">
                        <div className="flex items-center gap-4">
                          <subdomain.icon className="w-8 h-8 text-primary" />
                          <CardTitle className="font-headline text-xl">{subdomain.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{subdomain.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest News Feed */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Stay Ahead of the Curve</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                The ESG landscape is always evolving. Get the latest updates on policies, technologies, and compliance.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {newsFeed.map((item) => (
                <Card key={item.title} className="flex flex-col">
                  <CardHeader>
                    <span className="text-sm text-primary font-semibold">{item.category}</span>
                    <CardTitle className="text-lg font-headline">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{item.summary}</p>

                  </CardContent>
                  <div className="p-6 pt-0">
                     <Button variant="link" asChild className="p-0 h-auto">
                      <Link href="/hub">Read More <ArrowRight className="ml-2 w-4 h-4"/></Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Become an ESG-Compliant Textile Unit</h2>
            <p className="text-lg text-primary-foreground/80 mt-4 max-w-3xl mx-auto">
              Start measuring your impact today. Join a community of forward-thinking businesses shaping a sustainable future for the textile industry.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold mt-8">
              <Link href="/register">
                Start ESG Tracking Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
