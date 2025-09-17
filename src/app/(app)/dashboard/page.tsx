import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, CalendarClock, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const scheduleImage = PlaceHolderImages.find(img => img.id === 'dashboard-card-1');
  const locateImage = PlaceHolderImages.find(img => img.id === 'dashboard-card-2');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome, Green Champion!"
        description="Your hub for making our community cleaner and greener."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          {scheduleImage && (
            <Image
              src={scheduleImage.imageUrl}
              alt={scheduleImage.description}
              width={600}
              height={400}
              className="w-full object-cover"
              data-ai-hint={scheduleImage.imageHint}
            />
          )}
          <CardHeader>
            <CardTitle>Schedule a Pickup</CardTitle>
            <CardDescription>
              Need to dispose of bulk waste? Schedule a special garbage pickup at your convenience.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/schedule-pickup">
                Schedule Now <ArrowRight className="ml-2" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          {locateImage && (
            <Image
              src={locateImage.imageUrl}
              alt={locateImage.description}
              width={600}
              height={400}
              className="w-full object-cover"
              data-ai-hint={locateImage.imageHint}
            />
          )}
          <CardHeader>
            <CardTitle>Find Facilities</CardTitle>
            <CardDescription>
              Locate nearby recycling centers, scrap shops, and waste management facilities.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/locate-facilities">
                Open Locator <ArrowRight className="ml-2" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
