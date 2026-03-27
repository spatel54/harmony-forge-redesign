import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * NoteData — symbolic note descriptor consumed by ScoreCanvas → VexFlow StaveNote.
 * Backend delivers an array of these; frontend renders them — no constraint logic here.
 *
 * Fields map directly to VexFlow StaveNote constructor args:
 *   key      → keys[0] in StaveNote (e.g. "b/4")
 *   duration → duration in StaveNote (e.g. "w", "q", "8")
 *   staveIndex → which of the 4 SATB staves (0=S, 1=A, 2=T, 3=B)
 *   clef     → clef context for correct stem/beam direction ("treble" | "tenor" | "bass")
 */
/** Identifies a single note by its position in the score — used for selection state */
export interface NoteSelection {
  partId: string;
  measureIndex: number;
  noteIndex: number;
  noteId?: string;
}

export interface NoteData {
  key: string;
  duration: string;
  staveIndex: 0 | 1 | 2 | 3;
  clef: "treble" | "tenor" | "bass";
}

export interface ScoreState {
  /** Flat list of notes across all voices — grouped by staveIndex for rendering */
  notes: NoteData[];
  /**
   * Beam groups — each sub-array is a set of note indices that should be beamed.
   * Populated by backend; empty for whole-note placeholder data.
   */
  beamGroups: number[][];
}

export interface ScoreActions {
  setNotes: (notes: NoteData[]) => void;
  clearScore: () => void;
}

export type ScoreStore = ScoreState & ScoreActions;

/**
 * Placeholder initialization — four SATB whole notes matching TASK-A20 constants.
 * Replaced when backend delivers real MusicXML-parsed note data.
 *
 * Pitch selection (all within stave, no ledger lines required):
 *   Soprano (treble): B4 — middle line of treble clef
 *   Alto    (treble): G4 — second line of treble clef
 *   Tenor   (tenor) : C4 — third line of tenor clef (middle C)
 *   Bass    (bass)  : F3 — fourth line of bass clef
 */
const PLACEHOLDER_NOTES: NoteData[] = [
  { key: "b/4", duration: "w", staveIndex: 0, clef: "treble" },
  { key: "g/4", duration: "w", staveIndex: 1, clef: "treble" },
  { key: "c/4", duration: "w", staveIndex: 2, clef: "tenor" },
  { key: "f/3", duration: "w", staveIndex: 3, clef: "bass" },
];

const initialState: ScoreState = {
  notes: PLACEHOLDER_NOTES,
  beamGroups: [],
};

/**
 * useScoreStore — Zustand slice for symbolic score data.
 * ScoreCanvas reads from this store; backend writes to it via setNotes().
 * No sessionStorage persistence: score data is re-fetched from the backend
 * on each sandbox session (not preserved across reloads).
 */
export const useScoreStore = create<ScoreStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    setNotes: (notes) => set({ notes }),
    clearScore: () => set(initialState),
  })),
);
