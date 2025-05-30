
'use server';

import { generatePoem as generatePoemFlow, type GeneratePoemInput, type GeneratePoemOutput } from '@/ai/flows/generate-poem';

interface GeneratePoemActionResult {
  poem?: string;
  error?: string;
}

export async function generatePoemAction(photoDataUri: string): Promise<GeneratePoemActionResult> {
  if (!photoDataUri) {
    return { error: 'Photo data is missing.' };
  }

  try {
    const input: GeneratePoemInput = { photoDataUri };
    const result: GeneratePoemOutput = await generatePoemFlow(input);
    if (result.poem) {
      return { poem: result.poem };
    } else {
      return { error: 'AI failed to generate a poem. The result was empty.' };
    }
  } catch (e: any) {
    console.error('Error generating poem:', e);
    return { error: e.message || 'An unexpected error occurred while generating the poem.' };
  }
}
