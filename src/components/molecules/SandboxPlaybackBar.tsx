"use client";

import React from "react";
import {
  SkipBack,
  Rewind,
  Play,
  Pause,
  FastForward,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSandboxStore } from "@/store/useSandboxStore";
import { usePlayback } from "@/lib/audio/usePlayback";

export interface SandboxPlaybackBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  onRewind?: () => void;
  onFastForward?: () => void;
  onSkipForward?: () => void;
}

/**
 * SandboxPlaybackBar Molecule
 * Pencil Node: PMS9U ("PlaybackBar") inside MainArea of dcf2A.
 *
 * Spec:
 *   h:60  gap:16  pad:[0,32]  jc:space_between  ai:center  fill:$sonata-bg
 *   stroke top:1 $sonata-detail
 *
 *   Metadata:  layout:vertical gap:4 jc:center
 *     Title:    IBM Plex Mono fs:14 fw:600  fill:$text-on-light
 *     Subtitle: Inter fs:12               fill:$sonata-detail
 *
 *   TransportCtrls: gap:16 ai:center
 *     PlayBtn: 40×36 r:20 (pill)  fill:$text-on-light
 *     PlayIco: 18×18              fill:$sonata-bg
 *
 *   Pagination: gap:12 ai:center
 *     Prev/NextBtn: 28×28 r:16 (circle) fill:none
 *     PageCounter:  IBM Plex Mono fs:13 fw:500 fill:$text-on-light
 */
export const SandboxPlaybackBar = React.forwardRef<
  HTMLDivElement,
  SandboxPlaybackBarProps
>(
  (
    {
      title = "Sonata in C Major",
      subtitle = "W.A. Mozart • K. 545",
      onRewind,
      onFastForward,
      onSkipForward,
      className,
      ...props
    },
    ref,
  ) => {
    // Read playback state from store; drive transport via hook
    const isPlaying = useSandboxStore((s) => s.isPlaying);
    const { play, pause, stop } = usePlayback();

    const handlePlayPause = React.useCallback(() => {
      if (isPlaying) {
        pause();
      } else {
        // play() is async — fire-and-forget; errors surface in console only
        play().catch((err: unknown) => {
          console.error("[SandboxPlaybackBar] play() failed:", err);
        });
      }
    }, [isPlaying, play, pause]);

    const iconBtn =
      "flex items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hf-accent)";

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full h-[60px] px-[32px] gap-[16px] shrink-0",
          className,
        )}
        style={{
          backgroundColor: "var(--hf-bg)",
          borderTop: "1px solid var(--hf-detail)",
        }}
        role="toolbar"
        aria-label="Playback controls"
        {...props}
      >
        {/* ── Left: Piece Metadata ── Node al845 ──────────── */}
        <div className="flex flex-col gap-[4px] justify-center min-w-0">
          <span
            className="font-mono text-[14px] font-semibold leading-tight truncate"
            style={{ color: "var(--hf-text-primary)" }}
          >
            {title}
          </span>
          <span
            className="font-body text-[12px] font-normal leading-tight truncate"
            style={{ color: "var(--hf-text-secondary)" }}
          >
            {subtitle}
          </span>
        </div>

        {/* ── Center: Transport Controls ── Node 7emlR ─────── */}
        <div
          className="flex items-center gap-[16px]"
          role="group"
          aria-label="Transport"
        >
          {/* skip-back / stop — 16×16 */}
          <button
            type="button"
            onClick={stop}
            aria-label="Stop and return to beginning"
            className={cn(iconBtn, "w-[32px] h-[32px] rounded-[4px]")}
            style={{ color: "var(--hf-text-primary)" }}
          >
            <SkipBack
              className="w-[16px] h-[16px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>

          {/* rewind — 15×15 */}
          <button
            type="button"
            onClick={onRewind}
            aria-label="Rewind"
            className={cn(iconBtn, "w-[32px] h-[32px] rounded-[4px]")}
            style={{ color: "var(--hf-text-primary)" }}
          >
            <Rewind
              className="w-[15px] h-[15px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>

          {/* Play / Pause — 40×36 r:20 (pill) */}
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause arrangement" : "Play arrangement"}
            aria-pressed={isPlaying}
            className={cn(iconBtn, "w-[40px] h-[36px] rounded-[20px]")}
            style={{
              backgroundColor: "var(--hf-text-primary)",
              color: "var(--hf-bg)",
            }}
          >
            {isPlaying ? (
              <Pause
                className="w-[18px] h-[18px]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ) : (
              <Play
                className="w-[18px] h-[18px]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
          </button>

          {/* fast-forward — 15×15 */}
          <button
            type="button"
            onClick={onFastForward}
            aria-label="Fast forward"
            className={cn(iconBtn, "w-[32px] h-[32px] rounded-[4px]")}
            style={{ color: "var(--hf-text-primary)" }}
          >
            <FastForward
              className="w-[15px] h-[15px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>

          {/* skip-forward — 16×16 */}
          <button
            type="button"
            onClick={onSkipForward}
            aria-label="Skip to end"
            className={cn(iconBtn, "w-[32px] h-[32px] rounded-[4px]")}
            style={{ color: "var(--hf-text-primary)" }}
          >
            <SkipForward
              className="w-[16px] h-[16px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </div>

      </div>
    );
  },
);

SandboxPlaybackBar.displayName = "SandboxPlaybackBar";
