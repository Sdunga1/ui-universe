"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";

export function MobileSidebarToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change — pathname is intentionally a dependency to trigger on navigation
  // biome-ignore lint/correctness/useExhaustiveDependencies: need pathname to detect route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(238,80,44,0.4)]"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        />
      )}

      {/* Slide-out drawer */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 bg-[var(--background)] border-r border-[var(--border)] py-6 px-4 overflow-y-auto transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}
