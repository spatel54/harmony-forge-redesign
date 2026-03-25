/**
 * llm-review.ts — LLM-as-a-Judge backpressure fixture (ADR-001)
 *
 * Used by agents in the Ralph Wiggum loop to evaluate subjective, visual, or
 * creative acceptance criteria that cannot be verified programmatically.
 * Returns a binary pass/fail. The agent must not commit until this returns true.
 *
 * Implementation is deferred until the first acceptance criterion that requires it.
 * The stub below is fully typed so the build and type-checker pass immediately.
 */

export type ArtifactInput =
  | { type: "text"; content: string }
  | { type: "screenshot"; data: Buffer; mimeType: "image/png" | "image/jpeg" }
  | { type: "url"; href: string };

export interface ReviewResult {
  passed: boolean;
  score: number; // 0.0–1.0
  rationale: string;
  criteria: string;
}

/**
 * Evaluates an artifact against a plain-language acceptance criterion.
 *
 * @param artifact - Text, screenshot buffer, or URL to evaluate
 * @param criteria - Plain-language description of what "passing" looks like
 * @returns ReviewResult with binary pass/fail, score, and rationale
 *
 * @example
 * // In a build loop after rendering the score canvas:
 * const result = await evaluateArtifact(
 *   { type: "screenshot", data: screenshotBuffer, mimeType: "image/png" },
 *   "The VexFlow score canvas renders all four SATB voices with distinct colors and no overlapping noteheads"
 * );
 * if (!result.passed) throw new Error(`Visual check failed: ${result.rationale}`);
 */
export async function evaluateArtifact(
  artifact: ArtifactInput,
  criteria: string,
): Promise<ReviewResult> {
  // TODO: Implement when first subjective acceptance criterion is encountered.
  // Route to a fast multimodal model (e.g., claude-haiku-4-5-20251001 for speed,
  // claude-sonnet-4-6 for higher accuracy on visual tasks).
  // Return { passed: boolean, score: number, rationale: string, criteria }.
  throw new Error(
    `llm-review.ts: evaluateArtifact is not yet implemented.\n` +
      `Criteria: "${criteria}"\n` +
      `Artifact type: "${artifact.type}"\n` +
      `Implement this function when the first subjective acceptance criterion is encountered.`,
  );
}
