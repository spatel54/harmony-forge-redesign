"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DocumentHeader } from "@/components/organisms/DocumentHeader";
import { PlaygroundBackground } from "@/components/organisms/PlaygroundBackground";
import { DropzoneCopy } from "@/components/organisms/DropzoneCopy";
import { TransitionOverlay } from "@/components/organisms/TransitionOverlay";
import { BrandTitle } from "@/components/atoms/BrandTitle";
import { useUploadStore } from "@/store/useUploadStore";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".xml", ".mxl", ".midi", ".mid"]);

/**
 * HomeView — client component for the / (Playground) route.
 * Extracted from page.tsx to allow page.tsx to be a Server Component
 * and export per-route Next.js metadata.
 */
export function HomeView() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const setUploadedFile = useUploadStore((state) => state.setUploadedFile);

  const handleFileUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const fileValid = ALLOWED_EXTENSIONS.has(ext);
    setUploadedFile({ filename: file.name, fileType: file.type, fileValid });
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/document");
    }, 2000);
  };

  return (
    <>
      <PlaygroundBackground className="flex flex-col">
        {/* Header with StepBar set to Step 1 (Playground) */}
        <DocumentHeader currentStep={1} />

        {/* Main Content: Brand Title and scaled-down Dropzone */}
        <main className="flex-1 flex flex-col items-center justify-between pb-0 overflow-y-auto">
          {/* Title takes up the top empty space and centers vertically before the stand */}
          <div className="flex-1 flex items-center justify-center pt-8">
            <BrandTitle className="text-center" />
          </div>

          {/* Scaled down music stand (max 1000px) flush with the bottom */}
          <div className="w-full max-w-[1000px] shrink-0 mt-8">
            <DropzoneCopy
              onFileDrop={handleFileUpload}
              onFileSelect={handleFileUpload}
              className="w-full"
            />
          </div>
        </main>
      </PlaygroundBackground>

      {/* Loading overlay — mounts over everything */}
      <TransitionOverlay variant="parsing" visible={isTransitioning} />
    </>
  );
}
