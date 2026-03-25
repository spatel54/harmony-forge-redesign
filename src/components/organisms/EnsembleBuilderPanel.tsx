"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceDropdown } from "@/components/molecules/VoiceDropdown";
import { EnsemblePreviewCard, type SelectedPart } from "@/components/molecules/EnsemblePreviewCard";
import type { VoiceType } from "@/components/atoms/PartChip";
import { useEnsembleStore } from "@/store/useEnsembleStore";
import { useUploadStore } from "@/store/useUploadStore";

/** Placeholder instrument lists per voice — replaced by backend data later */
const VOICE_INSTRUMENTS: Record<VoiceType, string[]> = {
  soprano: ["Soprano Voice", "Flute", "Oboe", "Violin I"],
  alto: ["Alto Voice", "Clarinet", "Viola", "French Horn"],
  tenor: ["Tenor Voice", "Trumpet", "Cello", "Trombone"],
  bass: ["Bass Voice", "Bassoon", "Double Bass", "Tuba"],
};

const VOICE_ORDER: VoiceType[] = ["soprano", "alto", "tenor", "bass"];

export interface EnsembleBuilderPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onGenerateHarmonies?: () => void;
}

/**
 * EnsembleBuilderPanel Organism
 * Extracted from Pencil Node ID: ZlAUA ("Ensemble Builder Panel")
 * Right column: heading → 4 VoiceDropdowns → divider → EnsemblePreviewCard → Generate CTA.
 * Reads/writes voice selections via useEnsembleStore. Client component.
 */
export const EnsembleBuilderPanel = React.forwardRef<
  HTMLDivElement,
  EnsembleBuilderPanelProps
>(({ onGenerateHarmonies, className, ...props }, ref) => {
  const voices = useEnsembleStore((s) => s.voices);
  const toggleVoiceInstrument = useEnsembleStore((s) => s.toggleVoiceInstrument);
  const fileValid = useUploadStore((s) => s.fileValid);
  const isDisabled = !fileValid;

  const handleToggle = (voice: VoiceType, instrument: string) => {
    toggleVoiceInstrument(voice, instrument);
  };

  const handleRemovePart = (label: string) => {
    for (const voice of VOICE_ORDER) {
      if (voices[voice].includes(label)) {
        toggleVoiceInstrument(voice, label);
        break;
      }
    }
  };

  // Flatten all selected parts into SelectedPart[] for preview card
  const selectedParts: SelectedPart[] = VOICE_ORDER.flatMap((voice) =>
    voices[voice].map((label) => ({ label, voice })),
  );

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[24px] flex-1 h-full overflow-y-auto",
        "px-[48px] pt-[32px] pb-[32px]",
        className,
      )}
      style={{
        backgroundColor: "var(--hf-panel-bg)",
        borderLeft: "1px solid var(--hf-detail)",
      }}
      {...props}
    >
      {/* Heading — Node eOoBk */}
      <div className="flex flex-col gap-[6px]">
        <h2
          className="font-brand text-[26px] font-normal leading-none"
          style={{ color: "var(--hf-text-primary)" }}
        >
          Ensemble Builder
        </h2>
        <p
          className="font-mono text-[12px] font-normal leading-none"
          style={{ color: "var(--hf-text-secondary)" }}
        >
          Select instruments for your arrangement
        </p>
      </div>

      {/* Voice List — Node iVLue */}
      <div className="flex flex-col gap-[10px] w-full">
        {VOICE_ORDER.map((voice) => (
          <VoiceDropdown
            key={voice}
            voice={voice}
            instruments={VOICE_INSTRUMENTS[voice]}
            selected={voices[voice]}
            onToggle={(instrument) => handleToggle(voice, instrument)}
          />
        ))}
      </div>

      {/* Divider — Node IPbv5 */}
      <div
        className="w-full h-[1px] shrink-0"
        style={{
          backgroundColor: "var(--hf-detail)",
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      {/* Ensemble Preview Card — Node LtBtZ */}
      <EnsemblePreviewCard
        selectedParts={selectedParts}
        totalParts={12}
        onRemovePart={handleRemovePart}
      />

      {/* Generate CTA row — Node nrVwz / rJKG6 */}
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={isDisabled ? undefined : onGenerateHarmonies}
          aria-label="Generate harmonies and open score in Sandbox"
          aria-disabled={isDisabled ? "true" : undefined}
          className={cn(
            "flex items-center gap-[8px] rounded-[6px] px-[24px] py-[12px]",
            "font-mono text-[13px] font-bold leading-none",
            "transition-opacity duration-150",
            isDisabled
              ? "opacity-40 pointer-events-none cursor-default"
              : "hover:opacity-90 active:opacity-80",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hf-surface)]",
          )}
          style={{
            backgroundColor: "var(--hf-accent)",
            color: "var(--text-on-light)",
          }}
        >
          <Sparkles
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          />
          Generate Harmonies
        </button>
      </div>
    </div>
  );
});

EnsembleBuilderPanel.displayName = "EnsembleBuilderPanel";
