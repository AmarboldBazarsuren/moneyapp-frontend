import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { BORDER_RADIUS, SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, danger
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.textDisabled : COLORS.primary,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? COLORS.textDisabled : COLORS.secondary,
        };
      case 'outline':
        return {
          backgroundColor: COLORS.transparent,
          borderWidth: 1,
          borderColor: disabled ? COLORS.textDisabled : COLORS.primary,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? COLORS.textDisabled : COLORS.error,
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
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: SPACING.lg,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return disabled ? COLORS.textDisabled : COLORS.primary;
    }
    return COLORS.textWhite;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
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
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
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