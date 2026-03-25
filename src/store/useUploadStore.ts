import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UploadedFile {
  filename: string;
  fileType: string;
  fileValid: boolean;
}

export interface UploadState {
  filename: string | null;
  fileType: string | null;
  fileValid: boolean;
}

export interface UploadActions {
  setUploadedFile: (file: UploadedFile) => void;
  clearUpload: () => void;
}

export type UploadStore = UploadState & UploadActions;

const initialState: UploadState = {
  filename: null,
  fileType: null,
  fileValid: false,
};

export const useUploadStore = create<UploadStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,

        setUploadedFile: ({ filename, fileType, fileValid }: UploadedFile) =>
          set({ filename, fileType, fileValid }),

        clearUpload: () => set(initialState),
      }),
      {
        name: "hf-upload",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          filename: state.filename,
          fileType: state.fileType,
          fileValid: state.fileValid,
        }),
      }
    )
  )
);
