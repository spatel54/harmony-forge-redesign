"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScorePaginationDockProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

/**
 * ScorePaginationDock Molecule
 *
 * Floating Apple-style pill dock anchored bottom-center within the score
 * canvas container. Responds to ArrowLeft / ArrowRight keyboard events
 * so the composer can page through the score without leaving the canvas.
 *
 * Positioning: absolute inside a `relative` canvas wrapper so it never
 * overlaps the SandboxPlaybackBar that sits outside/below the wrapper.
 *
 * POUR:
 *   - role="navigation" aria-label="Score pages" on the container
 *   - aria-live="polite" on the page counter so screen readers announce changes
 *   - aria-label on prev/next buttons; aria-disabled when at boundary
 *   - focus-visible ring uses --hf-accent token
 *
 * Keyboard:
 *   ArrowLeft  → onPrev (when currentPage > 1)
 *   ArrowRight → onNext (when currentPage < totalPages)
 *   Listener attached to the document so it works without explicit focus on
 *   the dock — matches Apple Music / Keynote convention for arrow-key paging.
 */
export const ScorePaginationDock = React.forwardRef<
  HTMLDivElement,
  ScorePaginationDockProps
>(({ currentPage, totalPages, onPrev, onNext, className }, ref) => {
  // Stable refs so the keydown listener always closes over the latest callbacks
  // without re-registering on every render.
  const onPrevRef = React.useRef(onPrev);
  const onNextRef = React.useRef(onNext);
  const currentPageRef = React.useRef(currentPage);
  const totalPagesRef = React.useRef(totalPages);

  React.useEffect(() => {
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
    currentPageRef.current = currentPage;
    totalPagesRef.current = totalPages;
  }, [onPrev, onNext, currentPage, totalPages]);

  // Global ArrowLeft / ArrowRight listener — fires when no text input is focused
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if the active element is a text input or textarea to avoid
      // interfering with note-name or search entry.
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowLeft" && currentPageRef.current > 1) {
        e.preventDefault();
        onPrevRef.current();
      } else if (
        e.key === "ArrowRight" &&
        currentPageRef.current < totalPagesRef.current
      ) {
        e.preventDefault();
        onNextRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // empty deps — stable via refs

  const atFirst = currentPage <= 1;
  const atLast = currentPage >= totalPages;

  const btnBase = cn(
    "flex items-center justify-center w-[28px] h-[28px] rounded-full",
    "transition-opacity duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hf-accent)",
  );

  return (
    <div
      ref={ref}
      role="navigation"
      aria-label="Score pages"
      className={cn(
        // Floating pill — bottom-center of the canvas wrapper
        "absolute bottom-[20px] left-1/2 -translate-x-1/2",
        "flex items-center gap-[6px]",
        "h-[36px] px-[10px] rounded-full",
        // Depth: sits above canvas, below ChatFAB z-layer
        "z-10",
        className,
      )}
      style={{
        backgroundColor: "var(--hf-bg)",
        border: "1px solid var(--hf-detail)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {/* Prev page */}
      <button
        type="button"
        aria-label="Previous page"
        aria-disabled={atFirst ? "true" : undefined}
        onClick={atFirst ? undefined : onPrev}
        className={cn(
          btnBase,
          atFirst
            ? "opacity-30 cursor-default pointer-events-none"
            : "hover:opacity-70 cursor-pointer",
        )}
        style={{ color: "var(--hf-text-primary)" }}
      >
        <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Page counter */}
      <span
        className="font-mono text-[12px] font-medium tabular-nums select-none px-[4px]"
        style={{ color: "var(--hf-text-primary)" }}
        aria-live="polite"
        aria-label={`Page ${currentPage} of ${totalPages}`}
      >
        {currentPage} <span style={{ color: "var(--hf-text-secondary)" }}>/</span> {totalPages}
      </span>

      {/* Next page */}
      <button
        type="button"
        aria-label="Next page"
        aria-disabled={atLast ? "true" : undefined}
        onClick={atLast ? undefined : onNext}
        className={cn(
          btnBase,
          atLast
            ? "opacity-30 cursor-default pointer-events-none"
            : "hover:opacity-70 cursor-pointer",
        )}
        style={{ color: "var(--hf-text-primary)" }}
      >
        <ChevronRight className="w-[14px] h-[14px]" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
});

ScorePaginationDock.displayName = "ScorePaginationDock";
