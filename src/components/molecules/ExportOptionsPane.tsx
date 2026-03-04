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
  onExport?: (format: string) => void;
  className?: string;
}

export function ExportOptionsPane({
  onClose,
  onExport,
  className,
}: ExportOptionsPaneProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");

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
        <div className="flex flex-col gap-[2px]">
          <h2 className="font-serif text-[22px] text-[var(--hf-text-primary)] leading-none">
            Export As
          </h2>
          <span className="font-sans text-[12px] text-[var(--hf-text-primary)] opacity-45 leading-none">
            Choose a format below
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
      <div className="flex-1 overflow-y-auto px-[32px] py-[24px] flex flex-col gap-[20px]">
        <span className="font-mono text-[9px] font-medium text-[var(--hf-text-primary)] opacity-40 uppercase tracking-wider">
          Format
        </span>

        <div className="grid grid-cols-3 gap-[12px]">
          {formats.slice(0, 3).map((f) => (
            <ExportFormatCard
              key={f.id}
              icon={f.icon}
              label={f.label}
              description={f.desc}
              selected={selectedFormat === f.id}
              onClick={() => setSelectedFormat(f.id)}
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
              selected={selectedFormat === f.id}
              onClick={() => setSelectedFormat(f.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end h-[72px] px-[32px] border-t border-[var(--hf-detail)] shrink-0">
        <button
          onClick={() => onExport?.(selectedFormat)}
          className="flex items-center gap-[8px] h-[40px] px-[24px] rounded-[6px] bg-[var(--hf-surface)] text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hf-panel-bg)]"
        >
          <span className="font-mono text-[12px] font-medium mt-0.5">
            Export{" "}
            {formats.find((f) => f.id === selectedFormat)?.label.toUpperCase()}
          </span>
        </button>
      </div>
    </div>
  );
}
