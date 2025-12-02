// UI State
export interface UIState {
  themeMode: "light" | "dark" | "system";
  hasSeenOnboarding: boolean;
  menuVisible: boolean;
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setMenuVisible: (visible: boolean) => void;
}

// Permissions State
export interface PermissionsState {
  overlayGranted: boolean;
  accessibilityGranted: boolean;
  setOverlayGranted: (granted: boolean) => void;
  setAccessibilityGranted: (granted: boolean) => void;
}

// Overlay State
export interface OverlayState {
  enabled: boolean;
  pinned: boolean;
  setEnabled: (enabled: boolean) => void;
  setPinned: (pinned: boolean) => void;
}

// Style State
export interface StyleState {
  styleId: "android" | "android12" | "rgb" | "cards";
  accentColor: string;
  backgroundColor: string;
  setStyle: (styleId: StyleState["styleId"]) => void;
  setAccentColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

// Button Settings State
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

// Slider Settings State
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

// Power Button State
export interface PowerButtonState {
  powerButtonEnabled: boolean;
  powerButtonPosition: "above" | "below";
  powerButtonAction:
    | "power_dialog"
    | "notifications"
    | "screenshot"
    | "screen_off"
    | "none";
  setPowerButtonEnabled: (enabled: boolean) => void;
  setPowerButtonPosition: (position: "above" | "below") => void;
  setPowerButtonAction: (action: PowerButtonState["powerButtonAction"]) => void;
}

// Slider Configuration
export interface SliderConfig {
  id: "media" | "ring" | "notification" | "call" | "brightness" | "darkness";
  enabled: boolean;
  label: string;
  icon: string;
}

// Single Button - Multi Sliders State
export interface SingleButtonState {
  visibleSliders: string[];
  longPressAction:
    | "hide"
    | "screen_off"
    | "notifications"
    | "mute"
    | "screenshot"
    | "none";
  setVisibleSliders: (sliders: string[]) => void;
  setLongPressAction: (action: SingleButtonState["longPressAction"]) => void;
}

// Additional Settings
export interface AdditionalSettingsState {
  pinButtons: boolean;
  useSystemVolumeSlider: boolean;
  keyboardSensitive: boolean;
  setPinButtons: (pin: boolean) => void;
  setUseSystemVolumeSlider: (use: boolean) => void;
  setKeyboardSensitive: (sensitive: boolean) => void;
}

// Combined App State
export type AppState = UIState &
  PermissionsState &
  OverlayState &
  StyleState &
  ButtonSettingsState &
  SliderSettingsState &
  PowerButtonState &
  SingleButtonState &
  AdditionalSettingsState;
