import React from 'react';
import { LucideIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExportFormatCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ExportFormatCard({
  icon: Icon,
  label,
  description,
  selected = false,
  onClick,
  className,
}: ExportFormatCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center justify-center gap-[8px] h-[88px] w-full rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hf-surface)]",
        selected
          ? "bg-[var(--hf-surface)] border-2 border-[var(--hf-surface)]"
          : "bg-[var(--hf-panel-bg)] border border-[var(--hf-detail)] hover:bg-[rgba(var(--hf-surface-rgb),0.05)]",
        className
      )}
    >
      {selected && (
        <span className="absolute top-[6px] right-[6px] flex items-center justify-center w-[14px] h-[14px] rounded-full bg-white/20">
          <Check className="w-[9px] h-[9px] text-white" aria-hidden="true" />
        </span>
      )}
      <Icon
        className={cn(
          "w-[22px] h-[22px]",
          selected ? "text-white" : "text-[var(--hf-text-primary)] opacity-70"
        )}
      />
      <span
        className={cn(
          "font-mono text-[12px] font-medium leading-none",
          selected ? "text-white" : "text-[var(--hf-text-primary)]"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-sans text-[10px] leading-none",
          selected ? "text-white opacity-75" : "text-[var(--hf-text-secondary)]"
        )}
      >
        {description}
      </span>
    </button>
  );
}
