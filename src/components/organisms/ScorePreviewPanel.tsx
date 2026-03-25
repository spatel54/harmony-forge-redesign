import React from "react";
import { cn } from "@/lib/utils";
import { PlaybackBar } from "@/components/molecules/PlaybackBar";

export interface ScorePreviewPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  scoreTitle?: string;
  scoreMeta?: string;
  /** Dynamic aria-label for the score canvas — e.g. "Score preview: The First Noel" */
  canvasAriaLabel?: string;
  /** Uploaded filename — when present, shows "Reviewing: [filename]" context line */
  filename?: string;
  /** Called when user clicks "Change file" — typically routes back to / */
  onChangeFile?: () => void;
  onReupload?: () => void;
}

/**
 * ScorePreviewPanel Organism
 * Extracted from Pencil Node ID: pGKLs ("Score Preview Panel")
 * Left column: score title/metadata tags → VexFlow canvas placeholder → PlaybackBar.
 * Fixed 897px wide. Canvas renders static staff lines as designed (VexFlow slot).
 */
export const ScorePreviewPanel = React.forwardRef<
  HTMLDivElement,
  ScorePreviewPanelProps
>(
  (
    {
      scoreTitle = "The First Noel",
      scoreMeta = "Traditional • 4 voices • Page 1 of 4",
      canvasAriaLabel,
      filename,
      onChangeFile,
      onReupload,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-[20px] w-[897px] shrink-0 h-full",
          "px-[24px] pt-[24px] pb-[20px]",
          className,
        )}
        style={{
          backgroundColor: "var(--hf-bg)",
          borderRight: "1px solid var(--hf-detail)",
        }}
        {...props}
      >
        {/* Score info block — Node TqhQo */}
        <div className="flex flex-col gap-[4px] w-full">
          {/* Title */}
          <h2
            className="font-brand text-[22px] font-normal leading-none text-center"
            style={{ color: "var(--hf-text-primary)" }}
          >
            {scoreTitle}
          </h2>

          {/* Meta subtitle */}
          <p
            className="font-mono text-[11px] font-normal leading-none text-center"
            style={{ color: "var(--hf-text-secondary)" }}
          >
            {scoreMeta}
          </p>

          {/* Metadata tag row — Node HSp9s */}
          <div
            className="flex items-center justify-center gap-[6px] mt-[8px]"
            role="list"
            aria-label="Score metadata"
          >
            {/* TagSATB */}
            <span
              role="listitem"
              className="font-mono text-[10px] font-normal leading-none rounded-full px-[10px] py-[4px] border"
              style={{
                color: "var(--hf-text-primary)",
                backgroundColor:
                  "color-mix(in srgb, var(--hf-surface) 10%, transparent)",
                borderColor: "var(--hf-detail)",
              }}
            >
              SATB
            </span>

            {/* Tag44 */}
            <span
              role="listitem"
              className="font-mono text-[10px] font-normal leading-none rounded-full px-[10px] py-[4px] border"
              style={{
                color: "var(--hf-text-primary)",
                backgroundColor:
                  "color-mix(in srgb, var(--hf-surface) 10%, transparent)",
                borderColor: "var(--hf-detail)",
              }}
            >
              4/4
            </span>

            {/* TagTrad */}
            <span
              role="listitem"
              className="font-mono text-[10px] font-normal leading-none rounded-full px-[10px] py-[4px] border"
              style={{
                color: "var(--hf-text-primary)",
                backgroundColor:
                  "color-mix(in srgb, var(--hf-surface) 10%, transparent)",
                borderColor: "var(--hf-detail)",
              }}
            >
              Traditional
            </span>
          </div>

          {/* Reviewing context — visible only when filename is provided */}
          {filename && (
            <p
              className="font-mono text-[10px] font-normal leading-none text-center mt-[6px]"
              style={{ color: "var(--hf-text-sub)" }}
            >
              Reviewing: {filename}
              {onChangeFile && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={onChangeFile}
                    className="underline underline-offset-2 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hf-accent)]"
                    style={{ color: "var(--hf-text-sub)" }}
                  >
                    Change file
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        {/* Score Canvas — Node qkNNs — VexFlow placeholder */}
        <div
          className={cn(
            "flex-1 min-h-0 w-full rounded-[8px] overflow-hidden relative",
            "border border-[var(--hf-detail)] score-canvas-container",
          )}
          role="img"
          aria-label={canvasAriaLabel ?? "Score preview canvas"}
        >
          {/* Static staff-line grid matching design placeholder */}
          <StaffLinePlaceholder />
        </div>

        {/* Playback bar — Node RctEd */}
        <PlaybackBar
          measure="1"
          totalMeasures={24}
          bpm={96}
          onReupload={onReupload}
        />
      </div>
    );
  },
);

ScorePreviewPanel.displayName = "ScorePreviewPanel";

/**
 * StaffLinePlaceholder
 * Renders three systems of 5-line staves at the positions defined in the design
 * (nodes sl1–sl15, bar lines, clef icons). Pure presentational — replaced by
 * VexFlow in a later phase.
 */
function StaffLinePlaceholder() {
  const staffColor = "var(--hf-staff-line)";

  // Three staff systems, 5 lines each, at y = 120/130/140/150/160, 220/…, 320/…
  const systemOffsets = [120, 220, 320];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {systemOffsets.map((baseY) =>
        [0, 10, 20, 30, 40].map((dy, i) => (
          <line
            key={`${baseY}-${i}`}
            x1="0"
            y1={baseY + dy}
            x2="800"
            y2={baseY + dy}
            stroke={staffColor}
            strokeWidth={1}
          />
        )),
      )}

      {/* Barlines at design positions */}
      {systemOffsets.map((baseY) =>
        [60, 170, 280, 390, 500, 610, 720].map((x) => (
          <line
            key={`bar-${baseY}-${x}`}
            x1={x}
            y1={baseY}
            x2={x}
            y2={baseY + 40}
            stroke={staffColor}
            strokeWidth={1}
          />
        )),
      )}

      {/* Canvas label */}
      <text
        x="80"
        y="108"
        fill={staffColor}
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
        fontWeight="normal"
        opacity="0.6"
      >
        VexFlow score renders here
      </text>
    </svg>
  );
}
