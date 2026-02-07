// MoneyApp Color Palette - Улаан өнгөтэй, шинэлэг design

export const COLORS = {
  // Primary Colors - Улаан гол өнгө
  primary: '#E53935',        // Тод улаан
  primaryLight: '#FF6F60',   // Цайвар улаан
  primaryDark: '#B71C1C',    // Бараан улаан
  
  // Secondary Colors
  secondary: '#424242',      // Саарал
  secondaryLight: '#6D6D6D', // Цайвар саарал
  secondaryDark: '#1B1B1B',  // Хар саарал
  
  // Accent Colors
  accent: '#FF9800',         // Шар улбар
  accentLight: '#FFB74D',    
  accentDark: '#F57C00',
  
  // Background Colors
  background: '#FFFFFF',     // Цагаан
  backgroundGray: '#F5F5F5', // Маш цайвар саарал
  backgroundDark: '#212121', // Хар (Dark mode)
  
  // Status Colors
  success: '#4CAF50',        // Ногоон
  successLight: '#81C784',
  warning: '#FF9800',        // Шар
  warningLight: '#FFB74D',
  error: '#F44336',          // Улаан
  errorLight: '#E57373',
  info: '#2196F3',           // Цэнхэр
  infoLight: '#64B5F6',
  
  // Text Colors
  textPrimary: '#212121',    // Хар
  textSecondary: '#757575',  // Саарал
  textDisabled: '#BDBDBD',   // Цайвар саарал
  textWhite: '#FFFFFF',      // Цагаан
  
  // Border & Divider
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Card & Surface
  card: '#FFFFFF',
  cardElevated: '#FAFAFA',
  
  // Gradient Colors (Улаан градиент)
  gradientStart: '#E53935',
  gradientMiddle: '#EF5350',
  gradientEnd: '#FF6F60',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Transparent
  transparent: 'transparent',
};

// Gradient Configurations
export const GRADIENTS = {
  primary: ['#E53935', '#EF5350', '#FF6F60'],
  secondary: ['#424242', '#616161', '#757575'],
  success: ['#388E3C', '#4CAF50', '#66BB6A'],
  card: ['#FFFFFF', '#FAFAFA'],
};

// Shadow Configurations
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};