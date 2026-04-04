"use client";

import { type CSSProperties, type ReactNode, forwardRef, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface LogoMarqueeProps {
  /** Logo or brand elements to scroll. */
  children: ReactNode;
  /** Seconds for one complete scroll cycle. Lower = faster. */
  speed?: number;
  /** Pause scrolling when the user hovers. */
  pauseOnHover?: boolean;
  /** Scroll direction. */
  direction?: "left" | "right";
  /** Additional Tailwind classes for the outer container. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const LogoMarquee = forwardRef<HTMLDivElement, LogoMarqueeProps>(
  (
    { children, speed = 30, pauseOnHover = true, direction = "left", className, id, ...rest },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();

    const animationDirection = direction === "right" ? "reverse" : "normal";

    const trackStyle: CSSProperties = prefersReducedMotion
      ? { display: "flex", gap: "2rem" }
      : {
          display: "flex",
          gap: "2rem",
          animation: `uiu-marquee ${speed}s linear infinite`,
          animationDirection,
        };

    return (
      <div
        ref={ref}
        id={id}
        data-component="logo-marquee"
        data-direction={direction}
        className={cn("group w-full overflow-hidden py-8", className)}
        {...rest}
      >
        {/* Inline keyframes — injected once via style tag */}
        <style>{`
          @keyframes uiu-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <div
          className={cn(
            "flex min-w-max items-center",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={trackStyle}
          aria-hidden="true"
        >
          {/* First copy */}
          {children}
          {/* Duplicate for seamless loop */}
          {children}
        </div>
      </div>
    );
  },
);

LogoMarquee.displayName = "LogoMarquee";
