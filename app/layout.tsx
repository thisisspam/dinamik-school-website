import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./homepage-redesign.css";
import "./interior.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://samsun.dinamikokullari.com"),
  title: {
    default: "Dinamik Mesleki ve Teknik Anadolu Lisesi | Samsun",
    template: "%s | Dinamik Samsun",
  },
  description:
    "Samsun Dinamik Mesleki ve Teknik Anadolu Lisesi; üç mesleki alanda dört yıl ücretsiz, uygulamalı eğitim sunar.",
  keywords: [
    "Dinamik Okulları Samsun",
    "mesleki ve teknik anadolu lisesi",
    "ücretsiz özel lise",
    "kimya teknolojileri",
    "elektrik elektronik teknolojileri",
    "biyomedikal cihaz teknolojileri",
  ],
  authors: [{ name: "Dinamik Mesleki ve Teknik Anadolu Lisesi" }],
  creator: "Dinamik Mesleki ve Teknik Anadolu Lisesi",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "Dinamik Mesleki ve Teknik Anadolu Lisesi",
    description: "Meslek sahibi, gelecek sahibi. Samsun'da dört yıl ücretsiz mesleki eğitim.",
    siteName: "Dinamik Okulları Samsun",
  },
  twitter: {
    card: "summary",
    title: "Dinamik Okulları Samsun",
    description: "Meslek sahibi, gelecek sahibi.",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d2958",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
