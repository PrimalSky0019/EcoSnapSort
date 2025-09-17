import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin, Recycle, Wrench } from 'lucide-react';
import Image from 'next/image';

const facilities = [
  {
    name: 'Greenfield Recycling Center',
    type: 'Recycling Center',
    address: '456 Recycle Ave, Greenfield',
    hours: 'Mon-Sat: 8am - 6pm',
    icon: Recycle,
  },
  {
    name: 'Eco Scrap Traders',
    type: 'Scrap Shop',
    address: '789 Metal Rd, Greenfield',
    hours: 'Mon-Fri: 9am - 5pm',
    icon: Wrench,
  },
  {
    name: 'Central Waste Facility',
    type: 'Waste Management Facility',
    address: '101 Dump Drive, Greenfield',
    hours: '24/7',
    icon: MapPin,
  },
  {
    name: 'Southside Compost Hub',
    type: 'Recycling Center',
    address: '222 Organic Way, Greenfield',
    hours: 'Tue-Sun: 10am - 4pm',
    icon: Recycle,
  },
];

export default function LocateFacilitiesPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Waste Facility Locator"
        description="Find recycling centers, scrap shops, and other facilities near you."
      />

      <Card>
        <CardContent className="p-0">
          {mapImage && (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg">
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                data-ai-hint={mapImage.imageHint}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <Card key={facility.name}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <facility.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{facility.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-muted-foreground">{facility.type}</p>
              <p>{facility.address}</p>
              <p className="text-sm text-muted-foreground">{facility.hours}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
