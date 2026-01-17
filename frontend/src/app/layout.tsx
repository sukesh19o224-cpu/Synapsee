import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Synapse - Research Reproducibility Platform',
  description: 'A unified platform for electrochemistry research: lab notebooks, data analysis, and AI-powered search.',
  keywords: ['electrochemistry', 'research', 'lab notebook', 'data analysis', 'reproducibility'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
