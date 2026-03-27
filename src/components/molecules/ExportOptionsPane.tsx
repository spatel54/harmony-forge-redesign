import React, { useState } from "react";
import {
  FileText,
  Music2,
  Code,
  Image as ImageIcon,
  Braces,
  Headphones,
  FolderArchive,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportFormatCard } from "../atoms/ExportFormatCard";

export interface ExportOptionsPaneProps {
  onClose?: () => void;
  onExport?: (formats: string[]) => void;
  className?: string;
}

export function ExportOptionsPane({
  onClose,
  onExport,
  className,
}: ExportOptionsPaneProps) {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set(["pdf"]));

  const formats = [
    { id: "pdf", icon: FileText, label: "PDF", desc: "Print-ready" },
    { id: "midi", icon: Music2, label: "MIDI", desc: "DAW-compatible" },
    { id: "xml", icon: Code, label: "MusicXML", desc: "Universal score" },
    { id: "png", icon: ImageIcon, label: "PNG", desc: "High-res image" },
    { id: "json", icon: Braces, label: "JSON", desc: "Symbolic data" },
    { id: "mp3", icon: Headphones, label: "Audio", desc: "WAV / MP3" },
    { id: "zip", icon: FolderArchive, label: "ZIP", desc: "All files" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col flex-1 h-[700px] min-w-[500px]",
        "bg-[var(--hf-panel-bg)] rounded-r-[8px]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[60px] px-[32px] border-b border-[var(--hf-detail)] shrink-0">
        <div className="flex flex-col gap-[6px]">
          <h2 className="font-serif text-[22px] text-[var(--hf-text-primary)] leading-none">
            Export As
          </h2>
          <span className="font-sans text-[12px] text-[var(--hf-text-secondary)] leading-none">
            Select one or more formats
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-[6px] border border-[var(--hf-detail)] hover:bg-[rgba(var(--hf-surface-rgb),0.05)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hf-surface)]"
        >
          <X className="w-[14px] h-[14px] text-[var(--hf-text-primary)] opacity-70" />
        </button>
      </div>

      {/* Body - Format Grid */}
      {/* FEATURE: COACHMARKS — step-10 target */}
      <div data-coachmark="step-10" className="flex-1 overflow-y-auto px-[32px] py-[24px] flex flex-col gap-[20px]">
        <span className="font-mono text-[10px] font-medium text-[var(--hf-text-secondary)] uppercase tracking-wider">
          Format
        </span>

        <div className="grid grid-cols-3 gap-[12px]">
          {formats.slice(0, 3).map((f) => (
            <ExportFormatCard
              key={f.id}
              icon={f.icon}
              label={f.label}
              description={f.desc}
              selected={selectedFormats.has(f.id)}
              onClick={() =>
                setSelectedFormats((prev) => {
                  const next = new Set(prev);
                  next.has(f.id) ? next.delete(f.id) : next.add(f.id);
                  return next;
                })
              }
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-[12px]">
          {formats.slice(3).map((f) => (
            <ExportFormatCard
              key={f.id}
              icon={f.icon}
              label={f.label}
              description={f.desc}
              selected={selectedFormats.has(f.id)}
              onClick={() =>
                setSelectedFormats((prev) => {
                  const next = new Set(prev);
                  next.has(f.id) ? next.delete(f.id) : next.add(f.id);
                  return next;
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end h-[72px] px-[32px] border-t border-[var(--hf-detail)] shrink-0">
        {/* FEATURE: COACHMARKS — step-11 target */}
        <button
          data-coachmark="step-11"
          onClick={() => onExport?.(Array.from(selectedFormats))}
          disabled={selectedFormats.size === 0}
          aria-disabled={selectedFormats.size === 0}
          className="flex items-center gap-[8px] h-[40px] px-[24px] rounded-[6px] bg-[var(--hf-surface)] text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hf-panel-bg)] disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="font-mono text-[12px] font-medium mt-0.5">
            {selectedFormats.size === 0
              ? "Export"
              : selectedFormats.size === 1
                ? `Export ${formats.find((f) => selectedFormats.has(f.id))?.label.toUpperCase()}`
                : `Export ${selectedFormats.size} Formats`}
          </span>
        </button>
      </div>
    </div>
  );
}
