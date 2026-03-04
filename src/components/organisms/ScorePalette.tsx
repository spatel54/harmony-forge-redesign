"use client";

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
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterOptions?: string[];
}

const TOOLS = [
  {
    category: "SCORE",
    items: [
      { icon: <Layers />, name: "Layers" },
      { icon: <Copy />, name: "Copy score" },
      { icon: <Printer />, name: "Print" },
      { icon: <Save />, name: "Save" },
      { icon: <ArrowUpRight />, name: "Export" },
    ],
  },
  {
    category: "EDIT",
    items: [
      { icon: <Undo2 />, name: "Undo", shortcut: "⌘Z" },
      { icon: <Redo2 />, name: "Redo", shortcut: "⇧⌘Z" },
      { icon: <Scissors />, name: "Cut" },
      { icon: <Copy />, name: "Copy" },
      { icon: <Clipboard />, name: "Paste" },
      { icon: <Trash2 />, name: "Delete" },
    ],
  },
  {
    category: "DURATION",
    items: [
      { icon: <SmuflWhole />, name: "Whole note" },
      { icon: <SmuflHalf />, name: "Half note" },
      { icon: <SmuflQuarter />, name: "Quarter note" },
      { icon: <SmuflEighth />, name: "Eighth note" },
      { icon: <SmuflDot />, name: "16th note" },
      { icon: <SmuflDot />, name: "32nd note" },
      { icon: <SmuflDot />, name: "Dotted" },
      { icon: <SmuflSlur />, name: "Tie" },
      { icon: <SmuflSlur />, name: "Tuplet" },
    ],
  },
  {
    category: "PITCH",
    items: [
      { icon: <SmuflSharp />, name: "Pitch up semitone" },
      { icon: <SmuflFlat />, name: "Pitch down semitone" },
      { icon: <SmuflSharp />, name: "Pitch up octave" },
      { icon: <SmuflFlat />, name: "Pitch down octave" },
      { icon: <SmuflSharp />, name: "Accidental" },
    ],
  },
  {
    category: "TEXT",
    items: [
      { icon: <Type />, name: "Add text" },
      { icon: <Italic />, name: "Tempo marking" },
      { icon: <MessageSquare />, name: "Rehearsal mark" },
      { icon: <Music />, name: "Music text" },
    ],
  },
  {
    category: "MEASURE",
    items: [
      { icon: <BetweenHorizonalStart />, name: "Insert before" },
      { icon: <BetweenHorizonalEnd />, name: "Insert after" },
      { icon: <Trash2 />, name: "Delete measure" },
      { icon: <Key />, name: "Key signature" },
      { icon: <SmuflTreble />, name: "Time signature" },
      { icon: <SmuflBarline />, name: "Barline" },
      { icon: <SmuflBarline />, name: "Repeat" },
      { icon: <SmuflBarline />, name: "Final barline" },
    ],
  },
  {
    category: "DYNAMICS",
    items: [
      { icon: <Italic />, name: "Piano (p)" },
      { icon: <SmuflCresc />, name: "Crescendo" },
      { icon: <SmuflDecresc />, name: "Decrescendo" },
    ],
  },
  {
    category: "ARTICULATION",
    items: [
      { icon: <SmuflStaccato />, name: "Staccato" },
      { icon: <SmuflTenuto />, name: "Tenuto" },
      { icon: <SmuflAccent />, name: "Accent" },
      { icon: <SmuflMarcato />, name: "Marcato" },
      { icon: <SmuflFermata />, name: "Fermata" },
      { icon: <SmuflSlur />, name: "Trill" },
    ],
  },
];

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
  (
    {
      onSearchChange,
      searchValue = "",
      activeFilter = "All Tools",
      onFilterChange,
      filterOptions = ["All Tools"],
      className,
      ...props
    },
    ref,
  ) => {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const filterRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          filterRef.current &&
          !filterRef.current.contains(e.target as Node)
        ) {
          setFilterOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);
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
          {/* Search container with dropdown suggestions */}
          <div className="relative flex-1">
            <div
              className="flex items-center gap-[8px] w-full h-[30px] rounded-[6px] px-[10px]"
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

            {/* Render suggestions dropdown if there is a search value */}
            {searchValue.trim().length > 0 && (
              <div
                className="absolute top-[36px] left-0 w-full max-h-[300px] overflow-y-auto rounded-[6px] shadow-sm z-50 py-[4px]"
                style={{
                  backgroundColor: "var(--hf-canvas-bg)",
                  border: "1px solid var(--hf-detail)",
                }}
              >
                {TOOLS.flatMap((group) => group.items)
                  .filter((item: any) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase()),
                  )
                  .map((item: any, index: number) => (
                    <button
                      key={`${item.name}-${index}`}
                      className="w-full flex items-center gap-[12px] px-[12px] py-[8px] text-left hover:bg-[var(--hf-surface)]/5 transition-colors"
                      onClick={() => {
                        // Normally this would trigger the tool. For now, clear search to "select"
                        onSearchChange?.("");
                      }}
                    >
                      <div
                        className="w-[20px] h-[20px] shrink-0 flex items-center justify-center opacity-70"
                        style={{ color: "var(--hf-text-primary)" }}
                      >
                        {item.icon}
                      </div>
                      <span
                        className="font-body text-[13px] font-medium truncate"
                        style={{ color: "var(--hf-text-primary)" }}
                      >
                        {item.name}
                      </span>
                    </button>
                  ))}
                {TOOLS.flatMap((g: any) => g.items).filter((i: any) =>
                  i.name.toLowerCase().includes(searchValue.toLowerCase()),
                ).length === 0 && (
                  <div
                    className="px-[12px] py-[8px] font-body text-[13px]"
                    style={{ color: "var(--hf-text-secondary)" }}
                  >
                    No tools found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dropdown trigger — functional */}
          <div ref={filterRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-[6px] h-[30px] px-[10px] rounded-[6px] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hf-accent)"
              style={{
                backgroundColor: "var(--hf-canvas-bg)",
                border: "1px solid var(--hf-detail)",
              }}
              aria-label="Filter tool groups"
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
            >
              <span
                className="font-body text-[12px] font-normal"
                style={{ color: "var(--hf-text-primary)" }}
              >
                {activeFilter}
              </span>
              <ChevronDown
                className={`w-[14px] h-[14px] transition-transform duration-150 ${filterOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
                style={{ color: "var(--hf-surface)" }}
                aria-hidden="true"
              />
            </button>

            {/* Filter dropdown list */}
            {filterOpen && (
              <div
                role="listbox"
                aria-label="Filter tools"
                className="absolute right-0 top-[36px] z-50 min-w-[140px] rounded-[6px] border border-[var(--hf-detail)] shadow-md overflow-hidden"
                style={{ backgroundColor: "var(--hf-bg)" }}
              >
                {filterOptions.map((opt) => (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={opt === activeFilter}
                    onClick={() => {
                      onFilterChange?.(opt);
                      setFilterOpen(false);
                    }}
                    className="flex items-center gap-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-[var(--hf-surface)]/5 transition-colors"
                  >
                    <span
                      className={`w-[6px] h-[6px] rounded-full shrink-0 ${opt === activeFilter ? "opacity-100" : "opacity-0"}`}
                      style={{ backgroundColor: "var(--hf-accent)" }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--hf-text-primary)" }}
                    >
                      {opt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filtered Tools Rendering ── Rows of 3 categories each ── */}
        {(() => {
          // 1. Filter by dropdown
          let activeCategories =
            activeFilter === "All Tools"
              ? TOOLS
              : TOOLS.filter((group) => group.category === activeFilter);

          // 2. Filter by search text
          if (searchValue.trim()) {
            activeCategories = activeCategories
              .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase()),
                ),
              }))
              .filter((group) => group.items.length > 0);
          }

          // Render nothing below if there are no matches
          if (activeCategories.length === 0) return null;

          // Chunk categories by 3 per row as specified by design
          const rowSize = 3;
          const rows = [];
          for (let i = 0; i < activeCategories.length; i += rowSize) {
            rows.push(activeCategories.slice(i, i + rowSize));
          }

          return rows.map((row, rIdx) => (
            <div
              key={`row-${rIdx}`}
              className={cn(ROW, rIdx === rows.length - 1 && "border-b-0")}
            >
              {row.map((cat: any, cIdx: number) => (
                <PaletteToolGroup
                  key={cat.category}
                  label={cat.category}
                  separator={cIdx < row.length - 1} // no right separator for last item in row
                  tools={cat.items.map((item: any) => ({
                    // Map back to the expected shape of PaletteToolGroup props
                    // (PaletteToolGroup expects `icon: React.ElementType` normally, but since we created elements,
                    // we might need to adjust or rely on our mapped elements if we tweak PaletteToolGroup)
                    // For now, let's keep it compatible by assuming it takes the type.
                    // To keep it simple, we pass the element itself.
                    icon: () => item.icon,
                    label: item.name,
                    shortcut: item.shortcut,
                  }))}
                />
              ))}
            </div>
          ));
        })()}
      </div>
    );
  },
);

ScorePalette.displayName = "ScorePalette";
