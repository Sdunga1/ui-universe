"use client";

import { type ReactNode, forwardRef, useRef } from "react";
import { cn } from "../../../lib/utils";
import { FadeUp } from "../../animations/fade-up";

export interface CTASectionProps {
  /** Primary heading content. */
  heading: ReactNode;
  /** Supporting description text. */
  description?: ReactNode;
  /** Primary action element (button or link). */
  primaryAction?: ReactNode;
  /** Secondary action element (button or link). */
  secondaryAction?: ReactNode;
  /** Additional Tailwind classes for the outer section. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const CTASection = forwardRef<HTMLElement, CTASectionProps>(
  (
    { heading, description, primaryAction, secondaryAction, className, id, ...rest },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef;

    return (
      <section
        ref={ref}
        id={id}
        data-component="cta-section"
        className={cn("mx-auto w-full max-w-3xl px-6 py-24 text-center", className)}
        {...rest}
      >
        <FadeUp triggerOnView>{heading}</FadeUp>

        {description && (
          <FadeUp delay={100} triggerOnView>
            <div className="mt-5">{description}</div>
          </FadeUp>
        )}

        {(primaryAction || secondaryAction) && (
          <FadeUp delay={200} triggerOnView>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              {primaryAction}
              {secondaryAction}
            </div>
          </FadeUp>
        )}
      </section>
    );
  },
);

CTASection.displayName = "CTASection";
