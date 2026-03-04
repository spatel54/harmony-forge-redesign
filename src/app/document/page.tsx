"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DocumentHeader } from "@/components/organisms/DocumentHeader";
import { ScorePreviewPanel } from "@/components/organisms/ScorePreviewPanel";
import { EnsembleBuilderPanel } from "@/components/organisms/EnsembleBuilderPanel";
import { TransitionOverlay } from "@/components/organisms/TransitionOverlay";

/**
 * Document Page — /document
 * Step 2: Score preview (left) + Ensemble Builder (right).
 * On "Generate Harmonies" → shows "Generating Harmonies" overlay → navigates to /sandbox.
 * Corresponds to Pencil Node ID: iNmP7 (Sonata) / lXHYH (Nocturne).
 */
export default function DocumentPage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleGenerate = () => {
    setIsTransitioning(true);
    // Show "Generating Harmonies" overlay for 2.2s, then navigate
    setTimeout(() => {
      router.push("/sandbox");
    }, 2200);
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-hidden bg-(--hf-bg)">
        {/* Top navigation bar */}
        <DocumentHeader currentStep={2} />

        {/* Two-panel body */}
        <div className="flex flex-row flex-1 min-h-0">
          <ScorePreviewPanel />
          <EnsembleBuilderPanel onGenerateHarmonies={handleGenerate} />
        </div>
      </div>

      {/* Loading overlay */}
      <TransitionOverlay variant="generating" visible={isTransitioning} />
    </>
  );
}
