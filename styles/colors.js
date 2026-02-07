// MoneyApp Color Palette - Орчин үеийн, гоёмсог өнгөнүүд

export const COLORS = {
  // Primary Colors - Гол өнгө (Хөх цэнхэр)
  primary: '#2563EB',        // Royal Blue
  primaryLight: '#60A5FA',   // Sky Blue
  primaryDark: '#1E40AF',    // Deep Blue
  
  // Secondary Colors - Нэмэлт өнгө (Ягаан)
  secondary: '#7C3AED',      // Purple
  secondaryLight: '#A78BFA', // Light Purple
  secondaryDark: '#5B21B6',  // Deep Purple
  
  // Accent Colors - Онцлох өнгө (Шар)
  accent: '#F59E0B',         // Amber
  accentLight: '#FCD34D',    
  accentDark: '#D97706',
  
  // Background Colors
  background: '#FFFFFF',     // Pure White
  backgroundGray: '#F8FAFC', // Slate 50
  backgroundDark: '#1E293B', // Slate 800
  
  // Status Colors
  success: '#10B981',        // Emerald
  successLight: '#6EE7B7',
  warning: '#F59E0B',        // Amber
  warningLight: '#FCD34D',
  error: '#EF4444',          // Red
  errorLight: '#FCA5A5',
  info: '#3B82F6',           // Blue
  infoLight: '#93C5FD',
  
  // Text Colors
  textPrimary: '#0F172A',    // Slate 900
  textSecondary: '#64748B',  // Slate 500
  textDisabled: '#CBD5E1',   // Slate 300
  textWhite: '#FFFFFF',      // White
  
  // Border & Divider
  border: '#E2E8F0',         // Slate 200
  divider: '#F1F5F9',        // Slate 100
  
  // Card & Surface
  card: '#FFFFFF',
  cardElevated: '#F8FAFC',
  
  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  overlayDark: 'rgba(15, 23, 42, 0.7)',
  
  // Transparent
  transparent: 'transparent',
};

// Gradient Configurations
export const GRADIENTS = {
  primary: ['#2563EB', '#3B82F6', '#60A5FA'],      // Blue gradient
  secondary: ['#7C3AED', '#8B5CF6', '#A78BFA'],    // Purple gradient
  success: ['#059669', '#10B981', '#34D399'],      // Green gradient
  warm: ['#F59E0B', '#FBBF24', '#FCD34D'],         // Amber gradient
  cool: ['#0EA5E9', '#38BDF8', '#7DD3FC'],         // Cyan gradient
  sunset: ['#F59E0B', '#F97316', '#EF4444'],       // Sunset gradient
  card: ['#FFFFFF', '#F8FAFC'],
};

// Shadow Configurations
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
};