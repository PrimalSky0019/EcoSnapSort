'use server';
/**
 * @fileOverview Identifies the type of waste from an image.
 *
 * THIS FILE IS DEPRECATED AND REPLACED BY A CLIENT-SIDE TENSORFLOW.JS MODEL.
 * The logic is now in src/app/(app)/scan-waste/page.tsx.
 *
 * - identifyWaste - A function that handles the waste identification process.
 * - IdentifyWasteInput - The input type for the identifyWaste function.
 * - IdentifyWasteOutput - The return type for the identifyWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyWasteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a piece of waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyWasteInput = z.infer<typeof IdentifyWasteInputSchema>;

const IdentifyWasteOutputSchema = z.object({
  isWaste: z.boolean().describe('Whether or not the image contains waste.'),
  wasteType: z.enum(['Organic', 'Recyclable', 'Hazardous', 'E-waste', 'Other']).describe('The type of waste identified.'),
  disposalInstructions: z.string().describe('Instructions on how to properly dispose of the identified waste.'),
  recyclingInfo: z.string().optional().describe('Information about recycling the item, if applicable.'),
});
export type IdentifyWasteOutput = z.infer<typeof IdentifyWasteOutputSchema>;

export async function identifyWaste(input: IdentifyWasteInput): Promise<IdentifyWasteOutput> {
  // This flow is deprecated.
  throw new Error("This AI flow is deprecated. Use the client-side TensorFlow.js model instead.");
}
