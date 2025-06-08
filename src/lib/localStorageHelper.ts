
import type { PoemEntry } from './types';

const SAVED_POEMS_KEY = 'poemAI_savedPoems_v2'; // Changed key to avoid conflicts with old structure

export function getSavedPoems(): PoemEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const poemsJson = localStorage.getItem(SAVED_POEMS_KEY);
  if (poemsJson) {
    try {
      const poems = JSON.parse(poemsJson) as PoemEntry[];
      // Sort by newest first
      return poems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Error parsing saved poems from localStorage:", error);
      return [];
    }
  }
  return [];
}

export function savePoemToStorage(
  poemEntryData: Omit<PoemEntry, 'id' | 'createdAt'>
): PoemEntry {
  const existingPoems = getSavedPoems();
  const newPoem: PoemEntry = {
    ...poemEntryData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updatedPoems = [newPoem, ...existingPoems];
  localStorage.setItem(SAVED_POEMS_KEY, JSON.stringify(updatedPoems));
  return newPoem;
}

export function deletePoemFromStorage(id: string): void {
  const existingPoems = getSavedPoems();
  const updatedPoems = existingPoems.filter(poem => poem.id !== id);
  localStorage.setItem(SAVED_POEMS_KEY, JSON.stringify(updatedPoems));
}
