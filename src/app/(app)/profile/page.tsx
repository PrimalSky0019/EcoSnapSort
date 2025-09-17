import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information."
      />
      
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
            <div className='flex items-center justify-between'>
                <CardTitle>User Information</CardTitle>
                <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Profile</span>
                </Button>
            </div>
            <CardDescription>
                Your details as a registered Green Champion.
            </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
           <div className="flex items-center gap-6">
             <Avatar className="h-24 w-24">
                <AvatarImage src="https://picsum.photos/seed/avatar/200/200" alt="User Avatar" />
                <AvatarFallback>GC</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
                <h2 className='text-2xl font-bold'>Green Champion</h2>
                <p className='text-muted-foreground'>citizen@example.com</p>
                <p className='text-sm text-muted-foreground pt-2'>Joined: July 1, 2024</p>
            </div>
           </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p>Greenfield, Earth</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Training Status</p>
                    <p className='font-semibold text-primary'>Certified Green Champion</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Issues Reported</p>
                    <p>12</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Events Joined</p>
                    <p>3</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
