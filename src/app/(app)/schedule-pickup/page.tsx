import { PageHeader } from '@/components/page-header';
import { ScheduleForm } from './schedule-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SchedulePickupPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Schedule Garbage Pickup"
        description="Arrange for a special garbage collection based on your location and preferred time."
      />
      <Card>
        <CardHeader>
          <CardTitle>New Pickup Request</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm />
        </CardContent>
      </Card>
    </div>
  );
}
