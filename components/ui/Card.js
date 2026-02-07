import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, RADIUS, SPACING, GRADIENTS } from '../../styles/colors';

const Card = ({
  children,
  style,
  elevated = true,
  onPress,
  padding = 'medium',
  variant = 'default', // default, gradient, glass, outline, neumorphic
  gradientColors = null,
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: SPACING.sm };
      case 'medium':
        return { padding: SPACING.md };
      case 'large':
        return { padding: SPACING.lg };
      default:
        return {};
    }
  };

  // Default card style
  if (variant === 'default') {
    const content = (
      <View
        style={[
          styles.card,
          elevated && SHADOWS.medium,
          getPaddingStyle(),
          style,
        ]}>
        {children}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  // Gradient card
  if (variant === 'gradient') {
    const colors = gradientColors || GRADIENTS.primary;
    const content = (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardGradient,
          elevated && SHADOWS.primaryGlow,
          getPaddingStyle(),
          style,
        ]}>
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  // Glass card (glassmorphism)
  if (variant === 'glass') {
    const content = (
      <View
        style={[
          styles.cardGlass,
          elevated && SHADOWS.small,
          getPaddingStyle(),
          style,
        ]}>
        {children}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  // Outline card
  if (variant === 'outline') {
    const content = (
      <View
        style={[
          styles.cardOutline,
          getPaddingStyle(),
          style,
        ]}>
        {children}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  // Neumorphic card (soft 3D effect)
  if (variant === 'neumorphic') {
    const content = (
      <View
        style={[
          styles.cardNeumorphic,
          SHADOWS.medium,
          SHADOWS.inner,
          getPaddingStyle(),
          style,
        ]}>
        {children}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  // Default fallback
  return (
    <View style={[styles.card, getPaddingStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Default card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  
  // Gradient card
  cardGradient: {
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  
  // Glass card (glassmorphism)
  cardGlass: {
    backgroundColor: COLORS.cardGlass,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backdropFilter: 'blur(10px)', // Note: Not supported on React Native, visual only
  },
  
  // Outline card
  cardOutline: {
    backgroundColor: COLORS.transparent,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  
  // Neumorphic card
  cardNeumorphic: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
});

export default Card;