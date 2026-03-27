import React from "react";
import { cn } from "@/lib/utils";

export type VoiceType = "soprano" | "alto" | "tenor" | "bass";

/** Semantic colors per voice — resolved from CSS custom properties for theme awareness */
const VOICE_COLORS: Record<VoiceType, { text: string; bg: string }> = {
  soprano: { text: "var(--hf-voice-soprano)", bg: "var(--hf-voice-soprano-bg)" },
  alto:    { text: "var(--hf-voice-alto)",    bg: "var(--hf-voice-alto-bg)" },
  tenor:   { text: "var(--hf-voice-tenor)",   bg: "var(--hf-voice-tenor-bg)" },
  bass:    { text: "var(--hf-voice-bass)",    bg: "var(--hf-voice-bass-bg)" },
};

export interface PartChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  voice: VoiceType;
  onRemove?: () => void;
}

/**
 * PartChip Atom
 * Extracted from Pencil Node ID: 9c48S ("ChipRow") children
 * Dismissible voice/instrument chip — color keyed by voice semantic token.
 */
export const PartChip = React.forwardRef<HTMLSpanElement, PartChipProps>(
  ({ label, voice, onRemove, className, ...props }, ref) => {
    const { text, bg } = VOICE_COLORS[voice];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-mono text-[10px] font-normal leading-none",
          "px-[10px] py-[4px]",
          className,
        )}
        style={{ color: text, backgroundColor: bg }}
        {...props}
      >
        {label}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current rounded-full"
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        )}
      </span>
    );
  },
);

PartChip.displayName = "PartChip";
