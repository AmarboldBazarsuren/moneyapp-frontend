import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, RADIUS, SPACING, GRADIENTS } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, gradient
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    if (disabled) {
      return {
        backgroundColor: COLORS.textDisabled,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
        };
      case 'outline':
        return {
          backgroundColor: COLORS.transparent,
          borderWidth: 2,
          borderColor: COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: COLORS.hover,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: SPACING.sm + 4,
          paddingHorizontal: SPACING.lg,
          minHeight: 48,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          minHeight: 56,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return disabled ? COLORS.textDisabled : COLORS.primary;
    }
    return COLORS.textWhite;
  };

  const getShadow = () => {
    if (disabled || variant === 'outline' || variant === 'ghost') {
      return {};
    }
    if (variant === 'primary') {
      return SHADOWS.primaryGlow;
    }
    return SHADOWS.small;
  };

  // Gradient button
  if (variant === 'gradient' && !disabled) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          getSizeStyle(),
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}>
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientButton,
            getShadow(),
          ]}>
          {loading ? (
            <ActivityIndicator color={COLORS.textWhite} />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text
                style={[
                  styles.text,
                  { color: COLORS.textWhite },
                  textStyle,
                ]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular button
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        getShadow(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...TEXT_STYLES.button,
    fontWeight: '600',
    fontSize: 16,
  },
  icon: {
    marginRight: SPACING.xs,
  },
});

export default Button;