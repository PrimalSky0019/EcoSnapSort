import { ArrowRight, Camera, Recycle, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    title: 'Scan Waste',
    description: 'Use our AI to identify waste type and learn how to dispose of it correctly.',
    icon: Camera,
    href: '/scan-waste',
    cta: 'Scan Now',
    imageId: 'scan-waste-feature'
  },
  {
    title: 'Report Issues',
    description: 'See a waste problem? Snap a photo and report it to the authorities in seconds.',
    icon: Recycle,
    href: '/report-issue',
    cta: 'Report an Issue',
    imageId: 'report-issue-hero'
  },
  {
    title: 'Utility Shopping',
    description: 'Buy compost kits, segregated dustbins, and other waste management utilities.',
    icon: ShoppingCart,
    href: '/marketplace',
    cta: 'Shop Now',
    imageId: 'marketplace-dustbins'
  },
  {
    title: 'Community Action',
    description: 'Join cleanup drives and connect with fellow Green Champions in your area.',
    icon: Users,
    href: '/community-events',
    cta: 'Get Involved',
    imageId: 'community-event'
  },
];

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Eco Snap Sort</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover -z-10"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold">A Cleaner Future, One Snap at a Time.</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              The smart solution for waste management. Identify, report, and manage waste with a single tap.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <Link href="/signup">
                    Become a Green Champion <ArrowRight className="ml-2" />
                </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeader
                title="Your Toolkit for a Greener Community"
                description="Eco Snap Sort empowers every citizen to take an active role in waste management. Here's how:"
                className='text-center mb-12'
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const featureImage = PlaceHolderImages.find((img) => img.id === feature.imageId);
                return (
                  <Card key={feature.title} className='flex flex-col'>
                    {featureImage && (
                        <Image src={featureImage.imageUrl} alt={featureImage.description} width={400} height={250} className='w-full rounded-t-lg object-cover' data-ai-hint={featureImage.imageHint} />
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <feature.icon className="h-6 w-6 text-primary" />
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1" />
                    <div className='p-6 pt-0'>
                        <Button className="w-full" asChild>
                            <Link href={feature.href}>
                            {feature.cta} <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Eco Snap Sort. All Rights Reserved.</p>
          <p className="text-sm mt-2">Making our world cleaner, one community at a time.</p>
        </div>
      </footer>
    </div>
  );
}
