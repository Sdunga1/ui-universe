import type { ReactNode } from "react";
import { SiteHeader } from "../../components/site-header";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
