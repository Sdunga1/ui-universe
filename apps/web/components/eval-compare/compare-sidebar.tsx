"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, COMPONENTS } from "../../lib/eval-compare-components";

const categoryLabels: Record<string, string> = {
  text: "Text",
  backgrounds: "Backgrounds",
  sections: "Sections",
};

export function CompareSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-[var(--border)] flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/evals/compare" className="block">
          <p className="text-xs font-bold text-[var(--foreground)]">Live Comparisons</p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5 tracking-wide">
            Source vs Descriptor
          </p>
        </Link>
      </div>

      <nav className="flex-1 p-3">
        {CATEGORIES.map((cat) => {
          const items = COMPONENTS.filter((c) => c.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="mb-4">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--muted)] px-2 mb-1.5">
                {categoryLabels[cat]}
              </p>
              {items.map((comp) => {
                const active = pathname === `/evals/compare/${comp.slug}`;
                return (
                  <Link
                    key={comp.slug}
                    href={`/evals/compare/${comp.slug}`}
                    className={`block px-3 py-1.5 text-[13px] transition-colors ${
                      active
                        ? "bg-[var(--accent)] text-white font-medium"
                        : "text-[var(--foreground)] hover:bg-[#111]"
                    }`}
                  >
                    {comp.name}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)] text-[9px] text-[var(--muted)] tracking-wide">
        6 components &middot; 2 conditions
      </div>
    </aside>
  );
}
