import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

interface StyleOption {
  id: 'android' | 'android12' | 'rgb' | 'cards';
  name: string;
  description: string;
  colors: string[];
  accentColor: string;
}

const STYLES: StyleOption[] = [
  {
    id: 'android',
    name: 'Android',
    description: 'Classic blue theme',
    colors: ['#2196F3', '#1976D2'],
    accentColor: '#2196F3',
  },
  {
    id: 'android12',
    name: 'Android 12',
    description: 'Modern pill design',
    colors: ['#6200EE', '#3700B3'],
    accentColor: '#6200EE',
  },
  {
    id: 'rgb',
    name: 'RGB',
    description: 'Vibrant neon style',
    colors: ['#00FF00', '#00CC00'],
    accentColor: '#00FF00',
  },
  {
    id: 'cards',
    name: 'Cards',
    description: 'Minimal light theme',
    colors: ['#757575', '#424242'],
    accentColor: '#333333',
  },
];

interface Props {
  selectedStyle: string;
  onSelect: (styleId: 'android' | 'android12' | 'rgb' | 'cards') => void;
}

export const StyleSelector = ({ selectedStyle, onSelect }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {STYLES.map(style => {
        const isSelected = selectedStyle === style.id;

        return (
          <TouchableOpacity
            key={style.id}
            onPress={() => onSelect(style.id)}
            activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.cardWrapper,
                isSelected && {
                  transform: [{ scale: 1.02 }],
                },
              ]}>
              <Surface
                style={[
                  styles.card,
                  {
                    borderColor: isSelected
                      ? theme.colors.primary
                      : 'transparent',
                    borderWidth: isSelected ? 3 : 1,
                  },
                ]}
                elevation={isSelected ? 4 : 2}>
                {/* Gradient Preview */}
                <LinearGradient
                  colors={style.colors as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientPreview}>
                  {/* Mini UI Preview */}
                  <View style={styles.miniPreview}>
                    <View
                      style={[
                        styles.miniButton,
                        { backgroundColor: 'rgba(255,255,255,0.9)' },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniSlider,
                        {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          borderRadius: 4,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniButton,
                        { backgroundColor: 'rgba(255,255,255,0.9)' },
                      ]}
                    />
                  </View>

                  {/* Checkmark for selected */}
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="#fff"
                      />
                    </View>
                  )}
                </LinearGradient>

                {/* Style Info */}
                <View style={styles.info}>
                  <Text variant="titleSmall" style={styles.label}>
                    {style.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.description,
                      { color: theme.colors.onSurfaceVariant },
                    ]}>
                    {style.description}
                  </Text>
                </View>
              </Surface>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientPreview: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  miniPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  miniSlider: {
    width: 8,
    height: 40,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  info: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    lineHeight: 14,
  },
});
