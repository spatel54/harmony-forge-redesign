import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

export type VoiceId = "soprano" | "alto" | "tenor" | "bass";

export const VOICE_IDS: VoiceId[] = ["soprano", "alto", "tenor", "bass"];

export interface EnsembleState {
  voices: Record<VoiceId, string[]>;
}

export interface EnsembleActions {
  toggleVoiceInstrument: (voiceId: VoiceId, instrument: string) => void;
  clearEnsemble: () => void;
}

export type EnsembleStore = EnsembleState & EnsembleActions;

const initialState: EnsembleState = {
  voices: { soprano: [], alto: [], tenor: [], bass: [] },
};

export const useEnsembleStore = create<EnsembleStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,

        toggleVoiceInstrument: (voiceId: VoiceId, instrument: string) =>
          set((state) => {
            const current = state.voices[voiceId];
            const updated = current.includes(instrument)
              ? current.filter((i) => i !== instrument)
              : [...current, instrument];
            return { voices: { ...state.voices, [voiceId]: updated } };
          }),

        clearEnsemble: () => set(initialState),
      }),
      {
        name: "hf-ensemble",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ voices: state.voices }),
      }
    )
  )
);
