import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

// Curated color palette organized by category
const COLOR_PALETTE = {
  primary: [
    { name: 'Blue', hex: '#2196F3' },
    { name: 'Indigo', hex: '#3F51B5' },
    { name: 'Purple', hex: '#9C27B0' },
    { name: 'Deep Purple', hex: '#673AB7' },
  ],
  vibrant: [
    { name: 'Red', hex: '#F44336' },
    { name: 'Pink', hex: '#E91E63' },
    { name: 'Orange', hex: '#FF9800' },
    { name: 'Amber', hex: '#FFC107' },
  ],
  nature: [
    { name: 'Green', hex: '#4CAF50' },
    { name: 'Teal', hex: '#009688' },
    { name: 'Cyan', hex: '#00BCD4' },
    { name: 'Light Blue', hex: '#03A9F4' },
  ],
  neutral: [
    { name: 'Black', hex: '#000000' },
    { name: 'Dark Gray', hex: '#424242' },
    { name: 'Gray', hex: '#757575' },
    { name: 'White', hex: '#FFFFFF' },
  ],
};

const ALL_COLORS = [
  ...COLOR_PALETTE.primary,
  ...COLOR_PALETTE.vibrant,
  ...COLOR_PALETTE.nature,
  ...COLOR_PALETTE.neutral,
];

interface Props {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelect }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {ALL_COLORS.map(color => {
          const isSelected =
            selectedColor.toLowerCase() === color.hex.toLowerCase();

          return (
            <TouchableOpacity
              key={color.hex}
              onPress={() => onSelect(color.hex)}
              activeOpacity={0.7}>
              <Animated.View
                style={[
                  styles.colorWrapper,
                  isSelected && {
                    transform: [{ scale: 1.1 }],
                  },
                ]}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: color.hex,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.outline,
                      borderWidth: isSelected ? 3 : 2,
                    },
                  ]}>
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={color.hex === '#FFFFFF' ? '#000' : '#fff'}
                      />
                    </View>
                  )}
                </View>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.colorName,
                    {
                      color: isSelected
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                      fontWeight: isSelected ? 'bold' : 'normal',
                    },
                  ]}>
                  {color.name.split(' ')[0]}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    padding: 8,
    gap: 12,
  },
  colorWrapper: {
    alignItems: 'center',
    width: 60,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmarkContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 2,
  },
  colorName: {
    marginTop: 6,
    fontSize: 10,
    textAlign: 'center',
  },
});
