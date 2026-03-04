import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface PaletteToolItem {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface PaletteToolGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group label — e.g. "SCORE", "EDIT", "DURATION" */
  label: string;
  tools: PaletteToolItem[];
  /** Whether this group has a right-side divider border */
  separator?: boolean;
}

/**
 * PaletteToolGroup Molecule
 * Pencil: grpScore, grpEdit, grpDuration, grpPitch, grpText, grpMeasure,
 *         grpDynamics, grpArticulation (all inside r1–r3 of ScorePalette)
 *
 * Spec: gap:12 pad:[0,12] h:fill_container ai:center
 *       separator groups use stroke right:1 $sonata-detail
 *       label: IBM Plex Mono fs:10 fw:600 fill:$sonata-surface
 *       btn: 24×24 r:4; icon: 20×20
 */
export const PaletteToolGroup = React.forwardRef<
  HTMLDivElement,
  PaletteToolGroupProps
>(({ label, tools, separator = true, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center h-full gap-[12px] px-[12px]",
        separator && "border-r border-[var(--hf-detail)]",
        className,
      )}
      role="group"
      aria-label={label}
      {...props}
    >
      {/* Group label — IBM Plex Mono fs:10 fw:600 fill:$sonata-surface */}
      <span
        className="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase select-none whitespace-nowrap"
        style={{ color: "var(--hf-surface)" }}
        aria-hidden="true"
      >
        {label}
      </span>

      {/* Tool buttons — 24×24 r:4, icon 20×20 */}
      {tools.map((tool, i) => (
        <button
          key={i}
          type="button"
          onClick={tool.onClick}
          disabled={tool.disabled}
          aria-label={tool.label}
          title={
            tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label
          }
          className={cn(
            "flex items-center justify-center w-[24px] h-[24px] rounded-[4px]",
            "transition-colors duration-100",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-(--hf-accent)",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            tool.active
              ? "bg-(--hf-surface) text-(--neutral-50)"
              : "text-(--hf-text) hover:bg-(--hf-surface)/10",
          )}
        >
          <tool.icon
            className="w-[20px] h-[20px] shrink-0"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
});

PaletteToolGroup.displayName = "PaletteToolGroup";
