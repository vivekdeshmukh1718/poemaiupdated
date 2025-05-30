
"use client";

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/Header';
import { PhotoUploadCard } from '@/components/poem/PhotoUploadCard';
import { PoemDisplayCard } from '@/components/poem/PoemDisplayCard';
import { SavedPoemsList } from '@/components/poem/SavedPoemsList';
import { generatePoemAction } from './actions';
import { getSavedPoems, savePoemToStorage, deletePoemFromStorage } from '@/lib/localStorageHelper';
import type { PoemEntry } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { ScrollText } from 'lucide-react';

export default function HomePage() {
  const [selectedPhotoDataUri, setSelectedPhotoDataUri] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPoems, setSavedPoems] = useState<PoemEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setSavedPoems(getSavedPoems());
  }, []);

  const handlePhotoSelected = useCallback((photoDataUri: string) => {
    setSelectedPhotoDataUri(photoDataUri);
    setGeneratedPoem(null); // Clear previous poem when new photo is selected
    setError(null);
  }, []);

  const handleGeneratePoem = async () => {
    if (!selectedPhotoDataUri) {
      setError("Please select a photo first.");
      toast({ title: "Error", description: "Please select a photo first.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPoem(null);

    try {
      const result = await generatePoemAction(selectedPhotoDataUri);
      if (result.error) {
        setError(result.error);
        toast({ title: "Generation Failed", description: result.error, variant: "destructive" });
      } else if (result.poem) {
        setGeneratedPoem(result.poem);
        toast({ title: "Poem Generated!", description: "Your masterpiece is ready.", className: "bg-primary text-primary-foreground" });
      } else {
         setError("An unknown error occurred during poem generation.");
         toast({ title: "Generation Failed", description: "An unknown error occurred.", variant: "destructive" });
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate poem due to an unexpected error.");
      toast({ title: "Generation Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePoem = () => {
    if (!selectedPhotoDataUri || !generatedPoem) {
      toast({ title: "Cannot Save", description: "No photo or poem to save.", variant: "destructive" });
      return;
    }
    try {
      const newSavedPoem = savePoemToStorage({ photoDataUri: selectedPhotoDataUri, poem: generatedPoem });
      setSavedPoems(prev => [newSavedPoem, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      toast({ title: "Poem Saved!", description: "Your poem has been saved locally." });
    } catch (e) {
      toast({ title: "Save Error", description: "Could not save poem to local storage.", variant: "destructive" });
      console.error("Failed to save poem:", e);
    }
  };

  const handleDeletePoem = (id: string) => {
    try {
      deletePoemFromStorage(id);
      setSavedPoems(prev => prev.filter(p => p.id !== id));
      toast({ title: "Poem Deleted", description: "The poem has been removed from your saved list." });
    } catch (e) {
      toast({ title: "Delete Error", description: "Could not delete poem.", variant: "destructive" });
      console.error("Failed to delete poem:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <PhotoUploadCard
            onPhotoSelect={handlePhotoSelected}
            onGeneratePoem={handleGeneratePoem}
            isProcessing={isLoading}
            selectedPhotoPreview={selectedPhotoDataUri}
          />
          <PoemDisplayCard
            photoDataUri={selectedPhotoDataUri}
            poem={generatedPoem}
            isLoading={isLoading}
            error={error}
            onSavePoem={handleSavePoem}
            isSavingDisabled={!selectedPhotoDataUri || !generatedPoem || isLoading}
          />
        </div>
        
        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-3 text-foreground">
            <ScrollText className="h-8 w-8 text-primary" />
            Your Saved Poems
          </h2>
          <SavedPoemsList poems={savedPoems} onDeletePoem={handleDeletePoem} />
        </section>
      </main>
      <footer className="text-center py-6 border-t border-border/50 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PoemAI. Create poetry with AI.</p>
      </footer>
    </div>
  );
}
