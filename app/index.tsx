import Slider from "@react-native-community/slider";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { Divider, List, Switch, Text } from "react-native-paper";
import { ColorPicker } from "../src/components/ColorPicker";
import { StyleSelector } from "../src/components/StyleSelector";
import { AccessVolumeModule } from "../src/services/native/AccessVolumeModule";
import { useStore } from "../src/store/useStore";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    enabled,
    setEnabled,
    overlayGranted,
    setOverlayGranted,
    accessibilityGranted,
    setAccessibilityGranted,
    styleId,
    setStyle,
    accentColor,
    setAccentColor,
    buttonSize,
    setButtonSize,
    buttonTransparency,
    setButtonTransparency,
    sliderHeight,
    setSliderHeight,
    powerButtonEnabled,
    setPowerButtonEnabled,
    powerButtonPosition,
    setPowerButtonPosition,
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
    const interval = setInterval(checkPermissions, 2000); // Poll for permission changes
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
        sliderHeight,
        powerButtonEnabled,
        powerButtonPosition,
        // Add other properties as we implement them
      };
      AccessVolumeModule.updateConfig(JSON.stringify(config));
    }
  }, [
    enabled,
    styleId,
    accentColor,
    buttonSize,
    buttonTransparency,
    sliderHeight,
    powerButtonEnabled,
    powerButtonPosition,
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
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
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
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title={t("settings.show_volume_buttons")}
            right={() => (
              <Switch value={enabled} onValueChange={toggleOverlay} />
            )}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Style</List.Subheader>
          <StyleSelector
            selectedStyle={styleId}
            onSelect={(id) => setStyle(id)}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Accent Color</List.Subheader>
          <ColorPicker selectedColor={accentColor} onSelect={setAccentColor} />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Button Settings</List.Subheader>
          <List.Item
            title={`Size: ${buttonSize}`}
            description="Adjust button size"
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
            description="Adjust button transparency"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={0.8}
            step={0.1}
            value={buttonTransparency}
            onValueChange={setButtonTransparency}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Slider Settings</List.Subheader>
          <List.Item
            title={`Height: ${sliderHeight}`}
            description="Adjust slider height"
          />
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={100}
            maximumValue={300}
            step={10}
            value={sliderHeight}
            onValueChange={setSliderHeight}
          />
        </List.Section>
        <Divider />
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
            <List.Item
              title="Position"
              description={
                powerButtonPosition === "above"
                  ? "Above Sliders"
                  : "Below Sliders"
              }
              onPress={() =>
                setPowerButtonPosition(
                  powerButtonPosition === "above" ? "below" : "above"
                )
              }
            />
          )}
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Proximity Sensor</List.Subheader>
          <List.Item
            title="Not supported in v1"
            description="Proximity features coming soon"
            left={(props) => <List.Icon {...props} icon="leak" />}
          />
        </List.Section>
        <Divider />
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
});
