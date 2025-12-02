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
  pinned: boolean;
  useSystemVolumeSlider: boolean;
  setEnabled: (enabled: boolean) => void;
  setPinned: (pinned: boolean) => void;
  setUseSystemVolumeSlider: (use: boolean) => void;
}

export interface StyleState {
  styleId: "android" | "android12" | "rgb" | "cards";
  accentColor: string;
  backgroundColor: string;
  setStyle: (styleId: StyleState["styleId"]) => void;
  setAccentColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

export interface ButtonSettingsState {
  buttonTransparency: number;
  buttonSize: number;
  buttonCornerRadius: number;
  buttonDistance: number;
  setButtonTransparency: (value: number) => void;
  setButtonSize: (value: number) => void;
  setButtonCornerRadius: (value: number) => void;
  setButtonDistance: (value: number) => void;
}

export interface SliderSettingsState {
  sliderTransparency: number;
  sliderHeight: number;
  sliderThickness: number;
  sliderDistance: number;
  sliderTimeout: number;
  setSliderTransparency: (value: number) => void;
  setSliderHeight: (value: number) => void;
  setSliderThickness: (value: number) => void;
  setSliderDistance: (value: number) => void;
  setSliderTimeout: (value: number) => void;
}

export interface PowerButtonState {
  powerButtonEnabled: boolean;
  powerButtonPosition: "above" | "below";
  setPowerButtonEnabled: (value: boolean) => void;
  setPowerButtonPosition: (value: "above" | "below") => void;
}

// Combine all slices
export interface AppState
  extends UIState,
    PermissionsState,
    OverlayState,
    StyleState,
    ButtonSettingsState,
    SliderSettingsState,
    PowerButtonState {}
