import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/HomeView";

export const metadata: Metadata = {
  title: "HarmonyForge — Upload Your Score",
};

/**
 * Playground Screen (Step 1: Upload)
 * Server Component — exports per-route metadata.
 * Client logic lives in HomeView.
 */
export default function Home() {
  return <HomeView />;
}
