# Access Volume Button

<div align="center">
  <img src="./assets/icon.png" alt="Access Volume Button Logo" width="120" height="120" />
  <p><strong>A powerful Android accessibility app for customizable floating volume controls</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#development">Development</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## 📱 Overview

**Access Volume Button** is a local-only Android utility app that provides floating, customizable volume controls and sliders that appear over other apps. Perfect for users who want quick access to volume controls without using physical buttons.

### Key Highlights

- 🎨 **4 Built-in Styles** - Android, Android 12, RGB, and Cards themes
- 🔊 **Multi-Slider Support** - Media, Ring, Notification, Call, Brightness, and Darkness
- 📱 **Per-App Configuration** - Different settings for each app
- 🎯 **Proximity Sensor Support** - Auto screen on/off based on proximity
- ⌨️ **Keyboard Sensitive** - Overlay moves when keyboard appears
- 🔒 **Privacy First** - No network access, no analytics, no ads
- 🌍 **Multilingual** - English and Indonesian support

---

## ✨ Features

### Volume & Control Management
- Floating overlay with customizable + / - buttons
- Multiple sliders: Media, Ring, Notification, Call volume
- Brightness and screen dimming controls
- Draggable and pinnable overlay position
- Auto-hide with configurable timeout
- System volume slider integration

### Customization Options
- **4 Visual Styles**: Android (classic), Android 12 (modern pill), RGB (neon), Cards (material)
- **Button Settings**: Transparency, size, corner radius, spacing, hidden percentage
- **Slider Settings**: Height, thickness, distance, animation (fade/none), progress display
- **Color Theming**: Light, Dark, and System auto-switch

### Advanced Features
- **Power Button Actions**: Open power dialog, notifications, take screenshot
- **Single Button Mode**: Access multiple sliders from one button
- **Proximity Sensor**: Screen on/off based on phone position
- **Per-App Profiles**: Custom volume/brightness per application
- **Keyboard Awareness**: Overlay repositions when keyboard opens
- **Config Per App**: Show/hide overlay for specific apps

---

## 📦 Installation

### For Users

1. Download the latest APK from [Releases](https://github.com/prostiate/access-volume-button/releases)
2. Enable "Install from Unknown Sources" on your Android device
3. Install the APK
4. Grant required permissions:
   - **Draw over other apps** (for overlay)
   - **Accessibility Service** (for global actions)

### Minimum Requirements
- Android 10 (API 29) or higher
- ~20 MB storage space

---

## 🛠 Development

### Prerequisites

- **Node.js** 18+ and npm
- **Android Studio** with SDK 29+
- **Java JDK** 17+
- React Native development environment [setup guide](https://reactnative.dev/docs/set-up-your-environment)

### Tech Stack

- **Framework**: React Native 0.81+ with TypeScript
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation 7+
- **State Management**: Zustand with AsyncStorage persistence
- **Localization**: react-i18next
- **Icons**: react-native-vector-icons

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/prostiate/access-volume-button.git
   cd access-volume-button
   git checkout feature/v1.0.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **Run on Android device/emulator** (in another terminal)
   ```bash
   npm run android
   ```

### Available Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android device/emulator
npm test           # Run Jest unit tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run build:android  # Build release APK
```

### Project Structure

```
access-volume-button/
├── android/                 # Native Android code
│   └── app/src/main/java/  # Java/Kotlin modules
│       ├── OverlayModule   # Floating overlay service
│       └── AccessibilityService  # System actions
├── src/
│   ├── screens/            # Main app screens
│   ├── components/         # Reusable UI components
│   ├── navigation/         # React Navigation setup
│   ├── store/              # Zustand state management
│   │   └── slices/         # State slices
│   ├── services/           # Native module wrappers
│   ├── theme/              # Design tokens & themes
│   ├── locales/            # i18n translations
│   ├── config/             # App configuration
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   └── types/              # TypeScript definitions
├── assets/                 # Images, fonts, icons
└── docs/                   # Documentation
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Manual Testing
Primary test device: **Xiaomi Redmi Note 8 Pro** (Android 11, MIUI 12.5.6)

Test checklist:
- [ ] First-run permission flow
- [ ] Overlay visibility and dragging
- [ ] All 4 styles rendering
- [ ] Volume control functionality
- [ ] Button/slider settings
- [ ] Per-app profiles
- [ ] Proximity sensor (if available)
- [ ] Keyboard sensitivity
- [ ] Theme switching
- [ ] Language switching
- [ ] App restart/reboot behavior

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m 'feat: add new feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request to `main` branch

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

### Code Quality
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Write unit tests for new features
- Follow TypeScript strict mode

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔒 Privacy Policy

Access Volume Button respects your privacy:
- ✅ **No data collection** - Zero personal information gathered
- ✅ **Local storage only** - All settings stored on your device
- ✅ **No network access** - Completely offline operation
- ✅ **No analytics or ads** - Clean, ad-free experience
- ✅ **Open source** - Transparent codebase

Permissions explained:
- **Draw over other apps** - Required to display floating overlay
- **Accessibility Service** - Used for global actions (power menu, notifications, screen on/off)

---

## 📞 Support

Having issues? Here's how to get help:
- 🐛 [Report bugs](https://github.com/prostiate/access-volume-button/issues)
- 💡 [Request features](https://github.com/prostiate/access-volume-button/issues)
- 📖 [Read documentation](./docs/)

---

## 🙏 Acknowledgments

- React Native community
- Material Design guidelines
- All contributors and users

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/prostiate">Muhammad Irfan Kurniawan</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
