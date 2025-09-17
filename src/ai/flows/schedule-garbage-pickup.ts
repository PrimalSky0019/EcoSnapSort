'use server';

/**
 * @fileOverview This file defines a Genkit flow for scheduling garbage pickup based on user location and notifying supervisors of unusual schedules.
 *
 * - scheduleGarbagePickup -  A function that allows users to schedule garbage pickup based on their location.
 * - ScheduleGarbagePickupInput - The input type for the scheduleGarbagePickup function.
 * - ScheduleGarbagePickupOutput - The return type for the scheduleGarbagePickup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleGarbagePickupInputSchema = z.object({
  location: z
    .string()
    .describe('The GPS coordinates of the user requesting garbage pickup.'),
  preferredDate: z
    .string()
    .describe('The user specified date for the garbage pickup (YYYY-MM-DD).'),
  preferredTime: z
    .string()
    .describe('The user specified time for the garbage pickup (HH:MM).'),
  reportDatabase: z.string().describe('The database containing waste management reports.'),
  gpsDatabase: z.string().describe('The database containing GPS coordinates of waste management vehicles.'),
});

export type ScheduleGarbagePickupInput = z.infer<
  typeof ScheduleGarbagePickupInputSchema
>;

const ScheduleGarbagePickupOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe('A message confirming the garbage pickup schedule.'),
  supervisorNotification: z
    .string()
    .optional()
    .describe(
      'A message to supervisors if the schedule is unusual, prompting them to check for improper waste handling.'
    ),
});

export type ScheduleGarbagePickupOutput = z.infer<
  typeof ScheduleGarbagePickupOutputSchema
>;

export async function scheduleGarbagePickup(
  input: ScheduleGarbagePickupInput
): Promise<ScheduleGarbagePickupOutput> {
  return scheduleGarbagePickupFlow(input);
}

const checkScheduleAnomalies = ai.defineTool({
  name: 'checkScheduleAnomalies',
  description: 'Checks if the requested garbage pickup schedule is unusual for the given location, querying the reporting and GPS databases.',
  inputSchema: z.object({
    location: z
      .string()
      .describe('The GPS coordinates of the user requesting garbage pickup.'),
    preferredDate: z
      .string()
      .describe('The user specified date for the garbage pickup (YYYY-MM-DD).'),
    preferredTime: z
      .string()
      .describe('The user specified time for the garbage pickup (HH:MM).'),
    reportDatabase: z.string().describe('The database containing waste management reports.'),
    gpsDatabase: z.string().describe('The database containing GPS coordinates of waste management vehicles.'),
  }),
  outputSchema: z.string().optional(),
}, async (input) => {
  // TODO: Implement the logic to check for schedule anomalies using the provided databases.
  // This is a placeholder; replace with actual database querying and anomaly detection.
  if (input.preferredTime === '03:00') {
    return `Unusual garbage pickup time requested at 3 AM for location ${input.location}. Please verify.`;
  }
  return undefined;
});

const prompt = ai.definePrompt({
  name: 'scheduleGarbagePickupPrompt',
  tools: [checkScheduleAnomalies],
  input: {schema: ScheduleGarbagePickupInputSchema},
  output: {schema: ScheduleGarbagePickupOutputSchema},
  prompt: `You are a garbage pickup scheduling assistant. A user has requested to schedule a garbage pickup at the following:

  Location: {{{location}}}
  Date: {{{preferredDate}}}
  Time: {{{preferredTime}}}

  First, use the checkScheduleAnomalies tool to check if the requested schedule is unusual.  If so, include the message in the supervisorNotification field.
  Respond to the user with a confirmation message including the schedule.
`,
});

const scheduleGarbagePickupFlow = ai.defineFlow(
  {
    name: 'scheduleGarbagePickupFlow',
    inputSchema: ScheduleGarbagePickupInputSchema,
    outputSchema: ScheduleGarbagePickupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
