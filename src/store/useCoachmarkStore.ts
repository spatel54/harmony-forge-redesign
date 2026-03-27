// FEATURE: COACHMARKS — Delete this file + CoachmarkOverlay.tsx + all data-coachmark="*" attributes to remove the tour.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COACHMARKS_ENABLED = true;
export const TOTAL_STEPS = 11;

/** Maps step number → app route. */
export const STEP_ROUTES: Record<number, string> = {
  1: "/",
  2: "/document",
  3: "/document",
  4: "/document",
  5: "/sandbox",
  6: "/sandbox",
  7: "/sandbox",
  8: "/sandbox",
  9: "/sandbox",
  10: "/sandbox",
  11: "/sandbox",
};

interface CoachmarkState {
  isActive: boolean;
  currentStep: number;
  hasDismissed: boolean;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

export const useCoachmarkStore = create<CoachmarkState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 1,
      hasDismissed: false,
      startTour: () => set({ isActive: true, currentStep: 1 }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep >= TOTAL_STEPS) {
          set({ isActive: false, hasDismissed: true });
        } else {
          set({ currentStep: currentStep + 1 });
        }
      },
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) set({ currentStep: currentStep - 1 });
      },
      skipTour: () => set({ isActive: false, hasDismissed: true }),
      completeTour: () => set({ isActive: false, hasDismissed: true }),
    }),
    {
      name: "hf-coachmarks",
      // hasDismissed is intentionally NOT persisted — tour restarts on every page load.
      partialize: (state) => ({
        isActive: state.isActive,
        currentStep: state.currentStep,
      }),
    },
  ),
);
