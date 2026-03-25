"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/atoms/LogoLockup";
import { StepBar } from "@/components/molecules/StepBar";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

export interface DocumentHeaderProps extends React.HTMLAttributes<HTMLElement> {
  currentStep?: 1 | 2 | 3;
  /** Render a back-to-upload button left of the logo (document page only) */
  showBack?: boolean;
}

/**
 * DocumentHeader Organism
 * Extracted from Pencil Node ID: tHpLP ("Header")
 * 64px top bar: [Back?] Logo (left) · StepBar (center) · ThemeToggle (right).
 * Bottom border uses --hf-detail (light) / --nocturne-surface-40 (dark).
 */
export const DocumentHeader = React.forwardRef<
  HTMLElement,
  DocumentHeaderProps
>(({ currentStep = 2, showBack = false, className, ...props }, ref) => {
  const router = useRouter();

  return (
    <header
      ref={ref}
      className={cn(
        "flex items-center justify-between w-full h-[64px] shrink-0",
        "px-[40px]",
        className,
      )}
      style={{
        backgroundColor: "var(--hf-bg)",
        borderBottom: "1px solid var(--hf-detail)",
      }}
      {...props}
    >
      {/* Left: optional back button + Logo */}
      <div className="flex items-center gap-[12px]">
        {showBack && (
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Back to upload"
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-[6px]",
              "transition-opacity duration-150 hover:opacity-70",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--hf-accent)]",
            )}
            style={{ color: "var(--hf-text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        <LogoLockup />
      </div>

      {/* Center: Progress steps */}
      <StepBar currentStep={currentStep} aria-label="Arrangement progress" />

      {/* Right: Theme toggle */}
      <ThemeToggle />
    </header>
  );
});

DocumentHeader.displayName = "DocumentHeader";
