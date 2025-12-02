import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = [
  '#2196F3', // Blue
  '#F44336', // Red
  '#4CAF50', // Green
  '#FFEB3B', // Yellow
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#000000', // Black
  '#FFFFFF', // White
];

interface Props {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelect }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {COLORS.map(color => (
        <TouchableOpacity key={color} onPress={() => onSelect(color)}>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: color,
                borderColor: selectedColor === color ? '#000' : '#ddd',
                borderWidth: selectedColor === color ? 3 : 1,
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});
