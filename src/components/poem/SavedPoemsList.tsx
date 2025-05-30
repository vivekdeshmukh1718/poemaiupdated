
"use client";

import type { PoemEntry } from '@/lib/types';
import { SavedPoemCard } from './SavedPoemCard';
import { BookHeart } from 'lucide-react';

interface SavedPoemsListProps {
  poems: PoemEntry[];
  onDeletePoem: (id: string) => void;
}

export function SavedPoemsList({ poems, onDeletePoem }: SavedPoemsListProps) {
  if (poems.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border/70 rounded-lg">
        <BookHeart className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Saved Poems Yet</h3>
        <p>Your saved masterpieces will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {poems.map(poemEntry => (
        <SavedPoemCard key={poemEntry.id} poemEntry={poemEntry} onDelete={onDeletePoem} />
      ))}
    </div>
  );
}
