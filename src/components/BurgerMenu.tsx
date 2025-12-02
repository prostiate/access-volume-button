import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Chip,
  Divider,
  Drawer,
  Text,
  useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';

export function BurgerMenu() {
  const router = useRouter();
  const theme = useTheme();
  const { themeMode, setThemeMode, setMenuVisible } = useStore();

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}>
        <Avatar.Icon
          size={80}
          icon="volume-high"
          style={styles.icon}
          color="#fff"
        />
        <Text variant="headlineSmall" style={styles.appName}>
          Access Volume Button
        </Text>
        <Text variant="bodyMedium" style={styles.version}>
          Version 1.0.0
        </Text>
      </LinearGradient>

      <Divider />

      {/* Theme Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={20}
            color={theme.colors.primary}
          />
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Theme
          </Text>
        </View>

        <View style={styles.chipContainer}>
          <Chip
            selected={themeMode === 'light'}
            onPress={() => setThemeMode('light')}
            icon="white-balance-sunny"
            style={styles.chip}
            showSelectedCheck>
            Light
          </Chip>
          <Chip
            selected={themeMode === 'dark'}
            onPress={() => setThemeMode('dark')}
            icon="moon-waning-crescent"
            style={styles.chip}
            showSelectedCheck>
            Dark
          </Chip>
          <Chip
            selected={themeMode === 'system'}
            onPress={() => setThemeMode('system')}
            icon="cellphone"
            style={styles.chip}
            showSelectedCheck>
            System
          </Chip>
        </View>
      </View>

      <Divider />

      {/* Navigation */}
      <Drawer.Section>
        <Drawer.Item
          label="Privacy Policy"
          icon="shield-account"
          onPress={() => {
            setMenuVisible(false);
            router.push('/privacy');
          }}
        />
        <Drawer.Item
          label="About"
          icon="information"
          onPress={() => {
            // Could navigate to an about screen
          }}
        />
      </Drawer.Section>

      <Divider />

      {/* Footer */}
      <View style={styles.footer}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
          Open Source • MIT License
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 40,
  },
  icon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff',
    textAlign: 'center',
  },
  version: {
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 90,
  },
  footer: {
    padding: 16,
    marginTop: 'auto',
  },
});
