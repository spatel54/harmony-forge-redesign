import React from "react";
import {
  Search,
  ChevronDown,
  // SCORE group
  Layers,
  Copy,
  Printer,
  Save,
  ArrowUpRight,
  // EDIT group
  Undo2,
  Redo2,
  Scissors,
  Clipboard,
  Trash2,
  // TEXT group
  Type,
  Italic,
  Bold,
  Key,
  // MEASURE group
  BetweenHorizonalStart,
  BetweenHorizonalEnd,
  MessageSquare,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaletteToolGroup } from "@/components/molecules/PaletteToolGroup";
import { SmuflIcon } from "@/components/atoms/SmuflIcon";

// Helper wrappers to match LucideIcon signature
const createSmufl = (name: string) => {
  const IconComponent = React.forwardRef<SVGSVGElement, any>((props, ref) => (
    <SmuflIcon name={name} ref={ref} {...props} />
  ));
  IconComponent.displayName = `Smufl(${name})`;
  return IconComponent as any;
};

// DURATION
const SmuflQuarter = createSmufl("duration-quarter");
const SmuflDot = createSmufl("duration-dot");
const SmuflEighth = createSmufl("duration-eighth");
const SmuflHalf = createSmufl("duration-half");
const SmuflWhole = createSmufl("duration-whole");

// PITCH
const SmuflSharp = createSmufl("pitch-sharp");
const SmuflFlat = createSmufl("pitch-flat");

// MEASURE
const SmuflTreble = createSmufl("measure-treble");
const SmuflBass = createSmufl("measure-bass");
const SmuflAlto = createSmufl("measure-alto");
const SmuflBarline = createSmufl("measure-barline");

// DYNAMICS
const SmuflCresc = createSmufl("dynamics-cresc");
const SmuflDecresc = createSmufl("dynamics-decresc");

// ARTICULATION
const SmuflStaccato = createSmufl("articulation-staccato");
const SmuflAccent = createSmufl("articulation-accent");
const SmuflTenuto = createSmufl("articulation-tenuto");
const SmuflMarcato = createSmufl("articulation-marcato");
const SmuflFermata = createSmufl("articulation-fermata");
const SmuflSlur = createSmufl("articulation-slur");

export interface ScorePaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

/**
 * ScorePalette Organism
 * Pencil Node: I4sQk ("ScorePalette") — 1060×192px, left column toolbar.
 *
 * Spec:
 *   layout:vertical  fill:$sonata-bg  stroke bottom:1 $sonata-detail
 *
 *   r0 (search): h:48  gap:8  pad:[0,32]  jc:space_between  ai:center
 *                stroke bottom:1 $sonata-detail
 *   r1–r3:       h:48  gap:20  pad:[0,32]  ai:center
 *                stroke bottom:1 $sonata-detail
 *                Each group: gap:12  pad:[0,12]  stroke right:1 $sonata-detail
 *                  (last group in row: no right stroke)
 *   Icons inside btns: 20×20
 */
