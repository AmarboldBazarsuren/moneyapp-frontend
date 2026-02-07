import { Platform } from 'react-native';

// Font Families
export const FONTS = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
  }),
};

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 40,
};

// Line Heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Text Styles
export const TEXT_STYLES = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.huge,
    lineHeight: FONT_SIZES.huge * LINE_HEIGHTS.tight,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxxl,
    lineHeight: FONT_SIZES.xxxl * LINE_HEIGHTS.tight,
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxl,
    lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.tight,
  },
  h4: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xl,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
  },
  h5: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
  },
  h6: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
  },
  
  // Body Text
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.relaxed,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.relaxed,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },
  
  // Special
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
  },
  button: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.tight,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
  },
};

// Font Weights
export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};