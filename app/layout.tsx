import type { Metadata, Viewport } from "next";
import { getContentPage, getSiteTheme } from "@/lib/cms/content";
import { siteThemeStyle } from "@/lib/cms/theme";
import "./globals.css";
import "./homepage-redesign.css";
import "./interior.css";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await getContentPage("site-chrome");
  const siteName = chrome.content.siteName;
  const description = chrome.content.seoDescription;

  return {
    metadataBase: new URL("https://samsun.dinamikokullari.com"),
    title: { default: siteName, template: `%s | ${siteName}` },
    description,
    keywords: [
      "Dinamik Okulları Samsun",
      "mesleki ve teknik anadolu lisesi",
      "ücretsiz özel lise",
      "kimya teknolojileri",
      "elektrik elektronik teknolojileri",
      "biyomedikal cihaz teknolojileri",
    ],
    authors: [{ name: chrome.content.copyrightText }],
    creator: chrome.content.copyrightText,
    openGraph: { type: "website", locale: "tr_TR", title: siteName, description, siteName },
    twitter: { card: "summary", title: siteName, description },
    icons: { icon: "/images/logo.png", shortcut: "/images/logo.png", apple: "/images/logo.png" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d2958",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getSiteTheme();

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body style={siteThemeStyle(theme)}>{children}</body>
    </html>
  );
}
