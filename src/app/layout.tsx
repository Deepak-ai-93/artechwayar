import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Raleway } from 'next/font/google';
import Script from 'next/script';
import Preloader from '@/components/preloader';

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
        <meta name='impact-site-verification' value='049f91b2-7a27-4f0e-89bb-329d09fdae18' />
        <link rel="icon" href="/artechwaysiteicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/artechwaysiteicon.png" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-50TBS7Y2ZM"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-50TBS7Y2ZM');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <Preloader />
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
