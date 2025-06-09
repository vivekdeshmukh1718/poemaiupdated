
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
      // This case should ideally be caught by the check within the flow itself.
      return { error: 'AI failed to generate content. The result was empty or in an unexpected format.' };
    }
  } catch (e: any) {
    console.error('Error in generateContentAction:', e);
    let errorMessage = 'An unexpected error occurred while generating the content.';
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    } else if (e && typeof e.toString === 'function') {
      errorMessage = e.toString();
    }
    // Log the detailed error structure if available
    if (e && e.details) {
      console.error('Error details:', JSON.stringify(e.details, null, 2));
    }
     if (e && e.stack) {
      console.error('Error stack:', e.stack);
    }
    return { error: errorMessage };
  }
}

