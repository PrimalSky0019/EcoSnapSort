import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Truck } from 'lucide-react';
import Image from 'next/image';

const vehicles = [
  {
    id: 'TR-001',
    area: 'Greenfield North',
    status: 'On Route',
    lastUpdate: '2 mins ago',
    variant: 'default',
  },
  {
    id: 'TR-002',
    area: 'Downtown',
    status: 'Collection in Progress',
    lastUpdate: '5 mins ago',
    variant: 'default',
  },
  {
    id: 'TR-003',
    area: 'West Suburbs',
    status: 'Returning to Facility',
    lastUpdate: '10 mins ago',
    variant: 'secondary',
  },
  {
    id: 'TR-004',
    area: 'Eastside',
    status: 'On Route',
    lastUpdate: '1 min ago',
    variant: 'default',
  },
    {
    id: 'TR-005',
    area: 'Industrial Park',
    status: 'Break',
    lastUpdate: '30 mins ago',
    variant: 'destructive',
  },
];

export default function TrackVehiclesPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Waste Vehicle Tracker"
        description="View the real-time location and status of collection vehicles in your area."
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
            <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle ID</TableHead>
                        <TableHead>Assigned Area</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                            <TableCell className='font-medium'>{vehicle.id}</TableCell>
                            <TableCell>{vehicle.area}</TableCell>
                            <TableCell>
                                <Badge variant={vehicle.variant as any}>{vehicle.status}</Badge>
                            </TableCell>
                            <TableCell>{vehicle.lastUpdate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
