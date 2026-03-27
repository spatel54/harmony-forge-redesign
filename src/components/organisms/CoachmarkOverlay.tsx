"use client";
// FEATURE: COACHMARKS — Delete this file + useCoachmarkStore.ts + all data-coachmark="*" attributes to remove the tour.

import React from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  useCoachmarkStore,
  COACHMARKS_ENABLED,
  TOTAL_STEPS,
  STEP_ROUTES,
} from "@/store/useCoachmarkStore";
import { useSandboxStore } from "@/store/useSandboxStore";

// ─── Types ───────────────────────────────────────────────────────────────────

type CaretSide = "top" | "bottom" | "left" | "right";
type CardAnchor = "inside-right" | "inside-bottom-right";

interface StepDef {
  step: number;
  route: string;
  title: string;
  body: string;
  caretSide: CaretSide;
  cardAnchor?: CardAnchor;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ─── Step definitions (matches Pencil FINAL_SCREENS) ─────────────────────────

const STEPS: StepDef[] = [
  {
    step: 1,
    route: "/",
    title: "Import a score to begin",
    body: "Drag a MusicXML, MIDI, or PDF file onto the stand, or click to browse. Every session starts here.",
    caretSide: "top",
  },
  {
    step: 2,
    route: "/document",
    title: "Track your progress",
    body: "This bar shows where you are in the workflow, from upload through ensemble setup to the editing sandbox.",
    caretSide: "top",
  },
  {
    step: 3,
    route: "/document",
    title: "Preview your score",
    body: "Your score renders here as MusicXML. Zoom, scroll, and select phrases to prepare for arrangement.",
    caretSide: "left",
  },
  {
    step: 4,
    route: "/document",
    title: "Build your ensemble",
    body: "Assign voices, select voice types, and add or remove parts. The arrangement engine reads this configuration.",
    caretSide: "right",
  },
  {
    step: 5,
    route: "/sandbox",
    title: "Your notation toolkit",
    body: "Choose note durations, articulations, and dynamics from this palette. Available tools update based on your selection.",
    caretSide: "top",
  },
  {
    step: 6,
    route: "/sandbox",
    title: "Edit notes directly",
    body: "Click any note to select it. Drag to move pitch or position. Use the palette above to apply articulations.",
    caretSide: "left",
    cardAnchor: "inside-right",
  },
  {
    step: 7,
    route: "/sandbox",
    title: "Play back your arrangement",
    body: "Use the playback bar to listen to your score. Skip forward, page through measures, and hear how your edits sound in context.",
    caretSide: "bottom",
  },
  {
    step: 8,
    route: "/sandbox",
    title: "Ask the Theory Inspector",
    body: "Click this button to open the Theory Inspector panel and get Glass Box explanations for every voice-leading decision in your arrangement.",
    caretSide: "top",
  },
  {
    step: 9,
    route: "/sandbox",
    title: "The Glass Box",
    body: "Every harmony decision is explained in this panel. Red flags mark violations with academic citations and suggested fixes.",
    caretSide: "right",
  },
  {
    step: 10,
    route: "/sandbox",
    title: "Export your score",
    body: "When you are ready, click Export to open the export dialog and choose your output format.",
    caretSide: "top",
  },
  {
    step: 11,
    route: "/sandbox",
    title: "Preview before exporting",
    body: "Review your score one last time in this preview pane before choosing an output format.",
    caretSide: "right",
  },
  {
    step: 12,
    route: "/sandbox",
    title: "Choose a format",
    body: "Select from MusicXML, MIDI, PDF, PNG, JSON, audio, or a full ZIP archive. Pick the format that fits your workflow.",
    caretSide: "right",
  },
  {
    step: 13,
    route: "/sandbox",
    title: "Download your arrangement",
    body: "Hit Export to download the file. Your arrangement is ready for notation software, a DAW, or live performance.",
    caretSide: "bottom",
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_WIDTH = 320;
const CARET_H = 8; // vertical extent of top/bottom carets
const CARET_W = 8; // horizontal extent of left/right carets
const OVERLAY_BG = "rgba(0,0,0,0.5)";
const CARD_BG = "#F5F0EF";
const CARD_BORDER = "#D2B48C";
const CARD_SHADOW = "0 8px 28px rgba(45,24,23,0.18)";
const TITLE_FONT = "var(--font-instrument,'Instrument Serif',serif)";
const BODY_FONT = "var(--font-inter,Inter,sans-serif)";
const DOT_ACTIVE = "#9E4B3E";
const DOT_INACTIVE = "#D2B48C";
const BTN_PRIMARY_BG = "#9E4B3E";
const BTN_DONE_BG = "#FFB300";

// ─── Card position computation ───────────────────────────────────────────────

function computeCardPos(
  spotlight: Rect,
  caretSide: CaretSide,
  cardAnchor: CardAnchor | undefined,
  cardHeight: number,
  vw: number,
  vh: number,
): { top: number; left: number } {
  const { top, left, width, height } = spotlight;
  const right = left + width;
  const bottom = top + height;
  const gap = 6;

  let cardTop: number;
  let cardLeft: number;

  if (cardAnchor === "inside-right") {
    // Card sits inside the spotlight, pinned to the upper-right
    cardTop = top + 24;
    cardLeft = right - CARD_WIDTH - 16;
  } else if (cardAnchor === "inside-bottom-right") {
    // Card sits inside the spotlight, lower-right, caret at bottom
    cardTop = bottom - cardHeight - CARET_H - 16;
    cardLeft = right - CARD_WIDTH - 16;
  } else {
    switch (caretSide) {
      case "top":
        // Card is BELOW the spotlight
        cardTop = bottom + CARET_H + gap;
        cardLeft = left + width / 2 - CARD_WIDTH / 2;
        break;
      case "bottom":
        // Card is ABOVE the spotlight
        cardTop = top - cardHeight - CARET_H - gap;
        cardLeft = left + width / 2 - CARD_WIDTH / 2;
        break;
      case "left":
        // Card is to the RIGHT of the spotlight
        cardTop = top + height / 2 - cardHeight / 2;
        cardLeft = right + CARET_W + gap;
        break;
      default:
        // "right": Card is to the LEFT of the spotlight
        cardTop = top + height / 2 - cardHeight / 2;
        cardLeft = left - CARD_WIDTH - CARET_W - gap;
        break;
    }
  }

  return {
    top: Math.max(8, Math.min(vh - cardHeight - 8, cardTop)),
    left: Math.max(8, Math.min(vw - CARD_WIDTH - 8, cardLeft)),
  };
}

// ─── Caret ───────────────────────────────────────────────────────────────────

function Caret({
  side,
  cardPos,
  cardHeight,
}: {
  side: CaretSide;
  cardPos: { top: number; left: number };
  cardHeight: number;
}) {
  const base: React.CSSProperties = {
    position: "fixed",
    width: 0,
    height: 0,
    zIndex: 9999,
    pointerEvents: "none",
  };

  if (side === "top") {
    const cx = cardPos.left + CARD_WIDTH / 2;
    return (
      <>
        {/* Outer stroke triangle */}
        <div
          style={{
            ...base,
            top: cardPos.top - CARET_H - 1,
            left: cx - 6,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: `${CARET_H + 1}px solid ${CARD_BORDER}`,
          }}
        />
        {/* Inner fill triangle */}
        <div
          style={{
            ...base,
            top: cardPos.top - CARET_H + 1,
            left: cx - 5,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: `${CARET_H}px solid ${CARD_BG}`,
          }}
        />
      </>
    );
  }

  if (side === "bottom") {
    const cx = cardPos.left + CARD_WIDTH / 2;
    return (
      <>
        <div
          style={{
            ...base,
            top: cardPos.top + cardHeight,
            left: cx - 6,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: `${CARET_H + 1}px solid ${CARD_BORDER}`,
          }}
        />
        <div
          style={{
            ...base,
            top: cardPos.top + cardHeight - 1,
            left: cx - 5,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `${CARET_H}px solid ${CARD_BG}`,
          }}
        />
      </>
    );
  }

  if (side === "left") {
    const cy = cardPos.top + cardHeight / 2;
    return (
      <>
        <div
          style={{
            ...base,
            top: cy - 6,
            left: cardPos.left - CARET_W - 1,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: `${CARET_W + 1}px solid ${CARD_BORDER}`,
          }}
        />
        <div
          style={{
            ...base,
            top: cy - 5,
            left: cardPos.left - CARET_W + 1,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderRight: `${CARET_W}px solid ${CARD_BG}`,
          }}
        />
      </>
    );
  }

  // "right": caret points right from the card's right edge
  const cy = cardPos.top + cardHeight / 2;
  return (
    <>
      <div
        style={{
          ...base,
          top: cy - 6,
          left: cardPos.left + CARD_WIDTH,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: `${CARET_W + 1}px solid ${CARD_BORDER}`,
        }}
      />
      <div
        style={{
          ...base,
          top: cy - 5,
          left: cardPos.left + CARD_WIDTH - 1,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `${CARET_W}px solid ${CARD_BG}`,
        }}
      />
    </>
  );
}

// ─── Dots row ─────────────────────────────────────────────────────────────────

function DotsRow({ total, current }: { total: number; current: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i + 1 === current;
        return (
          <div
            key={i}
            style={{
              width: active ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: active ? DOT_ACTIVE : DOT_INACTIVE,
              transition: "width 180ms ease",
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export function CoachmarkOverlay() {
  const [mounted, setMounted] = React.useState(false);
  // Wait for Zustand persist to finish rehydrating from localStorage
  const [hydrated, setHydrated] = React.useState(false);
  const [spotlight, setSpotlight] = React.useState<Rect | null>(null);
  const [cardHeight, setCardHeight] = React.useState(210);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const {
    isActive,
    currentStep,
    hasDismissed,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  } = useCoachmarkStore();

  const setInspectorOpen = useSandboxStore((s) => s.setInspectorOpen);
  const setExportModalOpen = useSandboxStore((s) => s.setExportModalOpen);

  const pathname = usePathname();
  const router = useRouter();

  // SSR guard + persist hydration gate
  React.useEffect(() => {
    setMounted(true);
    if (useCoachmarkStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useCoachmarkStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return unsub;
    }
  }, []);

  // Auto-start on first visit to / — only after localStorage has been read
  React.useEffect(() => {
    if (!hydrated || !COACHMARKS_ENABLED) return;
    if (pathname === "/" && !hasDismissed && !isActive) {
      startTour();
    }
  }, [hydrated, pathname, hasDismissed, isActive, startTour]);

  const stepDef = STEPS[currentStep - 1] as StepDef | undefined;

  // Trigger side effects + measure target when step changes or route settles
  React.useEffect(() => {
    if (!isActive || !stepDef) return;
    if (stepDef.route !== pathname) return;

    // Ensure required panels are open for specific steps
    if (currentStep === 9) setInspectorOpen(true);
    if (currentStep === 11 || currentStep === 12 || currentStep === 13) setExportModalOpen(true);

    // Poll with rAF until the target element appears in the DOM
    let raf: number;
    const measure = () => {
      const el = document.querySelector(`[data-coachmark="step-${currentStep}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotlight({ top: r.top, left: r.left, width: r.width, height: r.height });
      } else {
        raf = requestAnimationFrame(measure);
      }
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [isActive, currentStep, pathname, stepDef, setInspectorOpen, setExportModalOpen]);

  // Re-measure on resize
  React.useEffect(() => {
    if (!isActive) return;
    const onResize = () => {
      const el = document.querySelector(`[data-coachmark="step-${currentStep}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotlight({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isActive, currentStep]);

  // Track card height after each render
  React.useLayoutEffect(() => {
    if (cardRef.current) {
      const h = cardRef.current.offsetHeight;
      if (h > 0) setCardHeight(h);
    }
  });

  const handleNext = React.useCallback(() => {
    if (currentStep >= TOTAL_STEPS) {
      setExportModalOpen(false);
      completeTour();
      router.push("/");
      return;
    }
    const nextRoute = STEP_ROUTES[currentStep + 1];
    nextStep();
    if (nextRoute !== pathname) router.push(nextRoute);
  }, [currentStep, pathname, nextStep, completeTour, router, setExportModalOpen]);

  const handlePrev = React.useCallback(() => {
    if (currentStep <= 1) return;
    if (currentStep === 11) setExportModalOpen(false);
    const prevRoute = STEP_ROUTES[currentStep - 1];
    prevStep();
    if (prevRoute !== pathname) router.push(prevRoute);
  }, [currentStep, pathname, prevStep, router, setExportModalOpen]);

  const handleSkip = React.useCallback(() => {
    setExportModalOpen(false);
    skipTour();
  }, [skipTour, setExportModalOpen]);

  // ── Guard ──
  if (!mounted || !hydrated || !COACHMARKS_ENABLED || !isActive) return null;
  if (!stepDef || stepDef.route !== pathname) return null;
  if (!spotlight) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { top, left, width, height } = spotlight;
  const right = left + width;
  const bottom = top + height;

  const cardPos = computeCardPos(
    spotlight,
    stepDef.caretSide,
    stepDef.cardAnchor,
    cardHeight,
    vw,
    vh,
  );

  const isFirst = currentStep === 1;
  const isLast = currentStep === TOTAL_STEPS;

  const content = (
    <>
      {/* ── Dim overlay (4 rects) ── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0,
          width: vw, height: Math.max(0, top),
          backgroundColor: OVERLAY_BG, zIndex: 9990, pointerEvents: "auto",
        }}
        onClick={handleSkip}
        aria-hidden="true"
      />
      <div
        style={{
          position: "fixed", top: bottom, left: 0,
          width: vw, height: Math.max(0, vh - bottom),
          backgroundColor: OVERLAY_BG, zIndex: 9990, pointerEvents: "auto",
        }}
        onClick={handleSkip}
        aria-hidden="true"
      />
      <div
        style={{
          position: "fixed", top, left: 0,
          width: Math.max(0, left), height,
          backgroundColor: OVERLAY_BG, zIndex: 9990, pointerEvents: "auto",
        }}
        onClick={handleSkip}
        aria-hidden="true"
      />
      <div
        style={{
          position: "fixed", top, left: right,
          width: Math.max(0, vw - right), height,
          backgroundColor: OVERLAY_BG, zIndex: 9990, pointerEvents: "auto",
        }}
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* ── Highlight ring ── */}
      <div
        style={{
          position: "fixed", top, left, width, height,
          border: "2px solid #F5F0EF",
          borderRadius: 6,
          zIndex: 9991,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* ── Coachmark card ── */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-label={`Tour step ${currentStep} of ${TOTAL_STEPS}: ${stepDef.title}`}
        style={{
          position: "fixed",
          top: cardPos.top,
          left: cardPos.left,
          width: CARD_WIDTH,
          zIndex: 9999,
          backgroundColor: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 8,
          boxShadow: CARD_SHADOW,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Title + Skip (same row) */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div
            style={{
              fontFamily: TITLE_FONT,
              fontSize: 18,
              fontWeight: 400,
              color: "#1A1A1A",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {stepDef.title}
          </div>
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: BODY_FONT,
              fontSize: 12,
              color: "#9B9089",
              lineHeight: 1,
              flexShrink: 0,
              marginTop: 3,
            }}
          >
            Skip
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            fontFamily: BODY_FONT,
            fontSize: 14,
            color: "#6B5740",
            lineHeight: 1.6,
          }}
        >
          {stepDef.body}
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            aria-label="Previous step"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: isFirst ? "default" : "pointer",
              fontFamily: BODY_FONT,
              fontSize: 13,
              color: "#6B5740",
              opacity: isFirst ? 0 : 1,
              pointerEvents: isFirst ? "none" : "auto",
            }}
          >
            Previous
          </button>

          {/* Dots — centered between Prev and Next */}
          <DotsRow total={TOTAL_STEPS} current={currentStep} />

          {isLast ? (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Finish tour"
              style={{
                backgroundColor: BTN_DONE_BG,
                border: "none",
                borderRadius: 4,
                height: 32,
                padding: "0 14px",
                cursor: "pointer",
                fontFamily: BODY_FONT,
                fontSize: 13,
                fontWeight: 500,
                color: "#1A1A1A",
              }}
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              aria-label={`Go to step ${currentStep + 1}`}
              style={{
                backgroundColor: BTN_PRIMARY_BG,
                border: "none",
                borderRadius: 4,
                height: 32,
                padding: "0 14px",
                cursor: "pointer",
                fontFamily: BODY_FONT,
                fontSize: 13,
                color: "#FFFFFF",
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* ── Caret ── */}
      <Caret
        side={stepDef.caretSide}
        cardPos={cardPos}
        cardHeight={cardHeight}
      />
    </>
  );

  return createPortal(content, document.body);
}
