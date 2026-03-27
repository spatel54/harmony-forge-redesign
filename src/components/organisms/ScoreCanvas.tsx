"use client";

import React from "react";
import { Music, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { SandboxContextMenu } from "./SandboxContextMenu";
import { useSandboxStore } from "@/store/useSandboxStore";
import { useScoreStore } from "@/store/useScoreStore";
import type { NoteData } from "@/store/useScoreStore";

export interface ScoreCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  staveLabels?: [string, string, string, string];
  showViolations?: boolean;
  /** Piece name from useUploadStore — populates aria-label dynamically */
  pieceName?: string;
}

/**
 * ScoreCanvas Organism
 * Pencil Node: fsxhw ("ScoreCanvas") — fills MainArea, 632px tall.
 *
 * Renders four SATB staves via VexFlow 5 SVG backend inside a useEffect.
 * VexFlow is dynamically imported (client-only) per ADR-009.
 * A ResizeObserver re-renders staves whenever the container width changes.
 *
 * Voice labels (S/A/T/B) are rendered as a separate SVG overlay so they
 * sit at a fixed left offset regardless of VexFlow's internal layout.
 *
 * Violation overlays and badges remain as design placeholders until TASK-A24
 * wires them to the backend violation JSON + VexFlow coordinate mapping.
 */

// Vertical top-line position of each stave within the container (px)
const STAVE_Y_OFFSETS = [40, 120, 200, 280] as const;

// Horizontal offset: leaves space for system brace + voice labels
const STAVE_X = 80;

// Clef per SATB voice: Soprano/Alto = treble, Tenor = tenor (C clef), Bass = bass
const STAVE_CLEFS = ["treble", "treble", "tenor", "bass"] as const;


