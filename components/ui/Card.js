import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../../styles/colors';
import { BORDER_RADIUS, SPACING } from '../../styles/globalStyles';

const Card = ({
  children,
  style,
  elevated = true,
  onPress,
  padding = 'medium', // none, small, medium, large
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
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
});

export default Card;