# HarmonyForge

An ante-hoc "Glass Box" co-creative system for SATB music arrangement — symbolic score editing with deterministic voice-leading analysis and LLM-driven explainability.

## Overview

HarmonyForge is a browser-based music editor designed around the principle of transparent, explainable AI assistance. Rather than delivering opaque suggestions, the system surfaces every reasoning step — a design principle called the Glass Box. All music data is handled symbolically (MusicXML/JSON); no raw audio is processed in the browser.

The workflow follows a three-step linear flow: upload a score, configure the ensemble on the document review screen, then edit and annotate in the Tactile Sandbox. The Theory Inspector sidebar provides LLM-generated voice-leading analysis anchored in academic definitions, with Red Line violation annotations rendered inline on the score canvas.

Constraint-satisfaction logic (parallel fifths detection, voice-range validation, SATB rule enforcement) lives exclusively in a separate backend service. The frontend consumes structured violation JSON and renders it — it never derives theory conclusions from raw note data.

## Features

- Score upload accepting MusicXML (`.xml`, `.mxl`), PDF, MIDI (`.midi`, `.mid`) formats
- Document review screen with score preview and ensemble builder panel
- Tactile Sandbox with VexFlow symbolic score rendering and canvas zoom (50%–200%)
- Score pagination with keyboard navigation (arrow keys)
- Score maximize mode with Escape key collapse
- Tone.js symbolic playback with play/pause/stop transport controls
- Theory Inspector sidebar with resizable panel (drag-to-resize, 280px–600px)
- Red Line violation annotations on the VexFlow canvas (sourced from backend JSON)
- Export modal with format selection
- Nocturne (dark) and Sonata (light) themes with system preference detection
- WCAG-compliant keyboard navigation, skip links, and ARIA annotations throughout
- Onboarding coachmark tour

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS (CSS-first, v4) | ^4 |
| Score Rendering | VexFlow | ^5.0.0 |
| Playback | Tone.js (symbolic scheduling only) | ^15.1.22 |
| State | Zustand | ^5.0.11 |
| Animation | Framer Motion | ^12.34.3 |
| Icons | Lucide React, Phosphor Icons | ^0.575.0 / ^2.1.10 |
| Theme | next-themes | ^0.4.6 |
| Runtime | React | 19.2.3 |

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone <repo-url>
cd harmony-forge-redesign
npm install
```

### Running locally

```bash
npm run dev
```

The application starts on `http://localhost:3000` using Turbopack. Webpack is not supported with Next.js 16.1.6 in App Router mode — use Turbopack only.

## Project Structure

```
src/
  app/
    page.tsx              # Route /         — Upload screen (HomeView)
    document/page.tsx     # Route /document — Score review + Ensemble Builder
    sandbox/page.tsx      # Route /sandbox  — Tactile Sandbox editor
    onboarding/           # Route /onboarding
    api/                  # API route handlers
    globals.css           # Design tokens (Nocturne/Sonata, spacing, radius, shadows)
    layout.tsx            # Root layout — fonts, ThemeProvider, skip link

  components/
    atoms/                # Primitive UI elements (ThemeProvider, BrandTitle, ChatFAB, etc.)
    molecules/            # Composed controls (SandboxPlaybackBar, ScorePaginationDock,
                          #   ExportOptionsPane, SandboxActionBar, etc.)
    organisms/            # Full UI sections (HomeView, DocumentView, ScoreCanvas,
                          #   SandboxHeader, TheoryInspectorPanel, EnsembleBuilderPanel,
                          #   ExportModal, DocumentHeader, etc.)
    score/                # Score-specific rendering components
    ui/                   # Shared utility components

  store/
    useUploadStore.ts     # Uploaded file state
    useScoreStore.ts      # Score note data (NoteData[], subscribeWithSelector)
    useSandboxStore.ts    # Sandbox UI state (playback, inspector, expand, export modal)
    useEnsembleStore.ts   # Ensemble voice configuration
    useToolStore.ts       # Active editing tool
    useEditCursorStore.ts # Edit cursor position
    useCoachmarkStore.ts  # Onboarding coachmark tour state

  lib/
    music/                # Symbolic music utilities (MusicXML parser, VexFlow helpers,
                          #   score types, Tone.js playback scheduling, timewise-to-partwise)
    audio/                # Playback hook (usePlayback — Tone.js Transport wrapper)
```

## Design System

HarmonyForge uses a CSS-first Tailwind v4 token system defined in `src/app/globals.css`. All color, spacing, radius, shadow, and motion values are expressed as CSS custom properties.

Two locked palettes are provided:

- **Nocturne** — dark theme
- **Sonata** — light theme

Typography uses four font families loaded via `next/font/google`: Inter (body/labels), Instrument Serif (brand display), Fraunces (editorial), IBM Plex Mono (data/code). Ad-hoc hex values and Tailwind color overrides outside the token system are prohibited.

The full specification lives in `design-system.md` at the project root.

## Development

### Commands

```bash
npm run dev      # Start development server (Turbopack, localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Type-check without building:

```bash
npx tsc --noEmit
```

Both `npx tsc --noEmit` and `npm run build` must pass before any commit. `npm run lint` has a known incompatibility with Node 25 / eslint-config-next 16.1.6 — use the two commands above as the authoritative backpressure gate until resolved.

### Architecture notes

**Glass Box principle.** Every AI-generated explanation is anchored to an academic source and displayed verbatim in the Theory Inspector. The system never presents a reasoning conclusion without a traceable derivation.

**Symbolic-only constraint.** All music data is MusicXML/JSON. The Tone.js integration schedules symbolic note events only — `AudioContext` and raw buffer access are not used.

**Frontend/backend boundary.** Constraint-satisfaction logic (SATB rule validation, voice-leading violation detection) is implemented exclusively in a separate backend service. The frontend consumes structured violation JSON from the API and renders Red Line tooltips on the VexFlow canvas. No theory computation occurs in the browser.

**Component architecture.** Components follow Atomic Design: atoms, molecules, organisms. VexFlow rendering is wrapped in typed React components and dynamically imported inside `useEffect` for SSR safety. Zustand stores are typed slices with no implicit `any`.

**Server Component boundary.** Page files (`page.tsx`) are Server Components that export Next.js `metadata`. Client logic is extracted into `*View.tsx` siblings to preserve the metadata export while keeping interactivity.

Architecture decisions are recorded in `docs/adr/` — see `docs/adr/overview.md` for the full index.

## License

Private repository. All rights reserved.
