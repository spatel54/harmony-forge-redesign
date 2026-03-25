# CONTEXT.md — src/store/

*Zustand state slices. One store per domain context. All state is typed; all actions are synchronous and co-located with the state they modify.*

---

## Ontology

| Term | Definition |
|---|---|
| **Store Slice** | A single Zustand `create<T>()` call managing one bounded domain of state |
| **Action** | A function inside a Zustand store that calls `set()` to update state |
| **Selector** | A function passed to a `useStore()` hook call to read a specific piece of state |
| **`useSandboxStore`** | Manages context menu state + playback state (`isPlaying`, `playheadPosition`, `setPlaying`, `setPlayhead`) — TASK-A03 ✅ |
| **`useScoreStore`** | Zustand slice for symbolic score data — `notes: NoteData[]`, `beamGroups: number[][]`; initialized with SATB placeholder whole notes — TASK-A21 ✅ |
| **`useUploadStore`** | Manages uploaded file metadata (`filename`, `fileType`, `fileValid`); persists to sessionStorage — TASK-A01 ✅ |
| **`useEnsembleStore`** | Manages 4 SATB voice slot selections; survives navigation to /sandbox — TASK-A02 ✅ |
| **Context Menu** | The right-click menu on the score canvas: `{ isOpen, x, y }` — inside `useSandboxStore` |
| **NoteData** | Interface in `useScoreStore`: `{ key, duration, staveIndex: 0|1|2|3, clef }` — maps directly to VexFlow StaveNote args |

---

## Decisions

- **Zustand over Context API**: Selected for selective subscription performance and TypeScript ergonomics
- **One store per domain**: `useSandboxStore` owns sandbox-specific UI state; a separate `useScoreStore` will own note data when created

---

## Patterns

- Store shape: typed interface → `create<Interface>((set) => ({ ...state, ...actions }))`
- Selectors: always use inline selectors to prevent unnecessary re-renders:
  ```ts
  const isOpen = useSandboxStore(s => s.contextMenu.isOpen); // ✓
  const store = useSandboxStore(); // ✗ — subscribes to everything
  ```
- Actions call `set()` directly — no async thunks, no middleware

---

## Policies

- **No API calls inside store actions** — stores hold client state only; data fetching belongs in server components or React Query
- **No VexFlow or Tone.js imports** inside stores — stores hold data, not rendering or scheduling logic
- **Typed slices only** — no `any` in store interfaces or action parameters

---

## Files

| File | Current State | Status |
|---|---|---|
| `useSandboxStore.ts` | `contextMenu` + `isPlaying` + `playheadPosition` + `isExpanded` + all setters | ✅ complete |
| `useScoreStore.ts` | `notes: NoteData[]`, `beamGroups: number[][]`, `setNotes`, `clearScore`; `subscribeWithSelector` middleware | ✅ complete |
| `useUploadStore.ts` | `filename`, `fileType`, `fileValid`, `setUploadedFile`, `clearUpload`; sessionStorage persist | ✅ complete |
| `useEnsembleStore.ts` | `voices: VoiceSelection[4]`, `setVoice`, `clearEnsemble` | ✅ complete |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-002 (required store fields: `isPlaying`, `playheadPosition`) |
| `.claude/rules/typescript-patterns.md` | Zustand typed slice pattern |
