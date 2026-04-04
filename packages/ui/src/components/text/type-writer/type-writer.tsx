"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { useInterval } from "../../../hooks/use-interval";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface TypeWriterProps {
  /** The text string to type out character-by-character. */
  text: string;
  /** Typing speed in milliseconds per character. */
  speed?: number;
  /** Show a blinking cursor at the typing position. */
  cursor?: boolean;
  /** Character used for the cursor. */
  cursorChar?: string;
  /** Restart typing from the beginning after completion. */
  loop?: boolean;
  /** Delay in milliseconds before typing starts. */
  delay?: number;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const TypeWriter = forwardRef<HTMLSpanElement, TypeWriterProps>(
  (
    {
      text,
      speed = 50,
      cursor = true,
      cursorChar = "|",
      loop = false,
      delay = 0,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLSpanElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLSpanElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();
    const [charIndex, setCharIndex] = useState(0);
    const [isDelaying, setIsDelaying] = useState(delay > 0);
    const [isComplete, setIsComplete] = useState(false);

    // Handle initial delay
    useInterval(
      useCallback(() => {
        setIsDelaying(false);
      }, []),
      isDelaying ? delay : null,
    );

    // Typing interval
    useInterval(
      useCallback(() => {
        if (charIndex < text.length) {
          setCharIndex((prev) => prev + 1);
        } else {
          setIsComplete(true);
          if (loop) {
            // Wait 1 second then reset
            setTimeout(() => {
              setCharIndex(0);
              setIsComplete(false);
            }, 1000);
          }
        }
      }, [charIndex, text.length, loop]),
      !prefersReducedMotion && !isDelaying && (!isComplete || loop) ? speed : null,
    );

    const displayedText = prefersReducedMotion ? text : text.slice(0, charIndex);

    return (
      <span
        ref={ref}
        id={id}
        className={cn("uiu-type-writer", className)}
        data-component="type-writer"
        aria-label={text}
        aria-live="polite"
        {...rest}
      >
        {displayedText}
        {cursor && !prefersReducedMotion && (
          <span
            className="uiu-type-writer-cursor"
            aria-hidden="true"
            style={{
              display: "inline-block",
              animation: "uiu-cursor-blink 1s step-end infinite",
            }}
          >
            {cursorChar}
          </span>
        )}
        <style>{`
          @keyframes uiu-cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </span>
    );
  },
);

TypeWriter.displayName = "TypeWriter";
