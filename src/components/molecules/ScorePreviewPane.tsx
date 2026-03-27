import React from "react";
import { cn } from "@/lib/utils";
import { SmuflIcon } from "../atoms/SmuflIcon";

export interface ScorePreviewPaneProps {
  className?: string;
}

export function ScorePreviewPane({ className }: ScorePreviewPaneProps) {
  return (
    <div
      data-coachmark="step-11"
      className={cn(
        "flex flex-col w-[480px] h-[700px] shrink-0",
        "bg-[var(--hf-bg)] border-r border-[var(--hf-detail)] rounded-l-[8px]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[60px] px-[24px] border-b border-[var(--hf-detail)] shrink-0">
        <h2 className="font-serif text-[18px] text-[var(--hf-text-primary)]">
          Score Preview
        </h2>
      </div>

      {/* Preview Area (Simulated SVG/Staves) */}
      <div className="flex-1 relative overflow-hidden bg-[#F8F3EA] dark:bg-[#1A1110]">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-0 bg-gradient-to-br from-[#F0E8D8] to-[#E8DCB8]" />

        {/* Placeholder for actual simulated preview SVG to match design specs */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
          <SmuflIcon
            name="duration-quarter"
            className="w-16 h-16 text-[var(--hf-text-primary)] mb-4"
          />
          <p className="font-mono text-xs text-[var(--hf-text-primary)]">
            Score Render Simulation
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-center h-[72px] gap-[4px] border-t border-[var(--hf-detail)] bg-[var(--hf-bg)] shrink-0 rounded-bl-[8px]">
        <span className="font-mono text-[10px] text-[var(--hf-text-secondary)]">
          4 voices · 3 measures · 1 violation
        </span>
        <span className="font-sans text-[10px] text-[var(--hf-text-sub)]">
          Last edited 2 min ago
        </span>
      </div>
    </div>
  );
}
