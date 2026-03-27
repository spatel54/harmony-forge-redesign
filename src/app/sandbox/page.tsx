"use client";

import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { SandboxHeader } from "@/components/organisms/SandboxHeader";
import { ScorePalette } from "@/components/organisms/ScorePalette";
import { ScoreCanvas } from "@/components/organisms/ScoreCanvas";
import { SandboxPlaybackBar } from "@/components/molecules/SandboxPlaybackBar";
import {
  TheoryInspectorPanel,
  type TheoryInspectorMessage,
} from "@/components/organisms/TheoryInspectorPanel";
import { ExportModal } from "@/components/organisms/ExportModal";
import { ChatFAB } from "@/components/atoms/ChatFAB";
import { ScorePaginationDock } from "@/components/molecules/ScorePaginationDock";
import { useSandboxStore } from "@/store/useSandboxStore";

const TOOL_GROUPS = [
  "SCORE",
  "EDIT",
  "DURATION",
  "PITCH",
  "TEXT",
  "MEASURE",
  "DYNAMICS",
  "ARTICULATION",
];

/** Simulated AI replies for the Theory Inspector chat */
const AI_REPLIES = [
  "According to Schenkerian analysis, this progression represents a middleground structural motion from I to V.",
  "The parallel fifths between Soprano and Alto at beat 3 violate strict voice-leading (Schenker, Free Composition §100).",
  "This cadential Ⅰ⁶₄ → V pattern is a standard suspension figure found throughout Classical-era counterpoint.",
  "The bass line descends by step through a filled-in third — a common *Bassbrechung* pattern.",
];

/** Initial mock data matching Pencil Node qmx1U ChatArea */
const INITIAL_MESSAGES: TheoryInspectorMessage[] = [
  {
    id: "init-sys",
    type: "system",
    content: "SATB Voice Leading Violations",
  },
  {
    id: "init-v1",
    type: "violation",
    violationType: "Parallel 5ths",
    content: "Parallel 5ths between Tenor and Bass detected in m. 2",
    timestamp: "09:42 AM",
  },
  {
    id: "init-u1",
    type: "user",
    content: "Can you fix the parallel 5ths?",
    timestamp: "09:43 AM",
  },
  {
    id: "init-ai1",
    type: "ai",
    content:
      "I recommend resolving the Bass down to C instead of moving parallel with the Tenor. Would you like me to apply this fix automatically?",
    timestamp: "09:43 AM",
  },
  {
    id: "init-chips1",
    type: "chips",
    chips: ["Apply Fix", "Show Alternate Options", "Ignore"],
  },
];

/**
 * TactileSandboxPage
 * Pencil Nodes: dcf2A (with inspector) / AcJnt / FlAan (full-width, inspector closed).
 *
 * New in this revision:
 *  - ScorePalette search + All Tools filter wired with local state
 *  - Zoom in/out controls (level 50–200%)
 *  - Theory Inspector panel is resizable by dragging left edge
 *  - Chat has functional send + simulated AI reply
 *  - Inspector close/open with ChatFAB
 */
