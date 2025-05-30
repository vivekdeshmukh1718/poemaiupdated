
"use client";

import type React from 'react';
import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Wand2, Loader2 } from 'lucide-react';

interface PhotoUploadCardProps {
  onPhotoSelect: (photoDataUri: string) => void;
  onGeneratePoem: () => void;
  isProcessing: boolean;
  selectedPhotoPreview: string | null;
}

export function PhotoUploadCard({ onPhotoSelect, onGeneratePoem, isProcessing, selectedPhotoPreview }: PhotoUploadCardProps) {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setInternalPreview(dataUri);
        onPhotoSelect(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      setInternalPreview(null);
      onPhotoSelect(""); // Clear selection
    }
  };

  const currentPreview = selectedPhotoPreview || internalPreview;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Upload className="h-6 w-6 text-primary" />
          Upload Your Photo
        </CardTitle>
        <CardDescription>Select an image to inspire a beautiful poem.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="photo-upload" className="sr-only">Upload photo</Label>
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="file:text-primary file:font-semibold hover:file:bg-primary/10"
          />
        </div>
        {currentPreview && (
          <div className="mt-4 p-2 border border-dashed border-border rounded-md aspect-video relative overflow-hidden bg-muted/50">
            <Image
              src={currentPreview}
              alt="Selected preview"
              layout="fill"
              objectFit="contain"
              data-ai-hint="photo preview"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onGeneratePoem}
          disabled={!currentPreview || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Generate Poem
        </Button>
      </CardFooter>
    </Card>
  );
}
