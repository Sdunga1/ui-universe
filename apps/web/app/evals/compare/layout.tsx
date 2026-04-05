import type { ReactNode } from "react";
import { CompareSidebar } from "../../../components/eval-compare/compare-sidebar";

export const metadata = {
  title: "Live Comparisons — uiUniverse Evals",
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <CompareSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
