import { create } from "zustand";

type AppShellState = {
  isBootstrapped: boolean;
  setBootstrapped: (value: boolean) => void;
};

export const useAppShellStore = create<AppShellState>((set) => ({
  isBootstrapped: true,
  setBootstrapped: (value: boolean) => {
    set({ isBootstrapped: value });
  },
}));
