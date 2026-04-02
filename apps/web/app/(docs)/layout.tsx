import type { ReactNode } from "react";
import { SidebarNav } from "../../components/sidebar-nav";
import { SiteHeader } from "../../components/site-header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] p-6 lg:block">
          <SidebarNav />
        </aside>
        <main className="flex-1 px-6 py-10 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
