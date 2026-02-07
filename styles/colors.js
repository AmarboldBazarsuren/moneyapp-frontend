// 🎨 MoneyApp 2026 - Орчин үеийн өнгөний систем

export const COLORS = {
  // 🎨 Primary Colors - Gradient системтэй
  primary: '#6366F1',           // Modern Indigo
  primaryLight: '#818CF8',      
  primaryDark: '#4F46E5',       
  primaryGradientStart: '#6366F1',
  primaryGradientEnd: '#8B5CF6',
  
  // 💜 Secondary Colors - Purple gradient
  secondary: '#8B5CF6',         // Vibrant Purple
  secondaryLight: '#A78BFA',    
  secondaryDark: '#7C3AED',     
  
  // 🌈 Accent Colors - Multi-gradient
  accent: '#EC4899',            // Pink
  accentLight: '#F472B6',       
  accentOrange: '#F59E0B',      
  accentGreen: '#10B981',       
  accentBlue: '#3B82F6',        
  
  // 🏔️ Neutral Colors - Premium gray scale
  white: '#FFFFFF',
  black: '#0F172A',             // Slate 900
  background: '#F8FAFC',        // Slate 50
  backgroundSecondary: '#F1F5F9', // Slate 100
  backgroundDark: '#1E293B',    // Slate 800
  
  // 📦 Surface Colors - Glassmorphism
  glass: 'rgba(255, 255, 255, 0.85)',
  glassLight: 'rgba(255, 255, 255, 0.95)',
  glassDark: 'rgba(15, 23, 42, 0.85)',
  
  // 📝 Text Colors - High contrast
  textPrimary: '#0F172A',       // Slate 900
  textSecondary: '#475569',     // Slate 600
  textTertiary: '#94A3B8',      // Slate 400
  textDisabled: '#CBD5E1',      // Slate 300
  textWhite: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  
  // ✅ Status Colors - Vibrant & Clear
  success: '#10B981',           // Emerald
  successLight: '#D1FAE5',      
  successDark: '#059669',       
  warning: '#F59E0B',           // Amber
  warningLight: '#FEF3C7',      
  warningDark: '#D97706',       
  error: '#EF4444',             // Red
  errorLight: '#FEE2E2',        
  errorDark: '#DC2626',         
  info: '#3B82F6',              // Blue
  infoLight: '#DBEAFE',         
  infoDark: '#2563EB',          
  
  // 🎴 Card & Surface
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardGlass: 'rgba(255, 255, 255, 0.7)',
  
  // 📏 Border & Divider - Subtle
  border: '#E2E8F0',            // Slate 200
  borderLight: '#F1F5F9',       // Slate 100
  divider: '#F1F5F9',           
  
  // 🎭 Overlay - Premium
  overlay: 'rgba(15, 23, 42, 0.75)',
  overlayLight: 'rgba(15, 23, 42, 0.5)',
  overlayDark: 'rgba(15, 23, 42, 0.9)',
  
  // 🎯 Interactive States
  hover: 'rgba(99, 102, 241, 0.1)',
  pressed: 'rgba(99, 102, 241, 0.2)',
  focus: 'rgba(99, 102, 241, 0.3)',
  
  // ✨ Special Effects
  shimmer: 'rgba(255, 255, 255, 0.5)',
  glow: 'rgba(139, 92, 246, 0.5)',
  
  transparent: 'transparent',
};

// 🌈 GRADIENT PRESETS - 2026 Style
export const GRADIENTS = {
  // Primary gradients
  primary: ['#6366F1', '#8B5CF6'],
  primaryVertical: ['#6366F1', '#8B5CF6', '#EC4899'],
  primaryDiagonal: ['#6366F1', '#7C3AED'],
  
  // Special gradients
  sunset: ['#F59E0B', '#EC4899', '#8B5CF6'],
  ocean: ['#3B82F6', '#06B6D4', '#10B981'],
  forest: ['#10B981', '#059669', '#047857'],
  fire: ['#EF4444', '#F97316', '#F59E0B'],
  
  // Neutral gradients
  silver: ['#F8FAFC', '#E2E8F0'],
  dark: ['#1E293B', '#0F172A'],
  
  // Card gradients
  cardPrimary: ['#6366F1', '#7C3AED'],
  cardSuccess: ['#10B981', '#059669'],
  cardWarning: ['#F59E0B', '#F97316'],
  cardError: ['#EF4444', '#DC2626'],
};

// 🎨 COLOR UTILITIES
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ✨ SHADOW SYSTEM - Neumorphism inspired
export const SHADOWS = {
  // Subtle shadows
  subtle: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Small elevation
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Medium elevation
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Large elevation
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Extra large
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Colored shadows (for primary cards)
  primaryGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  
  successGlow: {
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Inner shadow (neumorphism)
  inner: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
  },
};

// 🎯 BORDER RADIUS - Rounded corners
export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
  circle: '50%',
};

// 📐 SPACING SYSTEM - 8pt grid
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// 🎭 OPACITY LEVELS
export const OPACITY = {
  disabled: 0.4,
  inactive: 0.6,
  pressed: 0.8,
  overlay: 0.75,
};

// ✨ ANIMATION DURATIONS
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
  verySlow: 500,
};