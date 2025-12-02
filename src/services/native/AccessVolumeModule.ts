import { NativeModules } from "react-native";

const { AccessVolume } = NativeModules;

interface AccessVolumeInterface {
  startOverlay(): void;
  stopOverlay(): void;
  checkOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): void;
  performGlobalAction(action: number): Promise<boolean>;
  isAccessibilityServiceEnabled(): Promise<boolean>;
}

export const AccessVolumeModule = AccessVolume as AccessVolumeInterface;

export const GlobalAction = {
  GLOBAL_ACTION_BACK: 1,
  GLOBAL_ACTION_HOME: 2,
  GLOBAL_ACTION_RECENTS: 3,
  GLOBAL_ACTION_NOTIFICATIONS: 4,
  GLOBAL_ACTION_QUICK_SETTINGS: 5,
  GLOBAL_ACTION_POWER_DIALOG: 6,
  GLOBAL_ACTION_TOGGLE_SPLIT_SCREEN: 7,
  GLOBAL_ACTION_LOCK_SCREEN: 8,
  GLOBAL_ACTION_TAKE_SCREENSHOT: 9,
};
