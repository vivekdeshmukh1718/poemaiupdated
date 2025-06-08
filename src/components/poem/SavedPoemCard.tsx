
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { PoemEntry } from '@/lib/types';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface SavedPoemCardProps {
  poemEntry: PoemEntry;
  onDelete: (id: string) => void;
}

export function SavedPoemCard({ poemEntry, onDelete }: SavedPoemCardProps) {
  const contentTypeDisplay = poemEntry.contentType ? (poemEntry.contentType.charAt(0).toUpperCase() + poemEntry.contentType.slice(1)) : "Content";
  const languageDisplay = poemEntry.language || "Unknown";

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-xl leading-tight line-clamp-2">
              {contentTypeDisplay} from {format(new Date(poemEntry.createdAt), "PPp")}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{languageDisplay}</Badge>
              <CardDescription className="text-xs">ID: {poemEntry.id.substring(0,8)}...</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(poemEntry.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {contentTypeDisplay.toLowerCase()}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4 items-start">
        <div className="aspect-video relative rounded-md overflow-hidden border bg-muted/30">
          <Image
            src={poemEntry.photoDataUri}
            alt={`Photo for ${poemEntry.contentType || 'content'} created at ${poemEntry.createdAt}`}
            layout="fill"
            objectFit="contain"
            data-ai-hint="gallery photo"
          />
        </div>
        <ScrollArea className="h-48 md:h-full p-3 border rounded-md bg-secondary/20">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed font-serif text-foreground">
            {poemEntry.poem}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
