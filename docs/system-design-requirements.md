Below is the **full final system design requirements document** for **Access Volume Button**. You can paste this directly into Windsurf.

---

## 1. Overview

- **Name:** Access Volume Button
- **Goal:** Local‑only Android utility that shows configurable floating volume buttons and sliders over other apps, with a settings screen and UI/behavior similar to your reference screenshots (same sections and burger menu).
- **Scope v1:**
  - Android only.
  - No network access, no login, no sync, no analytics/ads.
  - All data stored locally on device.
- **Android support:**
  - `minSdkVersion = 29` (Android 10).
  - Target and compile against the latest stable Android SDK supported by the chosen React Native version, so the app runs on current and future Android releases.[11][12]
- **License:** MIT, with a `LICENSE` file in the repo.
- **Distribution (v1):** Generate unsigned or locally signed APKs via CI and attach them to GitHub Releases. Later versions may add Google Play deployment (out of scope for v1).

---

## 2. Platforms, tech stack, structure

- **Framework & language:**
  - React Native (latest stable) with **TypeScript**.[11]
  - Use the “New Architecture” default; no special handling required unless it causes issues.
- **Package manager:**
  - **npm** only, with `package-lock.json` committed; all docs and scripts use `npm` / `npx` commands.
- **UI & design:**
  - **React Native Paper** for Material‑style components (lists, cards, switches, dialogs, theming).
  - `react-native-vector-icons` for icons.
  - Simple internal design system: shared colors, spacing, and typography defined in `src/theme/`.
- **Navigation:**
  - **React Navigation v6+** using `@react-navigation/native` and `@react-navigation/native-stack` for a small stack navigator.[13]
  - Routes: `Settings` (main screen) and `PrivacyPolicy`.
- **State & persistence:**
  - **Zustand** as global store.
  - Zustand `persist` middleware with `@react-native-async-storage/async-storage` so all settings are saved and restored at startup; a single persisted key is enough.[14][15]
  - No extra DB (SQLite, Realm) in v1.
- **Native Android components:**
  - **AccessibilityService** for global actions (open power dialog, open notifications, screen on/off), tracking foreground app, and keyboard visibility events.[16][17]
  - **Foreground overlay service** (with persistent notification) that draws the floating widget over other apps and handles user interaction.
- **Project structure (`src/`):**
  - `screens/` – `SettingsScreen`, `PrivacyPolicyScreen`.
  - `components/` – reusable UI pieces (section cards, sliders, switches, banners, burger menu, etc.).
  - `store/` – Zustand store, slices, selectors, and types.
  - `navigation/` – navigation container and stack.
  - `services/native/` – JS wrappers for overlay and accessibility native modules.
  - `theme/` – Paper theme config, light/dark palettes, spacing and typography tokens.
  - `config/` – default values, feature flags, constants (e.g., slider ranges).
  - `locales/` – `en.json` and `id.json` for translations.
  - `hooks/`, `utils/`, `types/` – shared hooks, helpers, and TS types.
- **Tooling & quality:**
  - TypeScript strict mode.
  - ESLint + Prettier with npm scripts: `lint`, `format`.
  - Optional Husky pre‑commit hook to run `lint` and `format`.

---

## 3. Functional requirements

### 3.1 Screens, navigation, localization

- **SettingsScreen (main):** Contains all configuration sections seen in your reference app:
  - Permissions / Additional permission status.
  - Show volume buttons (+ Pin buttons, Use system volume slider).
  - Select style grid.
  - Color settings.
  - Button settings.
  - Slider settings.
  - Power button.
  - Single button – Multi sliders.
  - Proximity sensor.
  - Config per app.
  - Sensitive to keyboard.
- **Burger menu overlay (from top‑left icon):**
  - App icon preview.
  - “Privacy policy” entry that navigates to `PrivacyPolicyScreen`.
  - “Theme” section with Light / Dark / System options (radio group).
  - App version text read from app metadata (e.g., “1.0.0”).
