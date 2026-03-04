"use client";

import React from "react";
import { SandboxHeader } from "@/components/organisms/SandboxHeader";
import { ScorePalette } from "@/components/organisms/ScorePalette";
import { ScoreCanvas } from "@/components/organisms/ScoreCanvas";
import { SandboxPlaybackBar } from "@/components/molecules/SandboxPlaybackBar";
import { TheoryInspectorPanel } from "@/components/organisms/TheoryInspectorPanel";
import { ExportModal } from "@/components/organisms/ExportModal";
import { ChatFAB } from "@/components/atoms/ChatFAB";

/**
 * TactileSandboxPage
 * Pencil Nodes: dcf2A (with inspector) / AcJnt / FlAan (full-width, inspector closed).
 *
 * Layout — Inspector open (default):
 *   ┌──────────────────────────────┬──────────────────┐
 *   │  ScorePalette  (fills)        │                  │
 *   ├──────────────────────────────┤  TheoryInspector │
 *   │  ScoreCanvas   (fills)        │  Panel (380px)   │
 *   ├──────────────────────────────┤                  │
 *   │  SandboxPlaybackBar (60px)    │                  │
 *   └──────────────────────────────┴──────────────────┘
 *
 * Layout — Inspector closed (Node AcJnt / FlAan):
 *   ScoreCanvas fills full width; ChatFAB floats bottom-right to reopen.
 */
export default function TactileSandboxPage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [chatInput, setChatInput] = React.useState("");
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = React.useState(true);

  const totalPages = 4;

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}...`);
    setIsExportModalOpen(false);
  };

  return (
    <div
      className="flex flex-col w-full h-screen overflow-hidden"
      style={{ backgroundColor: "var(--hf-bg)" }}
    >
      {/* ── Zone 1: Header ───────────────────────────────────────── */}
      <SandboxHeader onExportClick={() => setIsExportModalOpen(true)} />

      {/* ── Below header: body ───────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Left column: score area ──────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Palette — always full-width of left column */}
          <ScorePalette className="h-[192px] shrink-0" />

          {/* Canvas — relative so ChatFAB can be absolutely positioned */}
          <div className="relative flex-1 min-h-0">
            <ScoreCanvas className="w-full h-full" />

            {/* ChatFAB — shown only when inspector is closed (Node t4vY4) */}
            {!isInspectorOpen && (
              <div className="absolute bottom-[28px] right-[28px]">
                <ChatFAB onClick={() => setIsInspectorOpen(true)} />
              </div>
            )}
          </div>

          {/* Playback bar */}
          <SandboxPlaybackBar
            className="shrink-0"
            title="Sonata in C Major"
            subtitle="W.A. Mozart • K. 545"
            isPlaying={isPlaying}
            currentPage={currentPage}
            totalPages={totalPages}
            onPlayPause={() => setIsPlaying((p) => !p)}
            onSkipBack={() => setCurrentPage(1)}
            onSkipForward={() => setCurrentPage(totalPages)}
            onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNextPage={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
          />
        </div>

        {/* ── Right column: Theory Inspector (380px) — hidden when closed ── */}
        {isInspectorOpen && (
          <div className="w-[380px] shrink-0 h-full overflow-hidden">
            <TheoryInspectorPanel
              className="h-full"
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSend={() => setChatInput("")}
              onClose={() => setIsInspectorOpen(false)}
            />
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
