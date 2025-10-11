import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import "../public/fonts/fonts.css";

const geistSans = localFont({
  src: [
    { path: '../public/fonts/geist/light.ttf', weight: '300' },
    { path: '../public/fonts/geist/regular.ttf', weight: '400' },
    { path: '../public/fonts/geist/medium.ttf', weight: '500' },
    { path: '../public/fonts/geist/semibold.ttf', weight: '600' },
    { path: '../public/fonts/geist/bold.ttf', weight: '700' },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: '../public/fonts/geist-mono/light.ttf', weight: '300' },
    { path: '../public/fonts/geist-mono/regular.ttf', weight: '400' },
    { path: '../public/fonts/geist-mono/medium.ttf', weight: '500' },
    { path: '../public/fonts/geist-mono/semibold.ttf', weight: '600' },
    { path: '../public/fonts/geist-mono/bold.ttf', weight: '700' },
  ],
  variable: "--font-geist-mono",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh"
        }}
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
