import React from "react";
import { Music, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScoreCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  staveLabels?: [string, string, string, string];
  showViolations?: boolean;
}

/**
 * ScoreCanvas Organism
 * Pencil Node: fsxhw ("ScoreCanvas") — fill_container × 632px inside MainArea.
 *
 * Spec (all absolute pixel coords, canvas 1060×632, score area ~1060px wide):
 *   fill: $neutral-50
 *   layout: none (absolute positioning)
 *
 *   Staves (x:80 from left edge):
 *     SopranoStave: x:80  y:40   w:980  h:37  layout:vertical gap:8  (5 lines, 1px each)
 *     AltoStave:    x:80  y:105  w:980  h:37
 *     TenorStave:   x:80  y:186  w:980  h:37  (4 lines per design)
 *     BassStave:    x:80  y:251  w:980  h:37  (5 lines)
 *
 *   Labels: x:60 — Instrument Serif fs:16 fill:#7A6050
 *     S at y:50, A at y:115, T at y:196, B at y:261
 *
 *   SystemBrace: x:76 y:40 w:4 h:252 fill:$neutral-500 r:2
 *   OpenBarline: x:80 y:40 w:2 h:255 fill:$neutral-700
 *   Barline1:    x:340 y:40 w:1 h:255
 *   Barline2:    x:600 y:40 w:1 h:255
 *
 *   Notes (ellipse 12×9):
 *     Blue group (x:120):  S y:48, A y:113, T y:194, B y:259
 *     Amber group (x:200): S y:52, A y:117, T y:198, B y:263
 *     Default (x:280):     S y:44, A y:109, T y:190, B y:255
 *     Stems (1px wide, h:28): SStem1 x:131 y:22, SStem2 x:211 y:26, SStem3 x:291 y:18
 *
 *   Highlights (w:20 h:230, r:2, with stroke):
 *     BlueNoteHL:   x:116 y:36  fill:#1976D21A  stroke:#1976D2 @1
 *     OrangeNoteHL: x:196 y:36  fill:#FFB3001A  stroke:#FFB300 @1
 *
 *   ViolationOverlay: x:188 y:36 w:56 h:230  fill:$semantic-violation/10  stroke:$semantic-violation @1
 *
 *   Badges (24×24 circle r:12):
 *     ViolBadge:  x:220 y:24  fill:$semantic-violation  icon:triangle-alert 12×12 white
 *     BlueBadge:  x:114 y:24  fill:#1976D2              icon:music 12×12 white
 *     AmberBadge: x:190 y:24  fill:#FFB300              icon:music 12×12 white
 */
