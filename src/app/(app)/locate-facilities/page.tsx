'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const facilities = [
  {
    id: 1,
    name: 'E-Waste Recycling Center',
    type: 'Electronics',
    location: 'Delhi',
    contact: '📞 +91-9876543210',
  },
  {
    id: 2,
    name: 'Textile Recycling Facility',
    type: 'Cotton / Clothes',
    location: 'Mumbai',
    contact: '📧 textiles@recycle.org',
  },
  {
    id: 3,
    name: 'Greenfield Recycling Center',
    type: 'General Recycling',
    location: 'Nagpur',
    contact: '📞 +91-1234567890',
  },
  {
    id: 4,
    name: 'Eco Scrap Traders',
    type: 'Scrap Shop',
    location: 'Bengaluru',
    contact: '📧 scrap@trade.com',
  },
];

export default function LocateFacilitiesPage() {
  const mapImage = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );

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

      <Card>
        <CardHeader>
          <CardTitle>Facility List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell>{facility.type}</TableCell>
                  <TableCell>{facility.location}</TableCell>
                  <TableCell>{facility.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}