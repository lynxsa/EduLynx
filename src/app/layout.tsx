import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduLynx - School Management System",
  description: "Modern school management platform by LYNX Consulting South Africa (Pty) Ltd",
  openGraph: {
    title: "EduLynx - School Management System",
    description: "Modern school management platform for South African educational institutions",
    type: "website",
    locale: "en_ZA",
    siteName: "EduLynx",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduLynx - School Management System",
    description: "Modern school management platform for South African educational institutions",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3726a6" />
      </head>
      <body className={inter.className} aria-label="EduLynx App Root">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
