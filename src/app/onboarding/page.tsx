import type { Metadata } from "next";
import { HomeViewOnboarding } from "@/components/organisms/HomeViewOnboarding";

export const metadata: Metadata = {
  title: "HarmonyForge — Onboarding",
};

/**
 * Onboarding Screen — standalone copy of the import/upload page.
 * Not linked from any navigation — accessible via /onboarding directly.
 * Renders the same HomeView UI with an OnboardingModal overlay.
 */
export default function OnboardingPage() {
  return <HomeViewOnboarding />;
}
