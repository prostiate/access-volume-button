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
      pinned: false,
      useSystemVolumeSlider: false,
      setEnabled: (enabled) => set({ enabled }),
      setPinned: (pinned) => set({ pinned }),
      setUseSystemVolumeSlider: (use) => set({ useSystemVolumeSlider: use }),

      // Style Slice
      styleId: "android",
      accentColor: "#2196F3",
      backgroundColor: "#FFFFFF",
      setStyle: (styleId) => set({ styleId }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),

      // Button Settings Slice
      buttonTransparency: 0,
      buttonSize: 70,
      buttonCornerRadius: 50,
      buttonDistance: 24,
      setButtonTransparency: (buttonTransparency) =>
        set({ buttonTransparency }),
      setButtonSize: (buttonSize) => set({ buttonSize }),
      setButtonCornerRadius: (buttonCornerRadius) =>
        set({ buttonCornerRadius }),
      setButtonDistance: (buttonDistance) => set({ buttonDistance }),

      // Slider Settings Slice
      sliderTransparency: 0,
      sliderHeight: 216,
      sliderThickness: 12,
      sliderDistance: 18,
      sliderTimeout: 3500,
      setSliderTransparency: (sliderTransparency) =>
        set({ sliderTransparency }),
      setSliderHeight: (sliderHeight) => set({ sliderHeight }),
      setSliderThickness: (sliderThickness) => set({ sliderThickness }),
      setSliderDistance: (sliderDistance) => set({ sliderDistance }),
      setSliderTimeout: (sliderTimeout) => set({ sliderTimeout }),

      // Power Button Slice
      powerButtonEnabled: false,
      powerButtonPosition: "above",
      setPowerButtonEnabled: (powerButtonEnabled) =>
        set({ powerButtonEnabled }),
      setPowerButtonPosition: (powerButtonPosition) =>
        set({ powerButtonPosition }),
    }),
    {
      name: "access-volume-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
