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
  wasteType: z.enum(['Organic', 'Recyclable', 'Hazardous', 'E-waste', 'Cotton', 'Electronics', 'Other']).describe('The type of waste identified.'),
  disposalInstructions: z.string().describe('Instructions on how to properly dispose of the identified waste.'),
  recyclingInfo: z.string().optional().describe('Information about recycling the item, if applicable.'),
  decompositionTime: z.string().optional().describe('An estimate of how long the waste will take to decompose (e.g., "2-5 weeks", "450 years").'),
});
export type IdentifyWasteOutput = z.infer<typeof IdentifyWasteOutputSchema>;

export async function identifyWaste(input: IdentifyWasteInput): Promise<IdentifyWasteOutput> {
  return identifyWasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyWastePrompt',
  input: {schema: IdentifyWasteInputSchema},
  output: {schema: IdentifyWasteOutputSchema},
  prompt: `You are a waste management expert. Analyze the provided image and identify the type of waste it contains.

Determine if the item is waste. If it is, classify it into one of the following categories: Organic, Recyclable, Hazardous, E-waste, Cotton, Electronics, or Other.

Provide clear and concise disposal instructions. If the item is non-biodegradable (e.g., plastic, metal, glass, electronics), your primary instruction should be to recycle it.

Also, provide an estimated time for how long the item will take to decompose under normal landfill conditions. For items that are non-biodegradable or take hundreds of years, emphasize this.

If applicable, also provide recycling information.

Image: {{media url=photoDataUri}}
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
