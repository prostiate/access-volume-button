import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Privacy Policy" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.surface} elevation={1}>
          <Text variant="headlineMedium" style={styles.title}>
            Privacy Policy
          </Text>
          <Text variant="bodyMedium" style={styles.paragraph}>
            Access Volume Button is a local-only Android utility.
          </Text>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Data Collection
          </Text>
          <Text variant="bodyMedium" style={styles.paragraph}>
            This app does not collect, store, or transmit any personal data. All
            settings are stored locally on your device.
          </Text>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Permissions
          </Text>
          <Text variant="bodyMedium" style={styles.paragraph}>
            The app requires "Draw over other apps" and "Accessibility Service"
            permissions solely to provide the floating volume button
            functionality. No data is sent to any server.
          </Text>
        </Surface>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  surface: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  paragraph: {
    marginBottom: 8,
  },
});
