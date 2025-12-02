import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, List, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  title: string;
  icon?: string;
  iconColor?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export function SectionCard({
  title,
  icon,
  iconColor,
  children,
  defaultExpanded = true,
  elevation = 1,
}: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(expanded ? 2000 : 0, { duration: 300 }),
      opacity: withTiming(expanded ? 1 : 0, { duration: 200 }),
    };
  });

  return (
    <Card style={styles.card} elevation={elevation}>
      <List.Accordion
        title={title}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        left={_props =>
          icon ? (
            <MaterialCommunityIcons
              name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
              color={iconColor || theme.colors.primary}
              style={styles.icon}
            />
          ) : undefined
        }
        titleStyle={styles.title}
        style={{ backgroundColor: theme.colors.surface }}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </List.Accordion>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    overflow: 'hidden',
  },
});
