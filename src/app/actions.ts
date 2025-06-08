
'use server';

import { generateContent as generateContentFlow, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/generate-poem';

interface GenerateContentActionResult {
  generatedText?: string;
  error?: string;
}

export async function generateContentAction(
  photoDataUri: string,
  language: string,
  contentType: 'poem' | 'shayari'
): Promise<GenerateContentActionResult> {
  if (!photoDataUri) {
    return { error: 'Photo data is missing.' };
  }
  if (!language) {
    return { error: 'Language is missing.' };
  }
  if (!contentType) {
    return { error: 'Content type is missing.' };
  }

  try {
    const input: GenerateContentInput = { photoDataUri, language, contentType };
    const result: GenerateContentOutput = await generateContentFlow(input);
    if (result.generatedText) {
      return { generatedText: result.generatedText };
    } else {
      return { error: 'AI failed to generate content. The result was empty.' };
    }
  } catch (e: any) {
    console.error('Error generating content:', e);
    return { error: e.message || 'An unexpected error occurred while generating the content.' };
  }
}
