import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  description?: string;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function SettingSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  description,
  onValueChange,
  formatValue,
}: Props) {
  const theme = useTheme();

  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <Text variant="bodyLarge" style={styles.label}>
            {label}
          </Text>
          {description && (
            <Text
              variant="bodySmall"
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}>
              {description}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.valueBadge,
            { backgroundColor: theme.colors.primaryContainer },
          ]}>
          <Text
            variant="titleMedium"
            style={[
              styles.valueText,
              { color: theme.colors.onPrimaryContainer },
            ]}>
            {displayValue}
            <Text variant="bodySmall"> {unit}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}>
          {min}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.surfaceVariant}
          thumbTintColor={theme.colors.primary}
        />
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}>
          {max}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    lineHeight: 18,
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  valueText: {
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
