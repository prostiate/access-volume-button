import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Divider, Drawer, RadioButton, Text } from "react-native-paper";
import { useStore } from "../store/useStore";

export function BurgerMenu() {
  const router = useRouter();
  const { themeMode, setThemeMode, menuVisible, setMenuVisible } = useStore();

  return (
    <View style={styles.container}>
      {/* App Info Section */}
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="volume-high" style={styles.icon} />
        <Text variant="titleLarge" style={styles.appName}>
          Access Volume Button
        </Text>
        <Text variant="bodySmall" style={styles.version}>
          v1.0.0
        </Text>
      </View>

      <Divider />

      {/* Theme Section */}
      <Drawer.Section title="Theme">
        <RadioButton.Group
          onValueChange={(value) =>
            setThemeMode(value as "light" | "dark" | "system")
          }
          value={themeMode}
        >
          <View style={styles.radioItem}>
            <RadioButton.Item label="Light" value="light" />
          </View>
          <View style={styles.radioItem}>
            <RadioButton.Item label="Dark" value="dark" />
          </View>
          <View style={styles.radioItem}>
            <RadioButton.Item label="System" value="system" />
          </View>
        </RadioButton.Group>
      </Drawer.Section>

      <Divider />

      {/* Navigation */}
      <Drawer.Section>
        <Drawer.Item
          label="Privacy Policy"
          icon="shield-account"
          onPress={() => {
            setMenuVisible(false);
            router.push("/privacy");
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 24,
  },
  icon: {
    backgroundColor: "#2196F3",
    marginBottom: 12,
  },
  appName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  version: {
    opacity: 0.6,
  },
  radioItem: {
    paddingLeft: 8,
  },
});
