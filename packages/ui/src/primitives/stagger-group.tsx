"use client";

import type { StaggerName } from "@ui-universe/tokens";
import { stagger as staggerTokens } from "@ui-universe/tokens";
import type { JSX } from "react";
import { Children, type ReactNode, cloneElement, isValidElement, useRef } from "react";
import { useInView } from "../hooks/use-in-view";
import { cn } from "../lib/utils";

export interface StaggerGroupProps {
  children: ReactNode;
  stagger?: StaggerName | number;
  triggerOnView?: boolean;
  viewThreshold?: number;
  once?: boolean;
  className?: string;
}

export function StaggerGroup({
  children,
  stagger = "normal",
  triggerOnView = true,
  viewThreshold = 0.1,
  once = true,
  className,
}: StaggerGroupProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: viewThreshold, once });

  const staggerMs = typeof stagger === "number" ? stagger : staggerTokens[stagger];

  const shouldRender = triggerOnView ? isInView : true;

  return (
    <div ref={ref} className={cn(className)}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return cloneElement(child as React.ReactElement<{ delay?: number }>, {
          delay: shouldRender ? index * staggerMs : 0,
        });
      })}
    </div>
  );
}

StaggerGroup.displayName = "StaggerGroup";
