import Slider from "@react-native-community/slider";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import {
  Divider,
  List,
  Switch,
  Text,
  IconButton,
  Modal,
  Portal,
} from "react-native-paper";
import { ColorPicker } from "../src/components/ColorPicker";
import { StyleSelector } from "../src/components/StyleSelector";
import { MultiSliderSelector } from "../src/components/MultiSliderSelector";
import { BurgerMenu } from "../src/components/BurgerMenu";
import { AccessVolumeModule } from "../src/services/native/AccessVolumeModule";
import { useStore } from "../src/store/useStore";

export default function SettingsScreen() {
  const router = useRouter();
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
      console.log("Permissions check:", { overlay, accessibility });
    } catch (e) {
      console.error("Error checking permissions:", e);
    }
  };

  React.useEffect(() => {
    checkPermissions();
    const interval = setInterval(checkPermissions, 2000);
    return () => clearInterval(interval);
  }, []);

  // Sync config with native module whenever relevant state changes
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
          title: t("settings.title"),
          headerLeft: () => (
            <IconButton icon="menu" onPress={() => setMenuVisible(true)} />
          ),
        }}
      />

      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <BurgerMenu />
        </Modal>
      </Portal>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Permissions */}
        <List.Section>
          <List.Subheader>{t("settings.permissions")}</List.Subheader>
          <List.Item
            title={t("settings.overlay_permission")}
            right={() => (
              <Text
                style={{
                  alignSelf: "center",
                  color: overlayGranted ? "green" : "red",
                  marginRight: 16,
                }}
              >
                {overlayGranted ? "Granted" : "Denied"}
              </Text>
            )}
            onPress={() =>
              !overlayGranted && AccessVolumeModule.requestOverlayPermission()
            }
          />
          <List.Item
            title={t("settings.accessibility_permission")}
            right={() => (
              <Text
                style={{
                  alignSelf: "center",
                  color: accessibilityGranted ? "green" : "red",
                  marginRight: 16,
                }}
              >
                {accessibilityGranted ? "Granted" : "Denied"}
              </Text>
            )}
            description="Required for global actions. Tap to open settings."
            onPress={() => AccessVolumeModule.openAccessibilitySettings()}
          />
        </List.Section>
        <Divider />

        {/* General Settings */}
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title={t("settings.show_volume_buttons")}
            right={() => (
              <Switch value={enabled} onValueChange={toggleOverlay} />
            )}
          />
          <List.Item
            title="Pin buttons at its position"
            description="Lock overlay position"
            right={() => (
              <Switch value={pinButtons} onValueChange={setPinButtons} />
            )}
          />
          <List.Item
            title="Use system volume slider"
            description="Use Android's native volume UI"
            right={() => (
              <Switch
                value={useSystemVolumeSlider}
                onValueChange={setUseSystemVolumeSlider}
              />
            )}
          />
        </List.Section>
        <Divider />

        {/* Style */}
        <List.Section>
          <List.Subheader>Style</List.Subheader>
          <StyleSelector
            selectedStyle={styleId}
            onSelect={(id) => setStyle(id)}
          />
        </List.Section>
        <Divider />

        {/* Accent Color */}
        <List.Section>
          <List.Subheader>Accent Color</List.Subheader>
          <ColorPicker selectedColor={accentColor} onSelect={setAccentColor} />
        </List.Section>
        <Divider />

        {/* Button Settings */}
        <List.Section>
          <List.Subheader>Button Settings</List.Subheader>
          <List.Item
            title={`Size: ${buttonSize} dp`}
            description="Adjust button size (40-120 dp)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={40}
            maximumValue={120}
            step={1}
            value={buttonSize}
            onValueChange={setButtonSize}
          />
          <List.Item
            title={`Transparency: ${(buttonTransparency * 100).toFixed(0)}%`}
            description="Button transparency (0-80%)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={0.8}
            step={0.01}
            value={buttonTransparency}
            onValueChange={setButtonTransparency}
          />
          <List.Item
            title={`Corner Radius: ${buttonCornerRadius}%`}
            description="Button roundness (0-50%)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={50}
            step={1}
            value={buttonCornerRadius}
            onValueChange={setButtonCornerRadius}
          />
          <List.Item
            title={`Distance: ${buttonDistance} dp`}
            description="Space between buttons (8-64 dp)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={8}
            maximumValue={64}
            step={1}
            value={buttonDistance}
            onValueChange={setButtonDistance}
          />
        </List.Section>
        <Divider />

        {/* Slider Settings */}
        <List.Section>
          <List.Subheader>Slider Settings</List.Subheader>
          <List.Item
            title={`Transparency: ${(sliderTransparency * 100).toFixed(0)}%`}
            description="Slider transparency (0-80%)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={0.8}
            step={0.01}
            value={sliderTransparency}
            onValueChange={setSliderTransparency}
          />
          <List.Item
            title={`Height: ${sliderHeight} dp`}
            description="Slider height (120-280 dp)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={120}
            maximumValue={280}
            step={10}
            value={sliderHeight}
            onValueChange={setSliderHeight}
          />
          <List.Item
            title={`Thickness: ${sliderThickness} dp`}
            description="Slider bar thickness (4-24 dp)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={4}
            maximumValue={24}
            step={1}
            value={sliderThickness}
            onValueChange={setSliderThickness}
          />
          <List.Item
            title={`Distance: ${sliderDistance} dp`}
            description="Space between sliders (8-40 dp)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={8}
            maximumValue={40}
            step={1}
            value={sliderDistance}
            onValueChange={setSliderDistance}
          />
          <List.Item
            title={`Timeout: ${(sliderTimeout / 1000).toFixed(1)}s`}
            description="Auto-hide timeout (1-10s)"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1000}
            maximumValue={10000}
            step={500}
            value={sliderTimeout}
            onValueChange={setSliderTimeout}
          />
        </List.Section>
        <Divider />

        {/* Power Button */}
        <List.Section>
          <List.Subheader>Power Button</List.Subheader>
          <List.Item
            title="Enable Power Button"
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
                  powerButtonPosition === "above"
                    ? "Above volume buttons"
                    : "Below volume buttons"
                }
                onPress={() =>
                  setPowerButtonPosition(
                    powerButtonPosition === "above" ? "below" : "above"
                  )
                }
              />
              <List.Item
                title="Action"
                description={powerButtonAction.replace("_", " ")}
                onPress={() => {
                  // Cycle through actions
                  const actions: Array<typeof powerButtonAction> = [
                    "power_dialog",
                    "notifications",
                    "screenshot",
                    "screen_off",
                    "none",
                  ];
                  const currentIndex = actions.indexOf(powerButtonAction);
                  const nextAction =
                    actions[(currentIndex + 1) % actions.length];
                  setPowerButtonAction(nextAction);
                }}
              />
            </>
          )}
        </List.Section>
        <Divider />

        {/* Single Button - Multi Sliders */}
        <List.Section>
          <List.Subheader>Single Button – Multi Sliders</List.Subheader>
          <MultiSliderSelector
            selectedSliders={visibleSliders}
            onSelectionChange={setVisibleSliders}
          />
          <List.Item
            title="Long-press action"
            description={longPressAction.replace("_", " ")}
            onPress={() => {
              const actions: Array<typeof longPressAction> = [
                "hide",
                "screen_off",
                "notifications",
                "mute",
                "screenshot",
                "none",
              ];
              const currentIndex = actions.indexOf(longPressAction);
              const nextAction = actions[(currentIndex + 1) % actions.length];
              setLongPressAction(nextAction);
            }}
          />
        </List.Section>
        <Divider />

        {/* Proximity Sensor */}
        <List.Section>
          <List.Subheader>Proximity Sensor</List.Subheader>
          <List.Item
            title="Coming in v1.0"
            description="Proximity features not yet implemented"
            left={(props) => <List.Icon {...props} icon="leak" />}
          />
        </List.Section>
        <Divider />

        {/* Sensitive to Keyboard */}
        <List.Section>
          <List.Subheader>Sensitive to Keyboard</List.Subheader>
          <List.Item
            title="Move overlay when keyboard appears"
            description="Automatically adjust position"
            right={() => (
              <Switch
                value={keyboardSensitive}
                onValueChange={setKeyboardSensitive}
              />
            )}
          />
        </List.Section>
        <Divider />

        {/* About */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Privacy Policy"
            onPress={() => router.push("/privacy")}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
});
