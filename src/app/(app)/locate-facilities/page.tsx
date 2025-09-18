
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the map component to ensure it's only rendered on the client side.
const RecyclingMap = dynamic(() => import('./recycling-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full rounded-lg bg-secondary animate-pulse" />,
});

export default function LocateFacilitiesPage() {
  const Map = useMemo(() => RecyclingMap, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Waste Facility Locator"
        description="Find recycling centers, scrap shops, and other facilities near you."
      />

      <Card>
        <CardContent className="p-2 md:p-4">
            <Map />
        </CardContent>
      </Card>
    </div>
  );
}