export default function TactileSandboxPage() {
  // Playback state lives in useSandboxStore (TASK-A22/A23)
  // isPlaying is read inside SandboxPlaybackBar directly
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 4;

  // Score maximize (AC-006)
  const isExpanded = useSandboxStore((s) => s.isExpanded);
  const setExpanded = useSandboxStore((s) => s.setExpanded);

  // Escape key collapses expanded score
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      setExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setExpanded]);

  // Export modal — FEATURE: COACHMARKS: migrated to store so the tour can trigger it; restore local state when removing tour
  const isExportModalOpen = useSandboxStore((s) => s.isExportModalOpen);
  const setIsExportModalOpen = useSandboxStore((s) => s.setExportModalOpen);

  // Theory inspector — FEATURE: COACHMARKS: migrated to store so tour step 7 can open it; restore local state when removing tour
  const isInspectorOpen = useSandboxStore((s) => s.isInspectorOpen);
  const setIsInspectorOpen = useSandboxStore((s) => s.setInspectorOpen);

  // Inspector resizable width
  const [inspectorWidth, setInspectorWidth] = React.useState(380);
  const isResizing = React.useRef(false);
  const startX = React.useRef(0);
  const startWidth = React.useRef(380);

  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent) => {
      isResizing.current = true;
      startX.current = e.clientX;
      startWidth.current = inspectorWidth;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    },
    [inspectorWidth],
  );

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = startX.current - e.clientX; // dragging left → wider
      const newW = Math.max(280, Math.min(600, startWidth.current + delta));
      setInspectorWidth(newW);
    };
    const onMouseUp = () => {
      isResizing.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Search + filter
  const [searchValue, setSearchValue] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("All Tools");

  // Zoom
  const [zoom, setZoom] = React.useState(100);
  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 25));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 25));

  // Chat state (edit 4)
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState<TheoryInspectorMessage[]>([]);

  // Populate mock data when the inspector is opened
  React.useEffect(() => {
    if (isInspectorOpen && messages.length === 0) {
      setMessages(INITIAL_MESSAGES);
    }
  }, [isInspectorOpen, messages.length]);

  const handleSend = React.useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = {
      id: `u-${Date.now()}`,
      type: "user" as const,
      content: text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    // Simulate AI reply after 800ms
    setTimeout(() => {
      const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          type: "ai" as const,
          content: reply,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 800);
  }, [chatInput]);

  const handleExport = (formats: string[]) => {
    console.log(`Exporting as ${formats.join(", ")}...`);
    setIsExportModalOpen(false);
  };

  return (
    <div
      className="flex flex-col w-full h-screen overflow-hidden"
      style={{ backgroundColor: "var(--hf-bg)" }}
    >
      {/* Zone 1: Header */}
      <SandboxHeader onExportClick={() => setIsExportModalOpen(true)} />

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* ScorePalette — hidden in expanded mode */}
          {!isExpanded && (
            <ScorePalette
              data-coachmark="step-5"
              className="h-[192px] shrink-0"
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filterOptions={["All Tools", ...TOOL_GROUPS]}
            />
          )}

          {/* Canvas wrapper — relative for FAB + zoom controls */}
          <div data-coachmark="step-6" className="relative flex-1 min-h-0">
            <ScoreCanvas
              className="w-full h-full"
              showViolations={isInspectorOpen}
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
                width: `${10000 / zoom}%`,
                height: `${10000 / zoom}%`,
              }}
            />

            {/* Zoom controls — bottom-left of canvas */}
            <div
              className="absolute bottom-[28px] left-[24px] flex items-center gap-[4px] rounded-[6px] px-[8px] py-[6px]"
              style={{
                backgroundColor: "var(--hf-bg)",
                border: "1px solid var(--hf-detail)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--hf-accent)"
                aria-label="Zoom out"
              >
                <ZoomOut
                  className="w-[14px] h-[14px]"
                  style={{ color: "var(--hf-text-primary)" }}
                  strokeWidth={1.75}
                />
              </button>

              <span
                className="font-mono text-[11px] font-medium tabular-nums w-[34px] text-center select-none"
                style={{ color: "var(--hf-text-primary)" }}
              >
                {zoom}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--hf-accent)"
                aria-label="Zoom in"
              >
                <ZoomIn
                  className="w-[14px] h-[14px]"
                  style={{ color: "var(--hf-text-primary)" }}
                  strokeWidth={1.75}
                />
              </button>
            </div>

            {/* ScorePaginationDock — bottom-center of canvas */}
            <ScorePaginationDock
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />

            {/* ChatFAB — shown only when inspector is closed */}
            {!isInspectorOpen && (
              <div data-coachmark="step-8" className="absolute bottom-[28px] right-[28px]">
                <ChatFAB onClick={() => setIsInspectorOpen(true)} />
              </div>
            )}
          </div>

          {/* Playback bar — hidden in expanded mode */}
          {/* FEATURE: COACHMARKS — step-7 target */}
          {!isExpanded && (
            <SandboxPlaybackBar
              data-coachmark="step-7"
              className="shrink-0"
              title="Sonata in C Major"
              subtitle="W.A. Mozart • K. 545"
            />
          )}
        </div>

        {/* Right column: Theory Inspector — hidden in expanded mode */}
        {isInspectorOpen && !isExpanded && (
          <div
            data-coachmark="step-9"
            className="relative shrink-0 h-full overflow-hidden flex"
            style={{ width: inspectorWidth }}
          >
            {/* Drag handle — left edge */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[5px] cursor-col-resize z-10 group"
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            >
              {/* Visual indicator on hover */}
              <div
                className="absolute left-[2px] top-[50%] -translate-y-[50%] w-[1px] h-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "var(--hf-accent)" }}
              />
            </div>

            <TheoryInspectorPanel
              className="h-full flex-1"
              messages={messages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSend={handleSend}
              onClose={() => setIsInspectorOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
