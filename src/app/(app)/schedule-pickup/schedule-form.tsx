'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Send, ServerCrash } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  scheduleGarbagePickup,
  type ScheduleGarbagePickupOutput,
} from '@/ai/flows/schedule-garbage-pickup';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  preferredDate: z.date({
    required_error: 'A pickup date is required.',
  }),
  preferredTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

export function ScheduleForm() {
  const [response, setResponse] = useState<ScheduleGarbagePickupOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '123 Eco Street, Greenfield',
      preferredTime: '14:30',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResponse(null);
    try {
      const input = {
        location: values.location,
        preferredDate: format(values.preferredDate, 'yyyy-MM-dd'),
        preferredTime: values.preferredTime,
        reportDatabase: 'WasteReportsDB',
        gpsDatabase: 'VehicleGPSDB',
      };
      const result = await scheduleGarbagePickup(input);
      setResponse(result);
      toast({
        title: 'Schedule Submitted',
        description: 'Your pickup request has been processed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Failed to schedule pickup. The AI service may be unavailable.',
      });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Pickup Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Time (HH:MM)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 14:30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2" />
                Schedule Pickup
              </>
            )}
          </Button>
        </form>
      </Form>

      {response && (
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle>Scheduling Result</CardTitle>
            <CardDescription>
              The AI has processed your request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Send className="h-4 w-4" />
              <AlertTitle>Confirmation</AlertTitle>
              <AlertDescription>
                {response.confirmationMessage}
              </AlertDescription>
            </Alert>
            {response.supervisorNotification && (
              <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Supervisor Alert</AlertTitle>
                <AlertDescription>
                  {response.supervisorNotification}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
