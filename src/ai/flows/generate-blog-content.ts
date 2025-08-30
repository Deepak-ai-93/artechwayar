// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A flow to generate blog post content using AI based on a title.
 *
 * - generateBlogContent - A function that generates blog post content.
 * - GenerateBlogContentInput - The input type for the generateBlogContent function.
 * - GenerateBlogContentOutput - The return type for the generateBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  title: z
    .string()
    .describe('The title of the blog post to generate content for.'),
});
export type GenerateBlogContentInput = z.infer<typeof GenerateBlogContentInputSchema>;

const GenerateBlogContentOutputSchema = z.object({
  content: z.string().describe('The generated blog content, formatted as paragraphs separated by newlines.'),
});
export type GenerateBlogContentOutput = z.infer<typeof GenerateBlogContentOutputSchema>;

export async function generateBlogContent(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}

const generateBlogContentPrompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {schema: GenerateBlogContentInputSchema},
  output: {schema: GenerateBlogContentOutputSchema},
  prompt: `You are an expert content writer specializing in SEO-optimized blog posts.
  
Generate a compelling and informative blog post based on the following title: {{{title}}}.

The content should be well-structured, engaging, and provide real value to the reader.
Use multiple paragraphs. Separate each paragraph with a single newline character.
Do not use markdown formatting.`,
});

const generateBlogContentFlow = ai.defineFlow(
  {
    name: 'generateBlogContentFlow',
    inputSchema: GenerateBlogContentInputSchema,
    outputSchema: GenerateBlogContentOutputSchema,
  },
  async input => {
    const {output} = await generateBlogContentPrompt(input);
    return output!;
  }
);
