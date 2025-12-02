import {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Animation configurations
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const timingConfig = {
  duration: 300,
};

// Preset animations
export const fadeIn = FadeIn.duration(300);
export const fadeOut = FadeOut.duration(200);

export const slideInUp = SlideInUp.duration(300).springify();
export const slideOutUp = SlideOutUp.duration(200);

export const slideInDown = SlideInDown.duration(300).springify();
export const slideOutDown = SlideOutDown.duration(200);

// Custom animation hooks
export const useFadeAnimation = (isVisible: boolean) => {
  const opacity = useSharedValue(isVisible ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
    return { opacity: opacity.value };
  });

  return animatedStyle;
};

export const useScaleAnimation = (isPressed: boolean) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    scale.value = withSpring(isPressed ? 0.95 : 1, springConfig);
    return { transform: [{ scale: scale.value }] };
  });

  return animatedStyle;
};

export const useSlideAnimation = (
  isVisible: boolean,
  direction: 'up' | 'down' = 'up'
) => {
  const translateY = useSharedValue(
    isVisible ? 0 : direction === 'up' ? 50 : -50
  );

  const animatedStyle = useAnimatedStyle(() => {
    translateY.value = withSpring(
      isVisible ? 0 : direction === 'up' ? 50 : -50,
      springConfig
    );
    return { transform: [{ translateY: translateY.value }] };
  });

  return animatedStyle;
};
