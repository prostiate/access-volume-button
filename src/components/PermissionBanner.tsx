import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  type: 'overlay' | 'accessibility';
  granted: boolean;
  onRequestPermission: () => void;
}

export function PermissionBanner({
  type,
  granted,
  onRequestPermission,
}: Props) {
  const theme = useTheme();

  if (granted) return null;

  const isOverlay = type === 'overlay';
  const title = isOverlay
    ? 'Overlay Permission Required'
    : 'Accessibility Permission Required';
  const description = isOverlay
    ? 'This app needs permission to draw over other apps to show the floating volume buttons.'
    : 'This app needs accessibility permission for global actions like opening power dialog and notifications.';

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()}>
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.errorContainer,
            borderLeftColor: theme.colors.error,
          },
        ]}
        elevation={2}>
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={24}
              color={theme.colors.error}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text
                variant="titleMedium"
                style={[styles.title, { color: theme.colors.error }]}>
                {title}
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.description, { color: theme.colors.onSurface }]}>
                {description}
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={onRequestPermission}
            icon="shield-check"
            buttonColor={theme.colors.error}>
            Grant Permission
          </Button>
        </Card.Actions>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    lineHeight: 20,
  },
});