- **PrivacyPolicyScreen:**
  - Displays an offline static privacy policy explaining: the app collects no personal data, uses no analytics/ads, stores settings only on device, and uses overlay + accessibility permissions solely to provide in‑app features.[18][19]
- **Localization:**
  - Use `react-i18next` (or similar) with at least English (`en`) and Indonesian (`id`) JSON files.
  - Detect device locale; if a translation key is missing, fall back to English.
  - All visible strings must come from `locales/en.json` and `locales/id.json`, not be hard‑coded.

### 3.2 Overlay widget and styles

- **Overlay behavior:**
  - Controlled by “Show volume buttons” toggle in Settings.
  - When ON: start foreground overlay service, show draggable floating widget with + / – buttons and one or more sliders.
  - When OFF: stop service, remove widget and its notification.
  - Overlay can be pinned to a fixed position if “Pin buttons at its position” is enabled.
  - Widget layout and appearance update live when user changes style or settings.
- **Supported sliders and actions:**
  - Streams: at least Media, Ring, Notification, Call; Brightness and Darkness (screen dim) as in reference, assuming supported by device.
  - Actions (mapped from long‑press or dedicated power button): open power dialog, open notifications, screen off, screen on, mute media volume, hide buttons, take screenshot (if accessible via AccessibilityService).
- **Initial style set:**
  - Implement at least these four styles (schema below):
    - `android` – blue accent, rectangular slider with slightly rounded corners; simple white round + / – buttons.
    - `android12` – pill‑shaped blue slider and circular buttons, similar to Android 12 volume UI.
    - `rgb` – dark background, neon/gradient border for slider, colored circular buttons.
    - `cards` – light card‑style background, black icons, rectangular buttons.
  - **Style object schema:**
    - `id: string`
    - `name: string`
    - `backgroundColor: string`
    - `accentColor: string`
    - `buttonShape: 'circle' | 'rounded'`
    - `cornerRadius: number` (percent or dp depending on implementation)
    - `borderStyle` (none/outline/gradient)
    - `iconSet` (icon names or vector icon mapping)
- **Color settings:**
  - “Apply style colors” ON: use style’s default palette.
  - “Apply style colors” OFF: allow user to tweak at least primary accent color (more detailed manual color picking can be postponed).

### 3.3 Button, slider, sensor, and per‑app settings

- **Button settings (each setting persisted):**
  - Transparency: range 0–80%, default 0%.
  - Size: 40–120 dp, default 70 dp.
  - Corner radius: 0–50%, default 50%.
  - Distance between buttons: 8–64 dp, default 24 dp.
  - Button hidden percent (how much can sit off‑screen): 0–60%, default 20%.
  - Long‑press delay: 0.2–1.0 s, default 0.4 s.
  - Action repeat interval: 0.05–0.30 s, default 0.10 s.
- **Slider settings:**
  - Transparency: 0–80%, default 0%.
  - Height: 120–280 dp, default 216 dp.
  - Thickness: 4–24 dp, default 12 dp.
  - Distance between sliders: 8–40 dp, default 18 dp.
  - Timeout (auto‑hide after inactivity): 1–10 s, default 3.5 s.
  - Animation type: at least `fade` and maybe `none`.
  - “Show progress number” and “Progress number in percent” booleans.
- **Power button section:**
  - Enable/disable power button.
  - Configure long‑press action (power dialog / notifications / screenshot / none).
  - Configure relative position (above or below main widget).
- **Single button – Multi sliders:**
  - Multi‑select which streams/controls are visible.
  - Configure long‑press action (hide buttons, screen off, open notifications, mute media, take screenshot, etc.).
- **Proximity sensor:**
  - For “Near”: choose between Screen off or No action.
  - For “Away”: choose between Screen on or No action.
- **Config per app:**
  - List of app profiles keyed by package name.
  - For each profile: whether to show/hide overlay, optional volume levels per stream, and brightness override.
  - When foreground app changes, apply profile if exists; otherwise fallback to global settings.
