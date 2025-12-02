export interface UIState {
  themeMode: "system" | "light" | "dark";
  hasSeenOnboarding: boolean;
  setThemeMode: (mode: "system" | "light" | "dark") => void;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export interface PermissionsState {
  overlayGranted: boolean;
  accessibilityGranted: boolean;
  setOverlayGranted: (granted: boolean) => void;
  setAccessibilityGranted: (granted: boolean) => void;
}

export interface OverlayState {
  enabled: boolean;
  styleId: string;
  pinned: boolean;
  useSystemVolumeSlider: boolean;
  setEnabled: (enabled: boolean) => void;
  setStyleId: (id: string) => void;
  setPinned: (pinned: boolean) => void;
  setUseSystemVolumeSlider: (use: boolean) => void;
}

export interface ButtonSettingsState {
  transparency: number;
  size: number;
  cornerRadius: number;
  distance: number;
  hiddenPercent: number;
  longPressDelay: number;
  repeatInterval: number;
  updateButtonSettings: (
    settings: Partial<Omit<ButtonSettingsState, "updateButtonSettings">>
  ) => void;
}

// Combine all slices
export interface AppState
  extends UIState,
    PermissionsState,
    OverlayState,
    ButtonSettingsState {}
