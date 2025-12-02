import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { Appbar, Divider, List, Menu, Switch, Text } from "react-native-paper";
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
  } = useStore();

  const [menuVisible, setMenuVisible] = React.useState(false);

  const checkPermissions = async () => {
    try {
      const overlay = await AccessVolumeModule.checkOverlayPermission();
      setOverlayGranted(overlay);
      const accessibility =
        await AccessVolumeModule.isAccessibilityServiceEnabled();
      setAccessibilityGranted(accessibility);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    checkPermissions();
    const interval = setInterval(checkPermissions, 2000); // Poll for permission changes
    return () => clearInterval(interval);
  }, []);

  const toggleOverlay = async (value: boolean) => {
    setEnabled(value);
    if (value) {
      if (!overlayGranted) {
        AccessVolumeModule.requestOverlayPermission();
        return;
      }
      AccessVolumeModule.startOverlay();
      AccessVolumeModule.stopOverlay();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("settings.title"),
          headerLeft: () => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Appbar.Action
                  icon="menu"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/privacy");
                }}
                title="Privacy Policy"
              />
            </Menu>
          ),
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
                }}
              >
                {accessibilityGranted ? "Granted" : "Denied"}
              </Text>
            )}
            description="Required for global actions"
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
