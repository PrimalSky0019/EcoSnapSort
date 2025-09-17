'use server';
/**
 * @fileOverview Identifies the type of waste from an image.
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
  return identifyWasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyWastePrompt',
  input: {schema: IdentifyWasteInputSchema},
  output: {schema: IdentifyWasteOutputSchema},
  prompt: `You are an expert in waste management and recycling. Your task is to identify the type of waste in the provided image.

Analyze the image and determine if it contains a waste item.
- If it is waste, classify it into one of the following categories: 'Organic', 'Recyclable', 'Hazardous', 'E-waste', or 'Other'.
- Provide clear and concise disposal instructions.
- If the item is recyclable, provide relevant recycling information, such as what materials it's made from and how it should be prepared for recycling.

Image: {{media url=photoDataUri}}

Your response must be in the structured format defined by the output schema.
`,
});

const identifyWasteFlow = ai.defineFlow(
  {
    name: 'identifyWasteFlow',
    inputSchema: IdentifyWasteInputSchema,
    outputSchema: IdentifyWasteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
