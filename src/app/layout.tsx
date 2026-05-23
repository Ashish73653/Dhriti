import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Dhriti — The Self-Discipline Engine',
  description: 'Your personal health intelligence platform — track fat loss, sugar, habits and discipline.',
  manifest: '/manifest.webmanifest',
  themeColor: '#030306',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dhriti',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