- **Sensitive to keyboard:**
  - When ON: overlay moves upward when keyboard becomes visible, then returns when keyboard hides (if detection available on device).

---

## 4. Architecture, state model, native integration

- **Zustand store (single global store, persisted):**
  - `ui`: `themeMode: 'system' | 'light' | 'dark'`, `hasSeenOnboarding: boolean`.
  - `permissions`: `overlayGranted: boolean`, `accessibilityGranted: boolean`.
  - `overlay`: `enabled: boolean`, `styleId: string`, `pinned: boolean`, `useSystemVolumeSlider: boolean`.
  - `buttonSettings`: all numeric/boolean button settings.
  - `sliderSettings`: all numeric/boolean slider settings.
  - `powerButton`: enabled flag, position, action.
  - `singleButton`: visible sliders list, long‑press action.
  - `proximity`: nearAction, awayAction.
  - `perAppProfiles`: array of `{ packageName: string, overrides: { showOverlay?: boolean, volumes?: ..., brightness?: ... } }`.
  - `keyboardSensitivity`: `enabled: boolean`.
- **Persistence behavior:**
  - Use Zustand `persist` + AsyncStorage; on startup, load persisted state and merge with defaults if schema changed.
  - If AsyncStorage is unavailable or fails, app continues with in‑memory defaults and logs error.
- **Overlay & accessibility lifecycle:**
  - Foreground overlay service runs with a persistent system notification whenever `overlay.enabled` is true and required permissions are granted; this matches Android’s requirement for long‑running overlays.[20][21]
  - Toggling “Show volume buttons” OFF or revoking permissions stops the service and removes notification.
  - Optionally, auto‑start overlay after boot only if `overlay.enabled` was true and permissions are still granted (may be implemented later).
- **JS ↔ Native bridge protocol:**
  - `OverlayModule.startOverlay(config: OverlayConfig)` – starts service and shows widget.
  - `OverlayModule.updateOverlay(patch: Partial<OverlayConfig>)` – updates widget based on changed settings.
  - `OverlayModule.stopOverlay()` – stops overlay service.
  - `OverlayModule.performAction(action: string)` – executes native actions (e.g., `'VOLUME_UP'`, `'VOLUME_DOWN'`, `'MUTE_MEDIA'`).
  - `AccessibilityModule.performAction(action: string)` – executes power/notification/screen actions via AccessibilityService.
  - Native side sends events (e.g., foreground app change, keyboard visibility) to JS via event emitter; JS updates state / per‑app profiles accordingly.

---

## 5. Permissions, errors, accessibility, QA, and DevOps

- **Permissions UX:**
  - Required permissions:
    - “Draw over other apps” for overlay.
    - AccessibilityService enabled for global actions.
  - On first run, show an explanation/card that these permissions are needed and provide buttons to open system settings; also show banners when permissions are missing later.[22][23][20]
  - If a permission is permanently denied or later revoked:
    - Force `overlay.enabled = false`, stop overlay service.
    - Show a persistent message explaining the app needs that permission to work with a button to open settings.
    - Do not loop permission dialogs.
- **Unsupported hardware/features:**
  - Detect proximity sensor and other device capabilities on startup.
  - If unsupported, disable related UI controls and show inline “Not supported on this device” text.
- **Error handling & recovery:**
  - Wrap app root in an error boundary that:
    - Shows a simple “Something went wrong” screen if React throws.
    - Provides a “Restart app” button that remounts the app (clearing in‑memory but not persisted state).
    - Logs error + stack via logging system.
  - On app restart, if required permissions changed, show “Permissions changed – overlay turned off” message and keep app usable without overlay.
- **Accessibility (for users):**
  - All interactive elements specify `accessibilityLabel`, `accessibilityRole`, and sensible focus order so TalkBack users can operate the app.[24][25][26]
  - Overlay buttons/slider have clear labels (“Volume up”, “Volume down”, “Volume slider”).
  - Respect system font scaling; avoid tiny fixed text; maintain reasonable color contrast.
