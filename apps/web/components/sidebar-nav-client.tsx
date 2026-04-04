"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentDescriptor } from "../lib/registry";

const CATEGORY_ORDER = ["backgrounds", "animations", "text", "sections"];

interface SidebarNavClientProps {
  byCategory: Record<string, ComponentDescriptor[]>;
}

const RAIL_INDENT = 12;
const CURVE_SIZE = 10;

export function SidebarNavClient({ byCategory }: SidebarNavClientProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const categories = CATEGORY_ORDER.filter((cat) => byCategory[cat] && byCategory[cat].length > 0);

  return (
    <nav className="relative" style={{ paddingLeft: RAIL_INDENT + 8 }}>
      {/* Getting Started */}
      <div className="relative mb-5">
        <div
          className="absolute top-0 bottom-0 w-px bg-[var(--border)]"
          style={{ left: -RAIL_INDENT - 8 }}
        />
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Getting Started
        </h3>
        <ul className="space-y-0">
          <li className="relative">
            <Link
              href="/"
              className={`block py-1.5 text-sm transition-colors ${
                isActive("/") ? "text-white" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Introduction
            </Link>
          </li>
        </ul>
      </div>

      {categories.map((category, catIdx) => {
        const components = byCategory[category] ?? [];
        const isLastCategory = catIdx === categories.length - 1;

        return (
          <div key={category} className="relative mb-5">
            {/* Category heading */}
            <div className="relative mb-1.5">
              <div
                className="absolute top-0 w-px bg-[var(--border)]"
                style={{
                  left: -RAIL_INDENT - 8,
                  bottom: 0,
                }}
              />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {category}
              </h3>
            </div>

            {/* Bend: category rail → component rail */}
            <div
              className="relative"
              style={{
                marginLeft: -(RAIL_INDENT + 8),
                width: RAIL_INDENT + 8,
                height: CURVE_SIZE,
              }}
            >
              <svg
                role="img"
                aria-hidden="true"
                width={RAIL_INDENT + 8}
                height={CURVE_SIZE}
                viewBox={`0 0 ${RAIL_INDENT + 8} ${CURVE_SIZE}`}
                fill="none"
                className="block"
              >
                <path
                  d={`M 0.5 0 L 0.5 ${CURVE_SIZE * 0.4} Q 0.5 ${CURVE_SIZE} ${RAIL_INDENT + 8 - 0.5} ${CURVE_SIZE}`}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Component items with indented vertical rail */}
            <div className="relative">
              <div
                className="absolute top-0 w-px bg-[var(--border)]"
                style={{
                  left: -1,
                  bottom: isLastCategory ? "50%" : 0,
                }}
              />

              <ul className="space-y-0">
                {components.map((comp) => {
                  const href = `/${comp.category}/${comp.slug}`;
                  const active = isActive(href);
                  return (
                    <li key={comp.slug} className="relative">
                      {active && (
                        <div
                          className="absolute top-0 bottom-0 w-px bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]"
                          style={{ left: -1 }}
                        />
                      )}
                      <Link
                        href={href}
                        className={`block py-1.5 pl-3 text-sm transition-colors ${
                          active ? "text-white" : "text-[var(--muted)] hover:text-white"
                        }`}
                      >
                        {comp.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bend back: component rail → category rail */}
            {!isLastCategory && (
              <div
                className="relative"
                style={{
                  marginLeft: -(RAIL_INDENT + 8),
                  width: RAIL_INDENT + 8,
                  height: CURVE_SIZE,
                }}
              >
                <svg
                  role="img"
                  aria-hidden="true"
                  width={RAIL_INDENT + 8}
                  height={CURVE_SIZE}
                  viewBox={`0 0 ${RAIL_INDENT + 8} ${CURVE_SIZE}`}
                  fill="none"
                  className="block"
                >
                  <path
                    d={`M ${RAIL_INDENT + 8 - 0.5} 0 Q 0.5 0 0.5 ${CURVE_SIZE * 0.6} L 0.5 ${CURVE_SIZE}`}
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
