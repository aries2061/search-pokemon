import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import "../public/fonts/fonts.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geistSans = localFont({
  src: [
    { path: '../public/fonts/geist/regular.ttf', weight: '400' },
    { path: '../public/fonts/geist/semibold.ttf', weight: '600' },
  ],
  variable: "--font-geist-sans",
  display: 'swap',
  preload: true,
});

const geistMono = localFont({
  src: [
    { path: '../public/fonts/geist-mono/regular.ttf', weight: '400' },
  ],
  variable: "--font-geist-mono",
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Pokémon Search App",
  description: "Search for Pokémon and view their details",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/pokemon-logo.png" as="image" />
        <link rel="preload" href="/bg.webp" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh"
        }}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