export const ScorePalette = React.forwardRef<HTMLDivElement, ScorePaletteProps>(
  ({ onSearchChange, searchValue = "", className, ...props }, ref) => {
    const ROW = cn(
      "flex items-center w-full h-[48px] px-[32px] gap-[20px]",
      "border-b border-[var(--hf-detail)]",
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col w-full shrink-0", className)}
        style={{ backgroundColor: "var(--hf-bg)" }}
        role="toolbar"
        aria-label="Score editing palette"
        {...props}
      >
        {/* ── Row 0: Search + filter ── Node 0gOLh ────────── */}
        <div className={ROW}>
          {/* Search input — Node NPFFl: h:30 r:6 fill:$neutral-50 stroke:$sonata-detail */}
          <div
            className="flex items-center gap-[8px] flex-1 h-[30px] rounded-[6px] px-[10px]"
            style={{
              backgroundColor: "var(--hf-canvas-bg)",
              border: "1px solid var(--hf-detail)",
            }}
          >
            <Search
              className="w-[14px] h-[14px] shrink-0"
              strokeWidth={1.75}
              style={{ color: "var(--hf-text-secondary)" }}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search controls…"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-body text-[13px] font-normal"
              style={{ color: "var(--hf-text-secondary)" }}
              aria-label="Search palette controls"
            />
          </div>

          {/* Dropdown trigger — Node tb8Ro: h:30 r:6 fill:$neutral-50 stroke:$sonata-detail gap:6 */}
          <button
            type="button"
            className="flex items-center gap-[6px] h-[30px] px-[10px] rounded-[6px] shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hf-accent)"
            style={{
              backgroundColor: "var(--hf-canvas-bg)",
              border: "1px solid var(--hf-detail)",
            }}
            aria-label="Filter tool groups"
            aria-haspopup="listbox"
          >
            <span
              className="font-body text-[12px] font-normal"
              style={{ color: "var(--hf-text-primary)" }}
            >
              All Tools
            </span>
            <ChevronDown
              className="w-[14px] h-[14px]"
              strokeWidth={1.75}
              style={{ color: "var(--hf-surface)" }}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* ── Row 1: SCORE / EDIT / DURATION ── Node 4mbSg ── */}
        <div className={ROW}>
          {/* SCORE: layers, copy, printer, save, arrow-up-right */}
          <PaletteToolGroup
            label="SCORE"
            separator
            tools={[
              { icon: Layers, label: "Layers" },
              { icon: Copy, label: "Copy score" },
              { icon: Printer, label: "Print" },
              { icon: Save, label: "Save" },
              { icon: ArrowUpRight, label: "Export" },
            ]}
          />
          {/* EDIT: undo-2, redo-2, scissors, copy, clipboard, trash-2 */}
          <PaletteToolGroup
            label="EDIT"
            separator
            tools={[
              { icon: Undo2, label: "Undo", shortcut: "⌘Z" },
              { icon: Redo2, label: "Redo", shortcut: "⇧⌘Z" },
              { icon: Scissors, label: "Cut" },
              { icon: Copy, label: "Copy" },
              { icon: Clipboard, label: "Paste" },
              { icon: Trash2, label: "Delete" },
            ]}
          />
          {/* DURATION: SMuFL note glyphs extracted directly from Pen */}
          <PaletteToolGroup
            label="DURATION"
            separator={false}
            tools={[
              { icon: SmuflWhole, label: "Whole note" },
              { icon: SmuflHalf, label: "Half note" },
              { icon: SmuflQuarter, label: "Quarter note" },
              { icon: SmuflEighth, label: "Eighth note" },
              { icon: SmuflDot, label: "16th note" },
              { icon: SmuflDot, label: "32nd note" },
              { icon: SmuflDot, label: "Dotted" },
              { icon: SmuflSlur, label: "Tie" },
              { icon: SmuflSlur, label: "Tuplet" },
            ]}
          />
        </div>

        {/* ── Row 2: PITCH / TEXT / MEASURE ── Node SAx8D ─── */}
        <div className={ROW}>
          {/* PITCH: SMuFL accidentals */}
          <PaletteToolGroup
            label="PITCH"
            separator
            tools={[
              { icon: SmuflSharp, label: "Pitch up semitone" },
              { icon: SmuflFlat, label: "Pitch down semitone" },
              { icon: SmuflSharp, label: "Pitch up octave" },
              { icon: SmuflFlat, label: "Pitch down octave" },
              { icon: SmuflSharp, label: "Accidental" },
            ]}
          />
          {/* TEXT: italic (Italic), message-square, music */}
          <PaletteToolGroup
            label="TEXT"
            separator
            tools={[
              { icon: Type, label: "Add text" },
              { icon: Italic, label: "Tempo marking" },
              { icon: MessageSquare, label: "Rehearsal mark" },
              { icon: Music, label: "Music text" },
            ]}
          />
          {/* MEASURE: between-horizontal-start, -end, trash-2, key + SMuFL paths */}
          <PaletteToolGroup
            label="MEASURE"
            separator={false}
            tools={[
              { icon: BetweenHorizonalStart, label: "Insert before" },
              { icon: BetweenHorizonalEnd, label: "Insert after" },
              { icon: Trash2, label: "Delete measure" },
              { icon: Key, label: "Key signature" },
              { icon: SmuflTreble, label: "Time signature" },
              { icon: SmuflBarline, label: "Barline" },
              { icon: SmuflBarline, label: "Repeat" },
              { icon: SmuflBarline, label: "Final barline" },
            ]}
          />
        </div>

        {/* ── Row 3: DYNAMICS / ARTICULATION ── Node EVe2r ── */}
        <div className={cn(ROW, "border-b-0")}>
          {/* DYNAMICS */}
          <PaletteToolGroup
            label="DYNAMICS"
            separator
            tools={[
              { icon: Italic, label: "Piano (p)" },
              { icon: SmuflCresc, label: "Crescendo" },
              { icon: SmuflDecresc, label: "Decrescendo" },
            ]}
          />
          {/* ARTICULATION: SMuFL path glyphs */}
          <PaletteToolGroup
            label="ARTICULATION"
            separator={false}
            tools={[
              { icon: SmuflStaccato, label: "Staccato" },
              { icon: SmuflTenuto, label: "Tenuto" },
              { icon: SmuflAccent, label: "Accent" },
              { icon: SmuflMarcato, label: "Marcato" },
              { icon: SmuflFermata, label: "Fermata" },
              { icon: SmuflSlur, label: "Trill" },
            ]}
          />
        </div>
      </div>
    );
  },
);

ScorePalette.displayName = "ScorePalette";
