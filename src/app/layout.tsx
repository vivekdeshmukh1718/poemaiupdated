import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
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
  other: {
    'google-adsense-account': 'ca-pub-2762915089616749',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="AR0wf4sek_1tpT5biK9Rlt5zbmzdByWFlbPTxoJEuAo" />
        <meta name="google-adsense-account" content="ca-pub-2762915089616749" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AdSense script as recommended */}
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
