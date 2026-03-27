"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DocumentHeader } from "@/components/organisms/DocumentHeader";
import { PlaygroundBackground } from "@/components/organisms/PlaygroundBackground";
import { DropzoneCopy } from "@/components/organisms/DropzoneCopy";
import { TransitionOverlay } from "@/components/organisms/TransitionOverlay";
import { BrandTitle } from "@/components/atoms/BrandTitle";
import { OnboardingModal } from "@/components/organisms/OnboardingModal";
import { useUploadStore } from "@/store/useUploadStore";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".xml", ".mxl", ".midi", ".mid"]);

/**
 * HomeViewOnboarding — standalone copy of HomeView for the /onboarding route.
 * Modal always shows on every page load (including refresh) — no localStorage gating.
 * Does NOT modify or share state with the original HomeView or / route.
 */
export function HomeViewOnboarding() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const setUploadedFile = useUploadStore((state) => state.setUploadedFile);

  // Always show on mount (SSR-safe — avoids hydration mismatch)
  React.useEffect(() => {
    setShowModal(true);
  }, []);

  const handleDismiss = React.useCallback(() => {
    setShowModal(false);
  }, []);

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
        <DocumentHeader currentStep={1} />

        <main className="flex-1 flex flex-col items-center justify-between pb-0 overflow-y-auto">
          <div className="flex-1 flex items-center justify-center pt-8">
            <BrandTitle className="text-center" />
          </div>

          <div className="w-full max-w-[1000px] shrink-0 mt-8">
            <DropzoneCopy
              onFileDrop={handleFileUpload}
              onFileSelect={handleFileUpload}
              className="w-full"
            />
          </div>
        </main>
      </PlaygroundBackground>

      <TransitionOverlay variant="parsing" visible={isTransitioning} />

      {showModal && <OnboardingModal onDismiss={handleDismiss} />}
    </>
  );
}
