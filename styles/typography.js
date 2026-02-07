// ✍️ MoneyApp 2026 - Typography System

export const FONTS = {
  // Primary font stack - San Francisco (iOS) & Roboto (Android)
  primary: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Display font - For headlines
  display: {
    regular: 'System',
    bold: 'System',
  },
  
  // Mono font - For numbers
  mono: {
    regular: 'Courier',
    bold: 'Courier',
  },
};

// 📏 FONT SIZES - Scale based
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  
  // Display sizes
  display1: 32,
  display2: 36,
  display3: 40,
  display4: 48,
};

// 📐 LINE HEIGHTS - Rhythm
export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2,
};

// ⚖️ FONT WEIGHTS
export const FONT_WEIGHT = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// 📝 TEXT STYLES - Pre-defined combinations
export const TEXT_STYLES = {
  // Display styles
  display1: {
    fontFamily: FONTS.display.bold,
    fontSize: FONT_SIZE.display4,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  display2: {
    fontFamily: FONTS.display.bold,
    fontSize: FONT_SIZE.display3,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  display3: {
    fontFamily: FONTS.display.bold,
    fontSize: FONT_SIZE.display2,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  // Headings
  h1: {
    fontFamily: FONTS.primary.bold,
    fontSize: FONT_SIZE.display1,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  h2: {
    fontFamily: FONTS.primary.bold,
    fontSize: FONT_SIZE.xxxl,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  h3: {
    fontFamily: FONTS.primary.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  h4: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  
  h5: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  
  h6: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: FONTS.primary.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.relaxed,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  body: {
    fontFamily: FONTS.primary.regular,
    fontSize: FONT_SIZE.base,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  bodySmall: {
    fontFamily: FONTS.primary.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  // Special
  button: {
    fontFamily: FONTS.primary.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.semiBold,
    letterSpacing: 0.5,
  },
  
  caption: {
    fontFamily: FONTS.primary.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  overline: {
    fontFamily: FONTS.primary.medium,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  // Monospace (numbers)
  mono: {
    fontFamily: FONTS.mono.regular,
    fontSize: FONT_SIZE.base,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  monoLarge: {
    fontFamily: FONTS.mono.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: FONT_WEIGHT.bold,
  },
};