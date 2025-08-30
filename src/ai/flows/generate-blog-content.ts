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
  content: z.string().describe('The generated blog content, formatted as Markdown.'),
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
  
Generate a compelling and informative blog post in Markdown format based on the following title: {{{title}}}.

The content should be well-structured, engaging, and provide real value to the reader.
Use headings, subheadings, bold text, and hyperlinks where appropriate to create a rich, readable layout.`,
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
