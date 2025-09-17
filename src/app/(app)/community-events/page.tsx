import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, Clock, MapPin, UserPlus } from 'lucide-react';
import Image from 'next/image';

const events = [
  {
    title: 'Greenfield Park Cleanup',
    date: 'Saturday, July 20, 2024',
    time: '9:00 AM - 12:00 PM',
    location: 'Greenfield Central Park',
    description: 'Join us to clean up our beautiful central park. Gloves and bags will be provided.',
    imageId: 'community-event',
  },
  {
    title: 'Riverbank Restoration Day',
    date: 'Sunday, July 28, 2024',
    time: '10:00 AM - 1:00 PM',
    location: 'Riverside Walkway',
    description: 'Help us clear debris and plant native species along the riverbank.',
    imageId: 'community-event',
  },
  {
    title: 'Eastside Neighborhood Sweep',
    date: 'Saturday, August 3, 2024',
    time: '8:30 AM - 11:00 AM',
    location: 'Eastside Community Center',
    description: 'A collaborative effort to tidy up the streets and public spaces in the Eastside area.',
    imageId: 'community-event',
  },
];

export default function CommunityEventsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Cleanup Days"
        description="Get involved and help make our public spaces cleaner for everyone."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const image = PlaceHolderImages.find((img) => img.id === event.imageId);
          return (
            <Card key={event.title} className="flex flex-col">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={400}
                  height={250}
                  className="w-full rounded-t-lg object-cover"
                  data-ai-hint={image.imageHint}
                />
              )}
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className='h-4 w-4' />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className='h-4 w-4' />
                    <span>{event.time}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className='h-4 w-4' />
                    <span>{event.location}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className='w-full'>
                    <UserPlus className='mr-2' />
                    Join Event
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
