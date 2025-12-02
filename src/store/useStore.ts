import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppState } from './types';

export const useStore = create<AppState>()(
  persist(
    set => ({
      // UI State
      themeMode: 'system',
      hasSeenOnboarding: false,
      menuVisible: false,
      setThemeMode: mode => set({ themeMode: mode }),
      setHasSeenOnboarding: seen => set({ hasSeenOnboarding: seen }),
      setMenuVisible: visible => set({ menuVisible: visible }),

      // Permissions Slice
      overlayGranted: false,
      accessibilityGranted: false,
      setOverlayGranted: granted => set({ overlayGranted: granted }),
      setAccessibilityGranted: granted =>
        set({ accessibilityGranted: granted }),

      // Overlay Slice
      enabled: false,
      pinned: false,
      setEnabled: enabled => set({ enabled }),
      setPinned: pinned => set({ pinned }),

      // Style Slice
      styleId: 'android',
      accentColor: '#2196F3',
      backgroundColor: '#FFFFFF',
      setStyle: styleId => set({ styleId }),
      setAccentColor: accentColor => set({ accentColor }),
      setBackgroundColor: backgroundColor => set({ backgroundColor }),

      // Button Settings Slice
      buttonTransparency: 0,
      buttonSize: 70,
      buttonCornerRadius: 50,
      buttonDistance: 24,
      setButtonTransparency: buttonTransparency => set({ buttonTransparency }),
      setButtonSize: buttonSize => set({ buttonSize }),
      setButtonCornerRadius: buttonCornerRadius => set({ buttonCornerRadius }),
      setButtonDistance: buttonDistance => set({ buttonDistance }),

      // Slider Settings Slice
      sliderTransparency: 0,
      sliderHeight: 216,
      sliderThickness: 12,
      sliderDistance: 18,
      sliderTimeout: 3500,
      setSliderTransparency: sliderTransparency => set({ sliderTransparency }),
      setSliderHeight: sliderHeight => set({ sliderHeight }),
      setSliderThickness: sliderThickness => set({ sliderThickness }),
      setSliderDistance: sliderDistance => set({ sliderDistance }),
      setSliderTimeout: sliderTimeout => set({ sliderTimeout }),

      // Power Button Settings
      powerButtonEnabled: false,
      powerButtonPosition: 'above',
      powerButtonAction: 'power_dialog',
      setPowerButtonEnabled: enabled => set({ powerButtonEnabled: enabled }),
      setPowerButtonPosition: position =>
        set({ powerButtonPosition: position }),
      setPowerButtonAction: action => set({ powerButtonAction: action }),

      // Single Button - Multi Sliders
      visibleSliders: ['media', 'ring', 'notification'],
      longPressAction: 'hide',
      setVisibleSliders: sliders => set({ visibleSliders: sliders }),
      setLongPressAction: action => set({ longPressAction: action }),

      // Additional Settings
      pinButtons: false,
      useSystemVolumeSlider: false,
      keyboardSensitive: false,
      setPinButtons: pin => set({ pinButtons: pin }),
      setUseSystemVolumeSlider: use => set({ useSystemVolumeSlider: use }),
      setKeyboardSensitive: sensitive => set({ keyboardSensitive: sensitive }),
    }),
    {
      name: 'access-volume-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
