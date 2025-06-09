
'use server';

/**
 * @fileOverview Generates a poem or shayari based on an uploaded photo and user preferences.
 *
 * - generateContent - A function that generates content (poem/shayari) based on the uploaded photo, desired language, and content type.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to inspire the content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().default('English').describe('The language for the content (e.g., "English", "Hindi", "Urdu"). Defaults to English if not provided.'),
  contentType: z.enum(['poem', 'shayari']).describe('The type of content to generate (poem or shayari).'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe('A poem or shayari inspired by the photo, in the specified language.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const generateContentPrompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: {schema: GenerateContentInputSchema},
  output: {schema: GenerateContentOutputSchema},
  prompt: `You are a creative writer.
Your task is to write a {{contentType}} inspired by the photo.
The {{contentType}} should be in {{language}}.
Ensure the output is only the {{contentType}} itself.

Photo: {{media url=photoDataUri}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE', // Can be a bit more sensitive
      },
    ],
  },
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async input => {
    const {output} = await generateContentPrompt(input);
    // Ensure generatedText is used as the key for the output to match GenerateContentOutputSchema
    if (!output || typeof output.generatedText !== 'string') {
      throw new Error('AI model did not return the expected output format.');
    }
    return { generatedText: output.generatedText };
  }
);

