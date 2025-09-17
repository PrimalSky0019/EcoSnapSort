'use server';

/**
 * @fileOverview Notifies supervisors of unusual garbage pickup schedules to investigate potential improper waste handling.
 *
 * - notifySupervisorsOfUnusualSchedule - A function that checks if a garbage pickup schedule is unusual and notifies supervisors if so.
 * - NotifySupervisorsOfUnusualScheduleInput - The input type for the notifySupervisorsOfUnusualSchedule function.
 * - NotifySupervisorsOfUnusualScheduleOutput - The return type for the notifySupervisorsOfUnusualSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotifySupervisorsOfUnusualScheduleInputSchema = z.object({
  location: z.string().describe('The location of the garbage pickup request.'),
  pickupTime: z.string().describe('The requested garbage pickup time (e.g., 2:00 AM).'),
  typicalPickupTimes: z.string().describe('The typical garbage pickup times for the area (e.g., 8:00 AM - 5:00 PM).'),
  reportingDatabaseQuery: z.string().describe('JSON string of a query to the reporting database.'),
  gpsDatabaseQuery: z.string().describe('JSON string of a query to the GPS database.'),
});
export type NotifySupervisorsOfUnusualScheduleInput = z.infer<
  typeof NotifySupervisorsOfUnusualScheduleInputSchema
>;

const NotifySupervisorsOfUnusualScheduleOutputSchema = z.object({
  isUnusual: z.boolean().describe('Whether the pickup time is unusual for the location.'),
  notificationMessage: z.string().describe('The message to send to supervisors if the schedule is unusual.'),
});
export type NotifySupervisorsOfUnusualScheduleOutput = z.infer<
  typeof NotifySupervisorsOfUnusualScheduleOutputSchema
>;

export async function notifySupervisorsOfUnusualSchedule(
  input: NotifySupervisorsOfUnusualScheduleInput
): Promise<NotifySupervisorsOfUnusualScheduleOutput> {
  return notifySupervisorsOfUnusualScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'notifySupervisorsOfUnusualSchedulePrompt',
  input: {schema: NotifySupervisorsOfUnusualScheduleInputSchema},
  output: {schema: NotifySupervisorsOfUnusualScheduleOutputSchema},
  prompt: `You are an AI assistant that helps waste management supervisors monitor garbage pickup schedules.

  A user has requested a garbage pickup at the following location and time:
  Location: {{{location}}}
  Pickup Time: {{{pickupTime}}}

  Typical garbage pickup times for this area are:
  {{{typicalPickupTimes}}}

  You also have the ability to query reporting and GPS databases, using these queries:
  Reporting Database Query: {{{reportingDatabaseQuery}}}
  GPS Database Query: {{{gpsDatabaseQuery}}}

  Determine if the requested pickup time is unusual for the specified location, taking into account the typical pickup times.

  If the pickup time is unusual, generate a notification message for supervisors, alerting them to potential improper waste handling or dumping.  Make sure to include the location and pickup time in the notification message.

  Return a JSON object with the following fields:
  - isUnusual (boolean): true if the pickup time is unusual, false otherwise.
  - notificationMessage (string): The message to send to supervisors if the schedule is unusual.  If the schedule is not unusual, this field should be an empty string.

  Example 1:
  Input:
  {
  "location": "123 Main St, Anytown",
  "pickupTime": "2:00 AM",
  "typicalPickupTimes": "8:00 AM - 5:00 PM"
  }
  Output:
  {
  "isUnusual": true,
  "notificationMessage": "Unusual garbage pickup scheduled for 123 Main St, Anytown at 2:00 AM. Please investigate potential improper waste handling or dumping."
  }

  Example 2:
  Input:
  {
  "location": "456 Elm St, Anytown",
  "pickupTime": "10:00 AM",
  "typicalPickupTimes": "8:00 AM - 5:00 PM"
  }
  Output:
  {
  "isUnusual": false,
  "notificationMessage": ""
  }

  Output:
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const notifySupervisorsOfUnusualScheduleFlow = ai.defineFlow(
  {
    name: 'notifySupervisorsOfUnusualScheduleFlow',
    inputSchema: NotifySupervisorsOfUnusualScheduleInputSchema,
    outputSchema: NotifySupervisorsOfUnusualScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
