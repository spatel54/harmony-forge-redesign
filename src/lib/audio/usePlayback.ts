"use client";

import React from "react";
import { useSandboxStore } from "@/store/useSandboxStore";

/**
 * usePlayback — Tone.js Transport lifecycle hook.
 *
 * Manages symbolic playback scheduling via Tone.js Transport.
 * All playback state (isPlaying, playheadPosition) is written
 * exclusively to useSandboxStore — no local useState.
 *
 * Tone.js is dynamically imported (client-only, SSR-safe) following
 * the same pattern as VexFlow per ADR-009.
 *
 * Symbolic scheduling only: Transport.scheduleRepeat advances a quarter-
 * note position counter. No AudioContext, no AudioBuffer, no samples.
 *
 * Architecture boundary:
 *   play()  → Tone.Transport.start();  setPlaying(true)
 *   pause() → Tone.Transport.pause();  setPlaying(false)
 *   stop()  → Tone.Transport.stop();   setPlaying(false); setPlayhead(0)
 *
 * Cleanup: Transport.stop() + Transport.cancel() run on unmount to prevent
 * orphaned Tone.js contexts across hot-reload cycles.
 */

// Quarter-note interval expressed in Tone.js time notation
const QUARTER_NOTE = "4n";

export interface PlaybackControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
}

export function usePlayback(): PlaybackControls {
  const setPlaying = useSandboxStore((s) => s.setPlaying);
  const setPlayhead = useSandboxStore((s) => s.setPlayhead);

  // Stable refs so callbacks in scheduleRepeat always close over the
  // latest store actions without re-registering the repeat event.
  const setPlayingRef = React.useRef(setPlaying);
  const setPlayheadRef = React.useRef(setPlayhead);
  React.useEffect(() => {
    setPlayingRef.current = setPlaying;
    setPlayheadRef.current = setPlayhead;
  }, [setPlaying, setPlayhead]);

  // Quarter-note counter — incremented by scheduleRepeat on each beat
  const quarterCountRef = React.useRef(0);

  // Ref to the cancel token returned by Transport.scheduleRepeat
  const repeatIdRef = React.useRef<number | null>(null);

  // Whether Tone.js has been imported and started at least once
  const toneReadyRef = React.useRef(false);

  // ── Cleanup on unmount ─────────────────────────────────────────────
  React.useEffect(() => {
    return () => {
      if (!toneReadyRef.current) return;
      import("tone").then(({ getTransport }) => {
        const transport = getTransport();
        transport.stop();
        transport.cancel();
      });
    };
  }, []);

  // ── play ───────────────────────────────────────────────────────────
  const play = React.useCallback(async (): Promise<void> => {
    const { start, getTransport } = await import("tone");

    // Resume AudioContext if suspended (browser autoplay policy requires
    // this to be called from a user gesture — the play button click satisfies this).
    await start();

    const transport = getTransport();

    // Register the quarter-note position counter only once per playback session.
    // If already registered (repeat ID exists), skip re-registration.
    if (repeatIdRef.current === null) {
      repeatIdRef.current = transport.scheduleRepeat(
        (_time: number) => {
          quarterCountRef.current += 1;
          setPlayheadRef.current(quarterCountRef.current);
        },
        QUARTER_NOTE,
        0,
      );
    }

    toneReadyRef.current = true;
    transport.start();
    setPlayingRef.current(true);
  }, []);

  // ── pause ──────────────────────────────────────────────────────────
  const pause = React.useCallback((): void => {
    if (!toneReadyRef.current) return;
    import("tone").then(({ getTransport }) => {
      getTransport().pause();
      setPlayingRef.current(false);
    });
  }, []);

  // ── stop ───────────────────────────────────────────────────────────
  const stop = React.useCallback((): void => {
    if (!toneReadyRef.current) return;
    import("tone").then(({ getTransport }) => {
      const transport = getTransport();
      transport.stop();

      // Cancel all scheduled events and clear the repeat ID so play()
      // re-registers the counter on next playback start.
      transport.cancel();
      repeatIdRef.current = null;

      // Reset the local quarter counter and store position to measure 0
      quarterCountRef.current = 0;
      setPlayingRef.current(false);
      setPlayheadRef.current(0);
    });
  }, []);

  return { play, pause, stop };
}
