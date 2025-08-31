import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Artechway | Exploring AI, Design, and Technology',
  description: 'Dive into the future with Artechway. We explore the frontiers of AI, design, and technology with fresh ideas, in-depth articles, and expert perspectives delivered weekly.',
  keywords: ['AI', 'Technology', 'Design', 'Innovation', 'Machine Learning', 'Web Development'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <head>
        <link rel="icon" href="/artechwaysiteicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/artechwaysiteicon.png" />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
