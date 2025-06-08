
export interface PoemEntry {
  id: string;
  photoDataUri: string;
  poem: string; // This will store both poem and shayari text
  language: string;
  contentType: 'poem' | 'shayari';
  createdAt: string; // ISO date string
}