export const ScoreCanvas = React.forwardRef<HTMLDivElement, ScoreCanvasProps>(
  (
    {
      staveLabels = ["S", "A", "T", "B"],
      showViolations = false,
      className,
      ...props
    },
    ref,
  ) => {
    // Stave definitions matching Pencil absolute coords
    const staves = [
      { y: 40, lines: 5, label: staveLabels[0], labelY: 50 },
      { y: 105, lines: 5, label: staveLabels[1], labelY: 115 },
      { y: 186, lines: 4, label: staveLabels[2], labelY: 196 },
      { y: 251, lines: 5, label: staveLabels[3], labelY: 261 },
    ];

    // Notes: [x, y, color]
    const blueNotes: [number, number][] = [
      [120, 48],
      [120, 113],
      [120, 194],
      [120, 259],
    ];
    const amberNotes: [number, number][] = [
      [200, 52],
      [200, 117],
      [200, 198],
      [200, 263],
    ];
    const defaultNotes: [number, number][] = [
      [280, 44],
      [280, 109],
      [280, 190],
      [280, 255],
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex-1 min-h-0 overflow-hidden score-canvas-container",
          className,
        )}
        role="img"
        aria-label="Score canvas — SATB grand staff"
        {...props}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* ── Stave lines ───────────────────────────────── */}
          {staves.map((stave, si) => {
            const lineSpacing = 8; // gap:8 between lines
            return (
              <g key={si}>
                {Array.from({ length: stave.lines }, (_, li) => (
                  <line
                    key={li}
                    x1={80}
                    x2={80 + 980}
                    y1={stave.y + li * lineSpacing}
                    y2={stave.y + li * lineSpacing}
                    strokeWidth={1}
                    style={{ stroke: "var(--hf-staff-line)" }}
                  />
                ))}
              </g>
            );
          })}

          {/* ── Voice labels — Instrument Serif fs:16 ─────── */}
          {staves.map((stave, si) => (
            <text
              key={si}
              x={60}
              y={stave.labelY}
              textAnchor="middle"
              fontSize={16}
              fontFamily="'Instrument Serif', serif"
              style={{ fill: "var(--hf-text-secondary)" }}
            >
              {stave.label}
            </text>
          ))}

          {/* ── System Brace: x:76 y:40 w:4 h:252 r:2 ──── */}
          <rect
            x={76}
            y={40}
            width={4}
            height={252}
            rx={2}
            style={{ fill: "var(--hf-staff-line)" }}
          />

          {/* ── Open barline: x:80 y:40 w:2 h:255 ────────── */}
          <rect
            x={80}
            y={40}
            width={2}
            height={255}
            style={{ fill: "var(--hf-detail)" }}
          />

          {/* ── Barline 1: x:340 ──────────────────────────── */}
          <rect
            x={340}
            y={40}
            width={1}
            height={255}
            style={{ fill: "var(--hf-detail)" }}
          />

          {/* ── Barline 2: x:600 ──────────────────────────── */}
          <rect
            x={600}
            y={40}
            width={1}
            height={255}
            style={{ fill: "var(--hf-detail)" }}
          />

          {/* Highlight overlays (drawn before notes so notes are on top) ── */}
          {showViolations && (
            <>
              {/* BlueNoteHL: x:116 y:36 w:20 h:230 fill:#1976D21A stroke:#1976D2 r:2 */}
              <rect
                x={116}
                y={36}
                width={20}
                height={230}
                rx={2}
                fill="#1976D21A"
                stroke="#1976D2"
                strokeWidth={1}
              />

              {/* OrangeNoteHL: x:196 y:36 w:20 h:230 fill:#FFB3001A stroke:#FFB300 r:2 */}
              <rect
                x={196}
                y={36}
                width={20}
                height={230}
                rx={2}
                fill="#FFB3001A"
                stroke="#FFB300"
                strokeWidth={1}
              />
            </>
          )}

          {/* ViolationOverlay: x:188 y:36 w:56 h:230 fill:violation/10 stroke:violation */}
          {showViolations && (
            <rect
              x={188}
              y={36}
              width={56}
              height={230}
              style={{
                fill: "var(--semantic-violation-10)",
                stroke: "var(--semantic-violation)",
              }}
              strokeWidth={1}
            />
          )}

          {/* ── Stems ─────────────────────────────────────── */}
          <rect
            x={131}
            y={22}
            width={1}
            height={28}
            style={{
              fill: showViolations ? "#1976D2" : "var(--hf-text-primary)",
            }}
          />
          <rect
            x={211}
            y={26}
            width={1}
            height={28}
            style={{
              fill: showViolations ? "#FFB300" : "var(--hf-text-primary)",
            }}
          />
          <rect
            x={291}
            y={18}
            width={1}
            height={28}
            style={{ fill: "var(--hf-text-primary)" }}
          />

          {/* ── Blue notes ────────────────────────────────── */}
          {blueNotes.map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={6}
              ry={4.5}
              style={{
                fill: showViolations ? "#1976D2" : "var(--hf-text-primary)",
              }}
            />
          ))}

          {/* ── Amber notes ───────────────────────────────── */}
          {amberNotes.map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={6}
              ry={4.5}
              style={{
                fill: showViolations ? "#FFB300" : "var(--hf-text-primary)",
              }}
            />
          ))}

          {/* ── Default notes ─────────────────────────────── */}
          {defaultNotes.map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={6}
              ry={4.5}
              style={{ fill: "var(--hf-text-primary)" }}
            />
          ))}
        </svg>

        {/* ── Badges (HTML overlays for easier pointer-events) ──
            All 24×24 with r:12 (full circle)                    */}

        {showViolations && (
          <>
            {/* BlueBadge: x:114 y:24 fill:#1976D2 */}
            <div
              className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-full"
              style={{ left: 114, top: 24, backgroundColor: "#1976D2" }}
              aria-label="Blue note group"
              role="img"
            >
              <Music
                className="w-[12px] h-[12px] text-white"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            {/* AmberBadge: x:190 y:24 fill:#FFB300 */}
            <div
              className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-full"
              style={{ left: 190, top: 24, backgroundColor: "#FFB300" }}
              aria-label="Amber note group"
              role="img"
            >
              <Music
                className="w-[12px] h-[12px] text-white"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </>
        )}

        {/* ViolBadge: x:220 y:24 fill:$semantic-violation */}
        {showViolations && (
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
        )}

        {/* VexFlow live render target */}
        <div
          id="score-vexflow-root"
          className="absolute inset-0 pointer-events-auto"
          aria-hidden="true"
        />
      </div>
    );
  },
);

ScoreCanvas.displayName = "ScoreCanvas";
