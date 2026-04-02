import Link from "next/link";
import { getRegistryByCategory } from "../lib/registry";

const CATEGORY_ORDER = ["animations", "text", "backgrounds", "sections"];

export function SidebarNav() {
  const byCategory = getRegistryByCategory();

  return (
    <nav className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Getting Started
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="block rounded-md px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-white"
            >
              Introduction
            </Link>
          </li>
        </ul>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const components = byCategory[category];
        if (!components || components.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {category}
            </h3>
            <ul className="space-y-1">
              {components.map((comp) => (
                <li key={comp.slug}>
                  <Link
                    href={`/${comp.category}/${comp.slug}`}
                    className="block rounded-md px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-white"
                  >
                    {comp.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
