import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ReportIssuePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Report an Issue"
        description="Spotted a problem? Let us know so we can take action."
      />
      
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
            <CardTitle>New Issue Report</CardTitle>
            <CardDescription>
                Provide details about the waste management issue. Your report helps us improve our services.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form className='space-y-6'>
                <div className="space-y-2">
                    <Label htmlFor="location">Location of Issue</Label>
                    <Input id="location" placeholder="e.g., Corner of Oak & Maple St" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the issue in detail. e.g., overflowing public bin, illegal dumping..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="photo">Upload Photo</Label>
                    <Input id="photo" type="file" />
                    <p className="text-sm text-muted-foreground">A picture helps us understand the issue better.</p>
                </div>
                <Button>
                    <Send className='mr-2' />
                    Submit Report
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
