"use client";

import type { StaggerName } from "@ui-universe/tokens";
import React, { type ReactNode, forwardRef, useRef } from "react";
import { cn } from "../../../lib/utils";
import { StaggerGroup } from "../../../primitives/stagger-group";
import { FadeUp } from "../../animations/fade-up";

export interface FeatureGridProps {
  /** Feature card elements to render in the grid. */
  children: ReactNode;
  /** Number of columns on desktop. */
  columns?: 2 | 3 | 4;
  /** Stagger delay between children. Accepts a token name or milliseconds. */
  stagger?: StaggerName | number;
  /** Gap class applied to the grid. */
  gap?: string;
  /** Additional Tailwind classes for the outer section. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

const COLUMN_MAP: Record<2 | 3 | 4, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export const FeatureGrid = forwardRef<HTMLElement, FeatureGridProps>(
  (
    { children, columns = 3, stagger = "normal", gap = "gap-6", className, id, ...rest },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef;

    return (
      <section
        ref={ref}
        id={id}
        data-component="feature-grid"
        data-columns={columns}
        className={cn("w-full px-6 py-16 md:py-24", className)}
        {...rest}
      >
        <StaggerGroup
          stagger={stagger}
          className={cn("grid grid-cols-1 md:grid-cols-2", COLUMN_MAP[columns], gap)}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            return <FadeUp>{child}</FadeUp>;
          })}
        </StaggerGroup>
      </section>
    );
  },
);

FeatureGrid.displayName = "FeatureGrid";
