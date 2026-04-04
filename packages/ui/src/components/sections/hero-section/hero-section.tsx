"use client";

import { type ReactNode, forwardRef, useRef } from "react";
import { cn } from "../../../lib/utils";
import { FadeIn } from "../../animations/fade-in";
import { FadeUp } from "../../animations/fade-up";
import { ScaleIn } from "../../animations/scale-in";

export interface HeroSectionProps {
  /** Primary heading content. */
  heading: ReactNode;
  /** Supporting text below the heading. */
  subheading?: ReactNode;
  /** Call-to-action element (button, link, or group). */
  cta?: ReactNode;
  /** Visual element (image, video, illustration, or animation component). */
  visual?: ReactNode;
  /** Layout alignment. "center" stacks vertically; "left" creates a split layout. */
  align?: "left" | "center";
  /** Additional Tailwind classes for the outer section. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    { heading, subheading, cta, visual, align = "center", className, id, ...rest },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef;

    const isCentered = align === "center";

    return (
      <section
        ref={ref}
        id={id}
        data-component="hero-section"
        data-align={align}
        className={cn(
          "relative w-full px-6 py-20 md:py-32",
          "mx-auto max-w-7xl",
          isCentered
            ? "flex flex-col items-center text-center"
            : "grid grid-cols-1 items-center gap-12 lg:grid-cols-2",
          className,
        )}
        {...rest}
      >
        <div className={cn("flex flex-col gap-6", isCentered && "items-center")}>
          <FadeUp triggerOnView>{heading}</FadeUp>

          {subheading && (
            <FadeUp delay={100} triggerOnView>
              {subheading}
            </FadeUp>
          )}

          {cta && (
            <ScaleIn delay={200} triggerOnView>
              {cta}
            </ScaleIn>
          )}
        </div>

        {visual && (
          <FadeIn delay={300} triggerOnView>
            {visual}
          </FadeIn>
        )}
      </section>
    );
  },
);

HeroSection.displayName = "HeroSection";
