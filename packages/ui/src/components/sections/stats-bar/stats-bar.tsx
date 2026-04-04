"use client";

import { forwardRef, useRef } from "react";
import { cn } from "../../../lib/utils";
import { FadeUp } from "../../animations/fade-up";
import { Counter } from "../../text/counter";

export interface StatItem {
  /** Target number to count to. */
  value: number;
  /** Label displayed below the number. */
  label: string;
  /** Text prepended to the number (e.g., "$"). */
  prefix?: string;
  /** Text appended to the number (e.g., "%", "+"). */
  suffix?: string;
}

export interface StatsBarProps {
  /** Array of stat items to display. */
  stats: StatItem[];
  /** Start counting when the element enters the viewport. */
  triggerOnView?: boolean;
  /** Additional Tailwind classes for the outer section. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

const COLUMN_MAP: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

export const StatsBar = forwardRef<HTMLElement, StatsBarProps>(
  ({ stats, triggerOnView = true, className, id, ...rest }, forwardedRef) => {
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef;

    const colClass = COLUMN_MAP[stats.length] ?? `md:grid-cols-${stats.length}`;

    return (
      <section
        ref={ref}
        id={id}
        data-component="stats-bar"
        className={cn("w-full px-6 py-16 md:py-24", className)}
        {...rest}
      >
        <div className={cn("mx-auto grid max-w-5xl grid-cols-2 gap-8", colClass)}>
          {stats.map((stat, index) => (
            <FadeUp key={stat.label} delay={index * 100} triggerOnView={triggerOnView}>
              <div className="text-center">
                <Counter
                  from={0}
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  triggerOnView={triggerOnView}
                  className="text-4xl font-bold tracking-tight"
                />
                <p className="mt-2 text-sm text-neutral-400">{stat.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    );
  },
);

StatsBar.displayName = "StatsBar";
