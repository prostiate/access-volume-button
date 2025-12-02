import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AppState } from "./types";

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // UI Slice
      themeMode: "system",
      hasSeenOnboarding: false,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),

      // Permissions Slice
      overlayGranted: false,
      accessibilityGranted: false,
      setOverlayGranted: (granted) => set({ overlayGranted: granted }),
      setAccessibilityGranted: (granted) =>
        set({ accessibilityGranted: granted }),

      // Overlay Slice
      enabled: false,
      styleId: "android",
      pinned: false,
      useSystemVolumeSlider: false,
      setEnabled: (enabled) => set({ enabled }),
      setStyleId: (styleId) => set({ styleId }),
      setPinned: (pinned) => set({ pinned }),
      setUseSystemVolumeSlider: (use) => set({ useSystemVolumeSlider: use }),

      // Button Settings Slice
      transparency: 0,
      size: 70,
      cornerRadius: 50,
      distance: 24,
      hiddenPercent: 20,
      longPressDelay: 0.4,
      repeatInterval: 0.1,
      updateButtonSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),
    }),
    {
      name: "access-volume-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
