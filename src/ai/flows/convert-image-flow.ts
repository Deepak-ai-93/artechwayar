// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A flow to convert an image from one format to another.
 *
 * - convertImageFlow - A function that handles the image conversion.
 * - ConvertImageInput - The input type for the convertImage function.
 * - ConvertImageOutput - The return type for the convertImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConvertImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  outputFormat: z.enum(['image/jpeg', 'image/png', 'image/webp']).describe('The desired output format.'),
});
export type ConvertImageInput = z.infer<typeof ConvertImageInputSchema>;

const ConvertImageOutputSchema = z.object({
    imageUrl: z.string().describe("The data URI of the converted image.")
});
export type ConvertImageOutput = z.infer<typeof ConvertImageOutputSchema>;

export async function convertImage(
  input: ConvertImageInput
): Promise<ConvertImageOutput> {
  return convertImageFlow(input);
}

const convertImageFlow = ai.defineFlow(
  {
    name: 'convertImageFlow',
    inputSchema: ConvertImageInputSchema,
    outputSchema: ConvertImageOutputSchema,
  },
  async ({ imageDataUri, outputFormat }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: imageDataUri } },
        { text: `Convert this image to ${outputFormat} format.` },
      ],
      config: {
        responseModalities: ['IMAGE'],
        responseMimeType: outputFormat,
      },
    });

    if (!media || !media.url) {
      throw new Error('Image conversion failed: No media returned from the model.');
    }
    
    return { imageUrl: media.url };
  }
);
