import React from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, List } from "react-native-paper";

interface SliderOption {
  id: string;
  label: string;
  icon: string;
}

const SLIDER_OPTIONS: SliderOption[] = [
  { id: "media", label: "Media Volume", icon: "music" },
  { id: "ring", label: "Ring Volume", icon: "phone-ring" },
  { id: "notification", label: "Notification Volume", icon: "bell" },
  { id: "call", label: "Call Volume", icon: "phone" },
  { id: "brightness", label: "Brightness", icon: "brightness-6" },
  { id: "darkness", label: "Darkness (Screen Dim)", icon: "brightness-4" },
];

interface Props {
  selectedSliders: string[];
  onSelectionChange: (sliders: string[]) => void;
}

export function MultiSliderSelector({
  selectedSliders,
  onSelectionChange,
}: Props) {
  const toggleSlider = (id: string) => {
    if (selectedSliders.includes(id)) {
      onSelectionChange(selectedSliders.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedSliders, id]);
    }
  };

  return (
    <View style={styles.container}>
      {SLIDER_OPTIONS.map((option) => (
        <List.Item
          key={option.id}
          title={option.label}
          left={(props) => <List.Icon {...props} icon={option.icon} />}
          right={() => (
            <Checkbox
              status={
                selectedSliders.includes(option.id) ? "checked" : "unchecked"
              }
              onPress={() => toggleSlider(option.id)}
            />
          )}
          onPress={() => toggleSlider(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
