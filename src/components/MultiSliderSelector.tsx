import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, List, Text, useTheme } from 'react-native-paper';

interface SliderOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const SLIDER_OPTIONS: SliderOption[] = [
  { id: 'media', label: 'Media Volume', icon: 'music', color: '#FF9800' },
  { id: 'ring', label: 'Ring Volume', icon: 'phone-ring', color: '#4CAF50' },
  {
    id: 'notification',
    label: 'Notification Volume',
    icon: 'bell',
    color: '#2196F3',
  },
  { id: 'call', label: 'Call Volume', icon: 'phone', color: '#9C27B0' },
  {
    id: 'brightness',
    label: 'Brightness',
    icon: 'brightness-6',
    color: '#FFC107',
  },
  {
    id: 'darkness',
    label: 'Darkness (Screen Dim)',
    icon: 'brightness-4',
    color: '#607D8B',
  },
];

interface Props {
  selectedSliders: string[];
  onSelectionChange: (sliders: string[]) => void;
}

export function MultiSliderSelector({
  selectedSliders,
  onSelectionChange,
}: Props) {
  const theme = useTheme();

  const toggleSlider = (id: string) => {
    if (selectedSliders.includes(id)) {
      onSelectionChange(selectedSliders.filter(s => s !== id));
    } else {
      onSelectionChange([...selectedSliders, id]);
    }
  };

  const selectedCount = selectedSliders.length;

  return (
    <View style={styles.container}>
      {/* Selection Counter */}
      <View
        style={[
          styles.counter,
          { backgroundColor: theme.colors.primaryContainer },
        ]}>
        <Text
          variant="bodyMedium"
          style={[
            styles.counterText,
            { color: theme.colors.onPrimaryContainer },
          ]}>
          {selectedCount} of {SLIDER_OPTIONS.length} selected
        </Text>
      </View>

      {/* Slider Options */}
      {SLIDER_OPTIONS.map(option => {
        const isSelected = selectedSliders.includes(option.id);
        return (
          <List.Item
            key={option.id}
            title={option.label}
            titleStyle={{ fontWeight: isSelected ? '600' : 'normal' }}
            left={props => (
              <List.Icon
                {...props}
                icon={option.icon}
                color={
                  isSelected ? option.color : theme.colors.onSurfaceVariant
                }
              />
            )}
            right={() => (
              <Checkbox
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={() => toggleSlider(option.id)}
                color={option.color}
              />
            )}
            onPress={() => toggleSlider(option.id)}
            style={[
              isSelected && {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  counter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  counterText: {
    fontWeight: '600',
  },
});
