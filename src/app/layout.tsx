import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/enhanced-cards.css';
import { ThemeProvider } from '@/styles/theme';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduLynx - School Management System',
  description: 'Modern school management platform by LYNX Consulting South Africa (Pty) Ltd',
  keywords:
    'school management, education, South Africa, student portal, teacher dashboard, parent portal',
  openGraph: {
    title: 'EduLynx - School Management System',
    description: 'Modern school management platform for South African educational institutions',
    type: 'website',
    locale: 'en_ZA',
    siteName: 'EduLynx',
    images: [
      {
        url: '/edulynx-logo.png',
        width: 1200,
        height: 630,
        alt: 'EduLynx Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLynx - School Management System',
    description: 'Modern school management platform for South African educational institutions',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const resolved = theme === 'system' 
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  : theme;
                document.documentElement.classList.add(resolved);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className} aria-label="EduLynx App Root">
        <ErrorBoundary>
          <GlobalErrorHandler>
            <ThemeProvider>
              <AuthProvider>
                <ErrorBoundary>{children}</ErrorBoundary>
              </AuthProvider>
            </ThemeProvider>
          </GlobalErrorHandler>
        </ErrorBoundary>
      </body>
    </html>
  );
}
