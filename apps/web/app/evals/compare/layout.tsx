import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CompareSidebar } from "../../../components/eval-compare/compare-sidebar";

export const metadata: Metadata = {
  title: "Live Comparisons",
  description:
    "Side-by-side comparison of AI-generated component code. See how descriptors improve output quality across Claude and Gemini.",
  alternates: {
    canonical: "/evals/compare",
  },
  openGraph: {
    title: "Live Comparisons — uiUniverse Evals",
    description: "Side-by-side comparison of AI-generated component code across multiple models.",
    url: "/evals/compare",
  },
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <CompareSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
