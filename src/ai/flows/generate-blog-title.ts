// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A flow to generate blog post titles using AI based on keywords.
 *
 * - generateBlogTitle - A function that generates blog post titles.
 * - GenerateBlogTitleInput - The input type for the generateBlogTitle function.
 * - GenerateBlogTitleOutput - The return type for the generateBlogTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogTitleInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords to use to generate the blog title.'),
});
export type GenerateBlogTitleInput = z.infer<typeof GenerateBlogTitleInputSchema>;

const GenerateBlogTitleOutputSchema = z.object({
  title: z.string().describe('The generated blog title.'),
});
export type GenerateBlogTitleOutput = z.infer<typeof GenerateBlogTitleOutputSchema>;

export async function generateBlogTitle(input: GenerateBlogTitleInput): Promise<GenerateBlogTitleOutput> {
  return generateBlogTitleFlow(input);
}

const generateBlogTitlePrompt = ai.definePrompt({
  name: 'generateBlogTitlePrompt',
  input: {schema: GenerateBlogTitleInputSchema},
  output: {schema: GenerateBlogTitleOutputSchema},
  prompt: `You are an expert blog title generator. Generate a catchy and engaging blog title based on the following keywords: {{{keywords}}}.`,
});

const generateBlogTitleFlow = ai.defineFlow(
  {
    name: 'generateBlogTitleFlow',
    inputSchema: GenerateBlogTitleInputSchema,
    outputSchema: GenerateBlogTitleOutputSchema,
  },
  async input => {
    const {output} = await generateBlogTitlePrompt(input);
    return output!;
  }
);
