"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/atoms/LogoLockup";
import { StepBar } from "@/components/molecules/StepBar";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { useSandboxStore } from "@/store/useSandboxStore";
import { Download, Maximize2, Minimize2 } from "lucide-react";

export interface SandboxHeaderProps extends React.HTMLAttributes<HTMLElement> {
  onExportClick?: () => void;
}

/**
 * SandboxHeader Organism
 * Pencil Node: rW8YN ("Header") — 1440×64px top bar of dcf2A.
 * Logo lockup (left) · Theme toggle (right).
 * Border-bottom: 1px $sonata-detail.
 */
export const SandboxHeader = React.forwardRef<HTMLElement, SandboxHeaderProps>(
  ({ className, onExportClick, ...props }, ref) => {
    const isExpanded = useSandboxStore((s) => s.isExpanded);
    const setExpanded = useSandboxStore((s) => s.setExpanded);

    return (
      <header
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full h-[64px] px-[40px]",
          "shrink-0",
          className,
        )}
        style={{
          backgroundColor: "var(--hf-bg)",
          borderBottom: "1px solid var(--sonata-detail)",
        }}
        {...props}
      >
        {/* Logo — Node ipFi5 */}
        <LogoLockup />

        {/* Center: Progress steps — Step 3: Sandbox */}
        <StepBar currentStep={3} aria-label="Arrangement progress" />

        {/* Right controls — Node 9zJvZ */}
        <div className="flex items-center gap-[12px]">
          <button
            data-coachmark="step-10"
            onClick={onExportClick}
            className="flex items-center gap-[6px] h-[32px] px-[12px] rounded-[6px] border border-[var(--hf-detail)] text-[var(--hf-text-primary)] hover:bg-[rgba(var(--hf-surface-rgb),0.05)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hf-surface)]"
          >
            <Download className="w-[14px] h-[14px] opacity-70" />
            <span className="font-mono text-[11px] font-medium mt-0.5">
              Export
            </span>
          </button>

          {/* Expand / Collapse score — AC-006 */}
          <button
            type="button"
            onClick={() => setExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse score" : "Expand score"}
            aria-pressed={isExpanded}
            className="flex items-center justify-center w-[32px] h-[32px] rounded-[6px] border border-[var(--hf-detail)] text-[var(--hf-text-primary)] hover:bg-[rgba(var(--hf-surface-rgb),0.05)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hf-accent)]"
          >
            {isExpanded ? (
              <Minimize2 className="w-[14px] h-[14px]" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Maximize2 className="w-[14px] h-[14px]" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>

          <div className="w-[1px] h-[16px] bg-[var(--hf-detail)] opacity-50 mx-[4px]" />
          <ThemeToggle />
        </div>
      </header>
    );
  },
);

SandboxHeader.displayName = "SandboxHeader";