- **Logging & debugging:**
  - Development: normal RN logging and devtools.
  - Production: use a lightweight logger that can write to rotating files or in‑memory buffers; never log personal data, only technical info (errors, config summaries).
  - Optional “copy logs” or “export logs” action in a hidden/debug section to aid troubleshooting.
- **Testing:**
  - **Jest + React Native Testing Library** for:
    - Zustand store logic (toggling overlay, updating styles/settings, theme mode changes).
    - Key SettingsScreen interactions (toggling switches, style change, permission banners).
  - E2E tests (Detox/Maestro) are optional and not required for v1.
- **Manual QA plan:**
  - Primary device: Xiaomi Redmi Note 8 Pro, Android 11 / MIUI 12.5.6 (your device).
  - For each release, manually test: first‑run flow, permission granting/revoking, overlay on/off, dragging, style changes, button/slider ranges, proximity behavior (if sensor present), per‑app profile for at least one app, keyboard sensitivity, and app behavior after reboot.
- **CI / GitHub Actions and versioning:**
  - Npm scripts:
    - `npm run android` – run on device/emulator.
    - `npm test` – Jest tests.
    - `npm run lint` – ESLint.
    - `npm run format` – Prettier.
    - `npm run build:android` – `cd android && ./gradlew assembleRelease`.
  - CI workflows:
    - On push/PR to `main`: checkout → `npm install` → `npm run lint` → `npm test` → `npm run build:android` → upload APK artifact.
    - On tag `vX.Y.Z`: same steps, then create GitHub Release and attach APK.
  - Use semantic versioning; `versionName` = tag (e.g., `1.0.0`), and `versionCode` increments every release.

This is the complete final system design requirements document for v1. Any details not explicitly constrained here can be implemented using standard React Native best practices.

[1](https://www.creative-tim.com/templates/react-native)
[2](https://www.geeksforgeeks.org/blogs/best-react-native-app-templates-and-themes/)
[3](https://wpshout.com/free-react-native-templates/)
[4](https://dev.to/amazonappdev/an-android-developers-guide-to-react-native-j66)
[5](https://www.linkedin.com/pulse/build-scale-use-design-system-your-react-native-app-part-malik-chohra-iqycc)
[6](https://reactnative.dev/architecture/landing-page)
[7](https://github.com/ahc2806/react-native-template-clean-architecture)
[8](https://hybridheroes.de/blog/using-react-native-templates-optimise-development/)
[9](https://code.tutsplus.com/5-react-native-ui-kits-themes-and-app-templates--cms-33274a)
[10](https://www.netguru.com/blog/design-systems-in-react-native)
[11](https://reactnative.dev/docs/set-up-your-environment)
[12](https://reactnative.dev/versions)
[13](https://reactnavigation.org/docs/getting-started/)
[14](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
[15](https://react-native-async-storage.github.io/async-storage/docs/usage/)
[16](https://developer.android.com/guide/topics/ui/accessibility/service)
[17](https://codelabs.developers.google.com/codelabs/developing-android-a11y-service)
[18](https://www.privacypolicygenerator.info/privacy-policy-no-data-collection/)
[19](https://stackoverflow.com/questions/70493899/privacy-policy-for-the-app-on-google-play-that-doesnt-collect-any-user-data)
[20](https://developer.android.com/guide/topics/permissions/overview)
[21](https://www.geeksforgeeks.org/android/how-to-draw-over-other-apps-in-android/)
[22](https://reactnative.dev/docs/permissionsandroid)
[23](https://thoughtbot.com/blog/supporting-android-permissions-in-react-native)
[24](https://reactnative.dev/docs/accessibility)
[25](https://metadesignsolutions.com/building-accessible-apps-with-react-native/)
[26](https://afb.org/aw/fall2024/react-native-accessibility)
