import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Konixy',
  description: "Hi i'm Konixy!",
  icons: '/favicon.ico',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="h-screen overflow-hidden">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
