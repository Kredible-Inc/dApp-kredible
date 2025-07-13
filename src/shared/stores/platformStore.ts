import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlatformState {
  activePlatform: string | null;
  setActivePlatform: (platformId: string) => void;
  clearActivePlatform: () => void;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      activePlatform: null,
      setActivePlatform: (platformId) => set({ activePlatform: platformId }),
      clearActivePlatform: () => set({ activePlatform: null }),
    }),
    {
      name: "platform-storage",
      partialize: (state) => ({
        activePlatform: state.activePlatform,
      }),
    }
  )
);
