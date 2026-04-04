import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "uiUniverse - AI native components",
  description:
    "A motion-first React component library designed for AI coding tools. Ship premium landing pages in minutes.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-mono">
        <SiteHeader />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
