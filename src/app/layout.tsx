
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import Script from 'next/script'; // Import the Script component
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PoemAI - Generate Poems from Photos',
  description: 'Upload a photo and let AI craft a unique poem for you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can place meta tags or other head elements here if needed */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2762915089616749"
          crossOrigin="anonymous"
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