export const ScoreCanvas = React.forwardRef<HTMLDivElement, ScoreCanvasProps>(
  (
    {
      staveLabels = ["S", "A", "T", "B"],
      showViolations = false,
      pieceName,
      className,
      ...props
    },
    ref,
  ) => {
    const { openContextMenu } = useSandboxStore();
    const notes = useScoreStore((s) => s.notes);
    const vfContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const containerEl = vfContainerRef.current;
      if (!containerEl) return;

      let rafId: number;

      const renderScore = () => {
        // Dynamic import per ADR-009: guarantees client-only execution, SSR-safe
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import("vexflow").then((vf: any) => {
          const { Renderer, Stave, StaveConnector, StaveNote, Formatter } = vf;
          // Clear previous VexFlow SVG before re-rendering
          containerEl.innerHTML = "";

          const containerWidth = containerEl.clientWidth;
          const containerHeight = containerEl.clientHeight;
          if (containerWidth === 0) return;

          // Stave width fills container minus left offset + right margin
          const staveWidth = containerWidth - STAVE_X - 20;

          // Minimum height: bottom of last stave (280) + stave body (40) + padding (40)
          const renderHeight = Math.max(containerHeight, 380);

          const renderer = new Renderer(containerEl, Renderer.Backends.SVG);
          renderer.resize(containerWidth, renderHeight);
          const ctx = renderer.getContext();

          // Propagate Nocturne/Sonata theme tokens to VexFlow SVG paths
          ctx.setStrokeStyle("var(--hf-text-primary)");
          ctx.setFillStyle("var(--hf-text-primary)");

          // Render four SATB staves, adding clef + time signature to the first
          const staveRefs = STAVE_Y_OFFSETS.map((y, i) => {
            const stave = new Stave(STAVE_X, y, staveWidth);
            stave.addClef(STAVE_CLEFS[i]);
            if (i === 0) stave.addTimeSignature("4/4");
            stave.setContext(ctx).draw();
            return stave;
          });

          // System brace spanning all four staves
          const brace = new StaveConnector(staveRefs[0], staveRefs[3]);
          brace.setType(StaveConnector.type.BRACE);
          brace.setContext(ctx).draw();

          // Opening barline connecting top and bottom staves
          const openBarline = new StaveConnector(staveRefs[0], staveRefs[3]);
          openBarline.setType(StaveConnector.type.SINGLE_LEFT);
          openBarline.setContext(ctx).draw();

          // Render notes from ScoreState store — grouped by staveIndex.
          // Formatter.FormatAndDraw handles Voice creation, joining, and horizontal placement.
          staveRefs.forEach((stave, staveIndex) => {
            const staveNotes = notes.filter((n: NoteData) => n.staveIndex === staveIndex);
            if (staveNotes.length === 0) return;
            const vfNotes = staveNotes.map(
              (n: NoteData) =>
                new StaveNote({ keys: [n.key], duration: n.duration, clef: n.clef }),
            );
            Formatter.FormatAndDraw(ctx, stave, vfNotes);
          });
        });
      };

      const onResize = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(renderScore);
      };

      const observer = new ResizeObserver(onResize);
      observer.observe(containerEl);
      renderScore();

      return () => {
        observer.disconnect();
        cancelAnimationFrame(rafId);
      };
    }, [notes]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex-1 min-h-0 overflow-hidden score-canvas-container",
          className,
        )}
        role="img"
        aria-label={
          pieceName
            ? `SATB score: ${pieceName}`
            : "Score canvas — SATB grand staff"
        }
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e.clientX, e.clientY);
        }}
        {...props}
      >
        {/* VexFlow SVG render target — dynamic import writes into this div */}
        <div
          ref={vfContainerRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Voice labels: S / A / T / B — positioned left of STAVE_X */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {STAVE_Y_OFFSETS.map((y, i) => (
            <text
              key={staveLabels[i]}
              x={STAVE_X - 20}
              y={y + 10}
              textAnchor="middle"
              fontSize={16}
              fontFamily="'Instrument Serif', serif"
              style={{ fill: "var(--hf-text-secondary)" }}
            >
              {staveLabels[i]}
            </text>
          ))}
        </svg>

        {/* ── Violation overlays ─────────────────────────────────────────
            Design placeholders — coordinates will be computed from VexFlow
            note positions by RedLineTooltip in TASK-A24.
            Colors below are semantic tokens; ad-hoc hex values are deferred
            to the full RedLineTooltip implementation.                      */}
        {showViolations && (
          <>
            {/* BlueNoteHL: x:116 y:36 w:20 h:230 */}
            <div
              className="absolute rounded-[2px]"
              style={{
                left: 116,
                top: 36,
                width: 20,
                height: 230,
                backgroundColor: "var(--semantic-warning-10)",
                border: "1px solid var(--semantic-warning)",
              }}
              aria-hidden="true"
            />

            {/* OrangeNoteHL: x:196 y:36 w:20 h:230 */}
            <div
              className="absolute rounded-[2px]"
              style={{
                left: 196,
                top: 36,
                width: 20,
                height: 230,
                backgroundColor: "var(--sonata-accent-10)",
                border: "1px solid var(--hf-accent)",
              }}
              aria-hidden="true"
            />

            {/* ViolationOverlay: x:188 y:36 w:56 h:230 */}
            <div
              className="absolute rounded-[2px]"
              style={{
                left: 188,
                top: 36,
                width: 56,
                height: 230,
                backgroundColor: "var(--semantic-violation-10)",
                border: "1px solid var(--semantic-violation)",
              }}
              aria-hidden="true"
            />

            {/* BlueBadge: x:114 y:24 */}
            <div
              className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-full"
              style={{
                left: 114,
                top: 24,
                backgroundColor: "var(--semantic-warning)",
              }}
              aria-label="Blue note group"
              role="img"
            >
              <Music
                className="w-[12px] h-[12px] text-white"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            {/* AmberBadge: x:190 y:24 */}
            <div
              className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-full"
              style={{
                left: 190,
                top: 24,
                backgroundColor: "var(--hf-accent)",
              }}
              aria-label="Amber note group"
              role="img"
            >
              <Music
                className="w-[12px] h-[12px] text-white"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            {/* ViolBadge: x:220 y:24 */}
            <div
              className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-full"
              style={{
                left: 220,
                top: 24,
                backgroundColor: "var(--semantic-violation)",
              }}
              aria-label="Voice-leading violation"
              role="img"
            >
              <TriangleAlert
                className="w-[12px] h-[12px] text-white"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </>
        )}

        <SandboxContextMenu />
      </div>
    );
  },
);

ScoreCanvas.displayName = "ScoreCanvas";
