import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { TEXT_STYLES } from './typography';

// Spacing System
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
};

// Screen Padding
export const SCREEN_PADDING = {
  horizontal: SPACING.md,
  vertical: SPACING.md,
};

// Global Styles
export const globalStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  screenPadding: {
    paddingHorizontal: SCREEN_PADDING.horizontal,
    paddingVertical: SCREEN_PADDING.vertical,
  },
  
  // Flex Layouts
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Text Alignments
  textCenter: {
    textAlign: 'center',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // Margins
  mb8: { marginBottom: SPACING.sm },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: SPACING.md },
  mb24: { marginBottom: SPACING.lg },
  
  mt8: { marginTop: SPACING.sm },
  mt16: { marginTop: SPACING.md },
  mt24: { marginTop: SPACING.lg },
  
  mx8: { marginHorizontal: SPACING.sm },
  mx16: { marginHorizontal: SPACING.md },
  
  my8: { marginVertical: SPACING.sm },
  my16: { marginVertical: SPACING.md },
  
  // Paddings
  p8: { padding: SPACING.sm },
  p16: { padding: SPACING.md },
  p24: { padding: SPACING.lg },
  
  px16: { paddingHorizontal: SPACING.md },
  py16: { paddingVertical: SPACING.md },
  
  // Card Styles
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  
  cardElevated: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: SPACING.md,
  },
  
  inputLabel: {
    ...TEXT_STYLES.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  
  inputError: {
    borderColor: COLORS.error,
  },
  
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});