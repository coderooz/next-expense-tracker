import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/context/AppProvider';

export const metadata: Metadata = {
  title: 'Pennywise — Expense Manager',
  description: 'Smart, intuitive personal expense tracking and financial analytics',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/pennywise-brand.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/pennywise-brand.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
