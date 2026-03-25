import { create } from "zustand";

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

interface SandboxState {
  // Context Menu
  contextMenu: ContextMenuState;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;
  // Playback
  isPlaying: boolean;
  playheadPosition: number;
  setPlaying: (v: boolean) => void;
  setPlayhead: (pos: number) => void;
  // Score maximize
  isExpanded: boolean;
  setExpanded: (v: boolean) => void;
}

export const useSandboxStore = create<SandboxState>((set) => ({
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
  },
  openContextMenu: (x: number, y: number) =>
    set({ contextMenu: { isOpen: true, x, y } }),
  closeContextMenu: () =>
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false },
    })),
  // Playback
  isPlaying: false,
  playheadPosition: 0,
  setPlaying: (v: boolean) => set({ isPlaying: v }),
  setPlayhead: (pos: number) => set({ playheadPosition: pos }),
  // Score maximize
  isExpanded: false,
  setExpanded: (v: boolean) => set({ isExpanded: v }),
}));
