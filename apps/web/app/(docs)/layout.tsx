import type { ReactNode } from "react";
import { MobileSidebarToggle } from "../../components/mobile-sidebar-toggle";
import { SidebarNav } from "../../components/sidebar-nav";
import { SiteHeader } from "../../components/site-header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sidebar-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] py-6 pr-6 pl-4 lg:block">
          <SidebarNav />
        </aside>
        {/* Mobile sidebar drawer */}
        <MobileSidebarToggle>
          <SidebarNav />
        </MobileSidebarToggle>
        <main className="flex-1 px-6 py-10 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
