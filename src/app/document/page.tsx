import type { Metadata } from "next";
import { DocumentView } from "@/components/organisms/DocumentView";

/**
 * Document Page — /document
 * Step 2: Score preview (left) + Ensemble Builder (right).
 * Server Component: exports metadata for per-route <title>.
 * Client logic lives in DocumentView.
 * Corresponds to Pencil Node ID: iNmP7 (Sonata) / lXHYH (Nocturne).
 */
export const metadata: Metadata = {
  title: "HarmonyForge — Review Your Score",
};

export default function DocumentPage() {
  return <DocumentView />;
}
