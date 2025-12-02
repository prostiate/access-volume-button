import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

interface StyleOption {
  id: 'android' | 'android12' | 'rgb' | 'cards';
  name: string;
  color: string;
}

const STYLES: StyleOption[] = [
  { id: 'android', name: 'Android', color: '#2196F3' },
  { id: 'android12', name: 'Android 12', color: '#6200EE' },
  { id: 'rgb', name: 'RGB', color: '#00FF00' },
  { id: 'cards', name: 'Cards', color: '#333333' },
];

interface Props {
  selectedStyle: string;
  onSelect: (styleId: 'android' | 'android12' | 'rgb' | 'cards') => void;
}

export const StyleSelector = ({ selectedStyle, onSelect }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {STYLES.map(style => (
        <TouchableOpacity key={style.id} onPress={() => onSelect(style.id)}>
          <Surface
            style={[
              styles.card,
              {
                borderColor:
                  selectedStyle === style.id
                    ? theme.colors.primary
                    : 'transparent',
                borderWidth: 2,
              },
            ]}
            elevation={2}>
            <View style={[styles.preview, { backgroundColor: style.color }]} />
            <Text style={styles.label}>{style.name}</Text>
          </Surface>
        </TouchableOpacity>
      ))}
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
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
});
