import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  IconButton,
  List,
  Modal,
  Portal,
  Switch,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BurgerMenu } from '../src/components/BurgerMenu';
import { ColorPicker } from '../src/components/ColorPicker';
import { MultiSliderSelector } from '../src/components/MultiSliderSelector';
import { PermissionBanner } from '../src/components/PermissionBanner';
import { SectionCard } from '../src/components/SectionCard';
import { SettingSlider } from '../src/components/SettingSlider';
import { StyleSelector } from '../src/components/StyleSelector';
import { AccessVolumeModule } from '../src/services/native/AccessVolumeModule';
import { useStore } from '../src/store/useStore';

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    // UI
    menuVisible,
    setMenuVisible,
    // Permissions
    enabled,
    setEnabled,
    overlayGranted,
    setOverlayGranted,
    accessibilityGranted,
    setAccessibilityGranted,
    // Toggles
    pinButtons,
    setPinButtons,
    useSystemVolumeSlider,
    setUseSystemVolumeSlider,
    keyboardSensitive,
    setKeyboardSensitive,
    // Style
    styleId,
    setStyle,
    accentColor,
    setAccentColor,
    // Button Settings
    buttonSize,
    setButtonSize,
    buttonTransparency,
    setButtonTransparency,
    buttonCornerRadius,
    setButtonCornerRadius,
    buttonDistance,
    setButtonDistance,
    // Slider Settings
    sliderHeight,
    setSliderHeight,
    sliderTransparency,
    setSliderTransparency,
    sliderThickness,
    setSliderThickness,
    sliderDistance,
    setSliderDistance,
    sliderTimeout,
    setSliderTimeout,
    // Power Button
    powerButtonEnabled,
    setPowerButtonEnabled,
    powerButtonPosition,
    setPowerButtonPosition,
    powerButtonAction,
    setPowerButtonAction,
    // Multi-Sliders
    visibleSliders,
    setVisibleSliders,
    longPressAction,
    setLongPressAction,
  } = useStore();

  const checkPermissions = async () => {
    try {
      const overlay = await AccessVolumeModule.checkOverlayPermission();
      setOverlayGranted(overlay);
      const accessibility =
        await AccessVolumeModule.isAccessibilityServiceEnabled();
      setAccessibilityGranted(accessibility);
    } catch (e) {
      console.error('Error checking permissions:', e);
    }
  };

  React.useEffect(() => {
    checkPermissions();
    const interval = setInterval(checkPermissions, 2000);
    return () => clearInterval(interval);
  }, []);

  // Sync config with native module
  React.useEffect(() => {
    if (enabled) {
      const config = {
        styleId,
        accentColor,
        buttonSize,
        buttonTransparency,
        buttonCornerRadius,
        buttonDistance,
        sliderHeight,
        sliderTransparency,
        sliderThickness,
        sliderDistance,
        sliderTimeout,
        powerButtonEnabled,
        powerButtonPosition,
        powerButtonAction,
        visibleSliders,
        longPressAction,
        pinButtons,
        useSystemVolumeSlider,
        keyboardSensitive,
      };
      AccessVolumeModule.updateConfig(JSON.stringify(config));
    }
  }, [
    enabled,
    styleId,
    accentColor,
    buttonSize,
    buttonTransparency,
    buttonCornerRadius,
    buttonDistance,
    sliderHeight,
    sliderTransparency,
    sliderThickness,
    sliderDistance,
    sliderTimeout,
    powerButtonEnabled,
    powerButtonPosition,
    powerButtonAction,
    visibleSliders,
    longPressAction,
    pinButtons,
    useSystemVolumeSlider,
    keyboardSensitive,
  ]);

  const toggleOverlay = async (value: boolean) => {
    setEnabled(value);
    if (value) {
      if (!overlayGranted) {
        AccessVolumeModule.requestOverlayPermission();
        return;
      }
      AccessVolumeModule.startOverlay();
    } else {
      AccessVolumeModule.stopOverlay();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerLeft: () => (
            <IconButton icon="menu" onPress={() => setMenuVisible(true)} />
          ),
        }}
      />

      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          contentContainerStyle={styles.modalContent}>
          <BurgerMenu />
        </Modal>
      </Portal>

      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.container}>
        {/* Permission Banners */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <PermissionBanner
            type="overlay"
            granted={overlayGranted}
            onRequestPermission={() =>
              AccessVolumeModule.requestOverlayPermission()
            }
          />
          <PermissionBanner
            type="accessibility"
            granted={accessibilityGranted}
            onRequestPermission={() =>
              AccessVolumeModule.openAccessibilitySettings()
            }
          />
        </Animated.View>

        {/* General Settings */}
        <SectionCard
          title="General Settings"
          icon="cog"
          iconColor={theme.colors.primary}
          defaultExpanded>
          <List.Item
            title={t('settings.show_volume_buttons')}
            description="Enable floating volume controls"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch value={enabled} onValueChange={toggleOverlay} />
            )}
          />
          <List.Item
            title="Pin buttons at position"
            description="Lock overlay position"
            left={props => <List.Icon {...props} icon="pin" />}
            right={() => (
              <Switch value={pinButtons} onValueChange={setPinButtons} />
            )}
          />
          <List.Item
            title="Use system volume slider"
            description="Use Android's native volume UI"
            left={props => <List.Icon {...props} icon="android" />}
            right={() => (
              <Switch
                value={useSystemVolumeSlider}
                onValueChange={setUseSystemVolumeSlider}
              />
            )}
          />
        </SectionCard>

        {/* Style Selection */}
        <SectionCard
          title="Visual Style"
          icon="palette"
          iconColor="#FF9500"
          defaultExpanded>
          <View style={styles.sectionContent}>
            <StyleSelector selectedStyle={styleId} onSelect={setStyle} />
          </View>
        </SectionCard>

        {/* Accent Color */}
        <SectionCard
          title="Accent Color"
          icon="format-color-fill"
          iconColor={accentColor}
          defaultExpanded>
          <View style={styles.sectionContent}>
            <ColorPicker
              selectedColor={accentColor}
              onSelect={setAccentColor}
            />
          </View>
        </SectionCard>

        {/* Button Settings */}
        <SectionCard
          title="Button Settings"
          icon="gesture-tap-button"
          iconColor="#FF3B30"
          defaultExpanded={false}>
          <SettingSlider
            label="Button Size"
            value={buttonSize}
            min={40}
            max={120}
            step={1}
            unit="dp"
            description="Adjust the button size"
            onValueChange={setButtonSize}
          />
          <SettingSlider
            label="Transparency"
            value={buttonTransparency}
            min={0}
            max={0.8}
            step={0.01}
            unit="%"
            description="Button transparency level"
            onValueChange={setButtonTransparency}
            formatValue={v => (v * 100).toFixed(0)}
          />
          <SettingSlider
            label="Corner Radius"
            value={buttonCornerRadius}
            min={0}
            max={50}
            step={1}
            unit="%"
            description="Button roundness"
            onValueChange={setButtonCornerRadius}
          />
          <SettingSlider
            label="Button Distance"
            value={buttonDistance}
            min={8}
            max={64}
            step={1}
            unit="dp"
            description="Space between buttons"
            onValueChange={setButtonDistance}
          />
        </SectionCard>

        {/* Slider Settings */}
        <SectionCard
          title="Slider Settings"
          icon="tune-vertical"
          iconColor="#34C759"
          defaultExpanded={false}>
          <SettingSlider
            label="Transparency"
            value={sliderTransparency}
            min={0}
            max={0.8}
            step={0.01}
            unit="%"
            description="Slider transparency level"
            onValueChange={setSliderTransparency}
            formatValue={v => (v * 100).toFixed(0)}
          />
          <SettingSlider
            label="Height"
            value={sliderHeight}
            min={120}
            max={280}
            step={10}
            unit="dp"
            description="Slider height"
            onValueChange={setSliderHeight}
          />
          <SettingSlider
            label="Thickness"
            value={sliderThickness}
            min={4}
            max={24}
            step={1}
            unit="dp"
            description="Slider bar thickness"
            onValueChange={setSliderThickness}
          />
          <SettingSlider
            label="Distance"
            value={sliderDistance}
            min={8}
            max={40}
            step={1}
            unit="dp"
            description="Space between sliders"
            onValueChange={setSliderDistance}
          />
          <SettingSlider
            label="Auto-hide Timeout"
            value={sliderTimeout}
            min={1000}
            max={10000}
            step={500}
            unit="s"
            description="Time until sliders hide"
            onValueChange={setSliderTimeout}
            formatValue={v => (v / 1000).toFixed(1)}
          />
        </SectionCard>

        {/* Power Button */}
        <SectionCard
          title="Power Button"
          icon="power"
          iconColor="#AF52DE"
          defaultExpanded={false}>
          <List.Item
            title="Enable Power Button"
            description="Show extra power button"
            left={props => <List.Icon {...props} icon="power" />}
            right={() => (
              <Switch
                value={powerButtonEnabled}
                onValueChange={setPowerButtonEnabled}
              />
            )}
          />
          {powerButtonEnabled && (
            <>
              <List.Item
                title="Position"
                description={
                  powerButtonPosition === 'above'
                    ? 'Above volume buttons'
                    : 'Below volume buttons'
                }
                left={props => <List.Icon {...props} icon="swap-vertical" />}
                onPress={() =>
                  setPowerButtonPosition(
                    powerButtonPosition === 'above' ? 'below' : 'above'
                  )
                }
              />
              <List.Item
                title="Action"
                description={powerButtonAction.replace('_', ' ')}
                left={props => <List.Icon {...props} icon="gesture-tap" />}
                onPress={() => {
                  const actions: Array<typeof powerButtonAction> = [
                    'power_dialog',
                    'notifications',
                    'screenshot',
                    'screen_off',
                    'none',
                  ];
                  const currentIndex = actions.indexOf(powerButtonAction);
                  const nextAction =
                    actions[(currentIndex + 1) % actions.length];
                  setPowerButtonAction(nextAction);
                }}
              />
            </>
          )}
        </SectionCard>

        {/* Multi Sliders */}
        <SectionCard
          title="Multi Sliders"
          icon="view-carousel"
          iconColor={theme.colors.secondary}
          defaultExpanded={false}>
          <MultiSliderSelector
            selectedSliders={visibleSliders}
            onSelectionChange={setVisibleSliders}
          />
          <List.Item
            title="Long-press action"
            description={longPressAction.replace('_', ' ')}
            left={props => <List.Icon {...props} icon="gesture-tap-hold" />}
            onPress={() => {
              const actions: Array<typeof longPressAction> = [
                'hide',
                'screen_off',
                'notifications',
                'mute',
                'screenshot',
                'none',
              ];
              const currentIndex = actions.indexOf(longPressAction);
              const nextAction = actions[(currentIndex + 1) % actions.length];
              setLongPressAction(nextAction);
            }}
          />
        </SectionCard>

        {/* Keyboard Sensitivity */}
        <SectionCard
          title="Keyboard Sensitivity"
          icon="keyboard"
          iconColor={theme.colors.primary}
          defaultExpanded={false}>
          <List.Item
            title="Move overlay when keyboard appears"
            description="Automatically adjust position"
            left={props => <List.Icon {...props} icon="keyboard" />}
            right={() => (
              <Switch
                value={keyboardSensitive}
                onValueChange={setKeyboardSensitive}
              />
            )}
          />
        </SectionCard>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  sectionContent: {
    paddingVertical: 8,
  },
});
