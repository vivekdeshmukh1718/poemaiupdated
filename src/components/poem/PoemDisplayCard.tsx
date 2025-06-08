
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Image as ImageIcon, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PoemDisplayCardProps {
  photoDataUri: string | null;
  generatedText: string | null;
  contentType: 'poem' | 'shayari' | null;
  language: string | null;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  isSavingDisabled: boolean;
}

export function PoemDisplayCard({
  photoDataUri,
  generatedText,
  contentType,
  language,
  isLoading,
  error,
  onSave,
  isSavingDisabled,
}: PoemDisplayCardProps) {
  
  const titleText = contentType === 'shayari' ? 'Your Generated Shayari' : 'Your Generated Poem';
  const descriptionText = contentType ? `Behold the ${contentType} inspired by your image in ${language || 'the selected language'}.` : 'Behold the poetry inspired by your image.';
  const emptyStateTitle = `Your ${contentType === 'shayari' ? 'shayari' : 'poem'} will appear here.`;
  const emptyStateInstruction = `Upload a photo and click "Generate ${contentType === 'shayari' ? 'Shayari' : 'Poem'}".`;


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-accent" />
          {isLoading ? "Generating..." : (generatedText ? titleText : "Your Generated Content")}
        </CardTitle>
        <CardDescription>{isLoading ? "Please wait while we craft your masterpiece." : (generatedText ? descriptionText : "Your generated content will appear here after selection.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Generating your masterpiece...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-destructive bg-destructive/10 p-4 rounded-md">
            <AlertTriangle className="h-12 w-12" />
            <p className="mt-4 text-lg font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && !photoDataUri && !generatedText && (
           <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed rounded-md p-6">
            <ImageIcon className="h-16 w-16 mb-4" />
            <p className="text-xl font-medium">{emptyStateTitle}</p>
            <p className="text-sm">{emptyStateInstruction}</p>
          </div>
        )}
        {!isLoading && !error && (photoDataUri || generatedText) && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {photoDataUri && (
              <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted/50 shadow-inner">
                <Image
                  src={photoDataUri}
                  alt="Inspired photo"
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint="inspired photo"
                />
              </div>
            )}
            {generatedText && (
              <ScrollArea className="h-64 md:h-auto md:max-h-[calc(100vh-20rem)] p-4 border rounded-lg bg-secondary/30 shadow-inner">
                <pre className="whitespace-pre-wrap text-sm md:text-base leading-relaxed font-serif text-foreground">
                  {generatedText}
                </pre>
              </ScrollArea>
            )}
             {!generatedText && photoDataUri && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 border rounded-lg bg-secondary/30 shadow-inner">
                <FileText className="h-12 w-12 mb-3" />
                <p className="text-center">Your {contentType || "content"} is ready to be generated!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!isLoading && !error && generatedText && photoDataUri && (
        <CardFooter>
          <Button onClick={onSave} disabled={isSavingDisabled} className="w-full" size="lg">
            <Save className="mr-2 h-5 w-5" />
            Save {contentType === 'shayari' ? 'Shayari' : 'Poem'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
