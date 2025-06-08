
"use client";

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/Header';
import { PhotoUploadCard } from '@/components/poem/PhotoUploadCard';
import { PoemDisplayCard } from '@/components/poem/PoemDisplayCard';
import { SavedPoemsList } from '@/components/poem/SavedPoemsList';
import { LanguageSelectionDialog } from '@/components/poem/LanguageSelectionDialog';
import { generateContentAction } from './actions';
import { getSavedPoems, savePoemToStorage, deletePoemFromStorage } from '@/lib/localStorageHelper';
import type { PoemEntry } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { ScrollText } from 'lucide-react';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'Urdu', 'Marathi', 'German'];

export default function HomePage() {
  const [selectedPhotoDataUri, setSelectedPhotoDataUri] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [displayedContentType, setDisplayedContentType] = useState<'poem' | 'shayari' | null>(null);
  const [displayedLanguage, setDisplayedLanguage] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntries, setSavedEntries] = useState<PoemEntry[]>([]);
  
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [contentTypeForModal, setContentTypeForModal] = useState<'poem' | 'shayari' | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setSavedEntries(getSavedPoems());
  }, []);

  const handlePhotoSelected = useCallback((photoDataUri: string) => {
    setSelectedPhotoDataUri(photoDataUri);
    setGeneratedText(null); // Clear previous content
    setDisplayedContentType(null);
    setDisplayedLanguage(null);
    setError(null);
  }, []);

  const handleInitiateGeneration = (contentType: 'poem' | 'shayari') => {
    if (!selectedPhotoDataUri) {
      setError("Please select a photo first.");
      toast({ title: "Error", description: "Please select a photo first.", variant: "destructive" });
      return;
    }
    setContentTypeForModal(contentType);
    setIsLanguageModalOpen(true);
  };

  const handleLanguageSelectAndGenerate = async (language: string) => {
    setIsLanguageModalOpen(false);
    if (!selectedPhotoDataUri || !contentTypeForModal) {
      setError("Photo or content type missing for generation.");
      toast({ title: "Error", description: "Photo or content type missing.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedText(null);

    try {
      // CRITICAL: Verify your API key in .env.local and in Google AI Studio / Google Cloud Console.
      // The error "API key not valid" means the key itself or its permissions are the issue.
      const result = await generateContentAction(selectedPhotoDataUri, language, contentTypeForModal);
      if (result.error) {
        setError(result.error);
        toast({ title: "Generation Failed", description: result.error, variant: "destructive" });
      } else if (result.generatedText) {
        setGeneratedText(result.generatedText);
        setDisplayedContentType(contentTypeForModal);
        setDisplayedLanguage(language);
        const successTitle = `${contentTypeForModal.charAt(0).toUpperCase() + contentTypeForModal.slice(1)} Generated!`;
        toast({ title: successTitle, description: "Your masterpiece is ready.", className: "bg-primary text-primary-foreground" });
      } else {
         setError("An unknown error occurred during content generation.");
         toast({ title: "Generation Failed", description: "An unknown error occurred.", variant: "destructive" });
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate content due to an unexpected error.");
      toast({ title: "Generation Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setContentTypeForModal(null); // Reset after attempt
    }
  };

  const handleSaveContent = () => {
    if (!selectedPhotoDataUri || !generatedText || !displayedContentType || !displayedLanguage) {
      toast({ title: "Cannot Save", description: "No photo, content, type, or language to save.", variant: "destructive" });
      return;
    }
    try {
      const newSavedEntry = savePoemToStorage({
        photoDataUri: selectedPhotoDataUri,
        poem: generatedText, // 'poem' field in PoemEntry now stores the text for poem/shayari
        contentType: displayedContentType,
        language: displayedLanguage,
      });
      setSavedEntries(prev => [newSavedEntry, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      const saveTitle = `${displayedContentType.charAt(0).toUpperCase() + displayedContentType.slice(1)} Saved!`;
      toast({ title: saveTitle, description: `Your ${displayedContentType} has been saved locally.` });
    } catch (e) {
      toast({ title: "Save Error", description: "Could not save content to local storage.", variant: "destructive" });
      console.error("Failed to save content:", e);
    }
  };

  const handleDeletePoem = (id: string) => {
    try {
      deletePoemFromStorage(id);
      setSavedEntries(prev => prev.filter(p => p.id !== id));
      toast({ title: "Content Deleted", description: "The content has been removed from your saved list." });
    } catch (e) {
      toast({ title: "Delete Error", description: "Could not delete content.", variant: "destructive" });
      console.error("Failed to delete content:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <PhotoUploadCard
            onPhotoSelect={handlePhotoSelected}
            onGenerateRequest={handleInitiateGeneration}
            isProcessing={isLoading}
            selectedPhotoPreview={selectedPhotoDataUri}
          />
          <PoemDisplayCard
            photoDataUri={selectedPhotoDataUri}
            generatedText={generatedText}
            contentType={displayedContentType}
            language={displayedLanguage}
            isLoading={isLoading}
            error={error}
            onSave={handleSaveContent}
            isSavingDisabled={!selectedPhotoDataUri || !generatedText || !displayedContentType || !displayedLanguage || isLoading}
          />
        </div>
        
        <LanguageSelectionDialog
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          onLanguageSelect={handleLanguageSelectAndGenerate}
          supportedLanguages={SUPPORTED_LANGUAGES}
          contentType={contentTypeForModal}
        />

        <Separator className="my-12" />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-3 text-foreground">
            <ScrollText className="h-8 w-8 text-primary" />
            Your Saved Content
          </h2>
          <SavedPoemsList poems={savedEntries} onDeletePoem={handleDeletePoem} />
        </section>
      </main>
      <footer className="text-center py-6 border-t border-border/50 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PoemAI. Create poetry & shayaris with AI.</p>
      </footer>
    </div>
  );
}
