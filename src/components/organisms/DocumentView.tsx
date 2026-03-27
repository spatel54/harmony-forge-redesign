"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DocumentHeader } from "@/components/organisms/DocumentHeader";
import { ScorePreviewPanel } from "@/components/organisms/ScorePreviewPanel";
import { EnsembleBuilderPanel } from "@/components/organisms/EnsembleBuilderPanel";
import { TransitionOverlay } from "@/components/organisms/TransitionOverlay";
import { useUploadStore } from "@/store/useUploadStore";

/**
 * DocumentView — client-side view for /document
 * Extracted from document/page.tsx to allow the page route to be a Server
 * Component and export Next.js metadata. All interactive logic lives here.
 */
export function DocumentView() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const filename = useUploadStore((s) => s.filename);

  // Redirect guard — if no file has been uploaded, send back to upload step
  React.useEffect(() => {
    if (!filename) {
      router.push("/");
    }
  }, [filename, router]);

  // Derive piece title: strip file extension from filename
  const pieceTitle = filename
    ? filename.replace(/\.[^.]+$/, "")
    : "Untitled Score";

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
        <DocumentHeader data-coachmark="step-2" currentStep={2} showBack />

        {/* Two-panel body */}
        <div className="flex flex-row flex-1 min-h-0">
          <ScorePreviewPanel
            data-coachmark="step-3"
            scoreTitle={pieceTitle}
            canvasAriaLabel={`Score preview: ${pieceTitle}`}
            filename={filename ?? undefined}
            onChangeFile={() => router.push("/")}
            onReupload={() => router.push("/")}
          />
          <EnsembleBuilderPanel data-coachmark="step-4" onGenerateHarmonies={handleGenerate} />
        </div>
      </div>

      {/* Loading overlay */}
      <TransitionOverlay variant="generating" visible={isTransitioning} />
    </>
  );
}
