
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LanguageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: string) => void;
  supportedLanguages: string[];
  contentType: 'poem' | 'shayari' | null;
}

export function LanguageSelectionDialog({
  isOpen,
  onClose,
  onLanguageSelect,
  supportedLanguages,
  contentType,
}: LanguageSelectionDialogProps) {
  if (!isOpen) return null;

  const contentTypeDisplay = contentType ? (contentType.charAt(0).toUpperCase() + contentType.slice(1)) : "Content";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
          <DialogDescription>
            Choose the language for your {contentTypeDisplay.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {supportedLanguages.map((lang) => (
            <Button
              key={lang}
              variant="outline"
              onClick={() => onLanguageSelect(lang)}
            >
              {lang}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
