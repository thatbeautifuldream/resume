"use client";

import { create } from "zustand";

type KeyboardShortcutsState = {
  isDialogOpen: boolean;
};

type KeyboardShortcutsActions = {
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
};

type KeyboardShortcutsStore = KeyboardShortcutsState & {
  actions: KeyboardShortcutsActions;
};

export const useKeyboardShortcutsStore = create<KeyboardShortcutsStore>()(
  (set) => ({
    isDialogOpen: false,

    actions: {
      openDialog: () => set({ isDialogOpen: true }),
      closeDialog: () => set({ isDialogOpen: false }),
      toggleDialog: () =>
        set((state) => ({ isDialogOpen: !state.isDialogOpen })),
    },
  })
);

export function useKeyboardShortcutsDialogOpen() {
  return useKeyboardShortcutsStore((state) => state.isDialogOpen);
}

export function useKeyboardShortcutsActions() {
  return useKeyboardShortcutsStore((state) => state.actions);
}
