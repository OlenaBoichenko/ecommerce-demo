import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { DisableLogs } from './disable-logs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopDemo - E-commerce Demo',
  description: 'Full-stack e-commerce solution with Next.js, TypeScript, Stripe, and MySQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <DisableLogs />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div></div>}>
                {children}
              </Suspense>
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
