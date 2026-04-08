import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

const SITE_URL = "https://uiuniverse.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "uiUniverse — AI-Native Motion UI Components for React",
    template: "%s | uiUniverse",
  },
  description:
    "25+ production-ready motion components for React & Next.js. AI-native JSON descriptors let AI tools generate correct code on the first try.",
  keywords: [
    "react components",
    "nextjs components",
    "motion ui",
    "animation library",
    "ai-native",
    "ui components",
    "tailwind components",
    "framer motion",
    "react animation",
    "landing page components",
    "uiUniverse",
  ],
  authors: [{ name: "uiUniverse" }],
  creator: "uiUniverse",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "uiUniverse",
    locale: "en_US",
    url: SITE_URL,
    title: "uiUniverse — AI-Native Motion UI Components for React",
    description:
      "25+ production-ready motion components for React & Next.js. AI-native JSON descriptors let AI tools generate correct code on the first try.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@uiUniverse_dev",
    creator: "@uiUniverse_dev",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "uiUniverse",
  description:
    "AI-native motion UI component library for React and Next.js. Every component ships with machine-readable JSON descriptors for AI coding tools.",
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "uiUniverse",
    url: SITE_URL,
    sameAs: [
      "https://github.com/Sdunga1/ui-universe",
      "https://x.com/uiUniverse_dev",
      "https://linkedin.com/company/uiuniverse",
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-mono">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
