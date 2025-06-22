/**
 * Design Tokens for EduLynx - Centralized styling constants
 * Used across both web (Next.js) and mobile (React Native) platforms
 */

export const tokens = {
  // Spacing scale based on 4px base unit
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
    '4xl': '4rem', // 64px
    '5xl': '6rem', // 96px
  },

  // Typography scale
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Color palette with semantic naming
  colors: {
    // Brand colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },

    // Educational theme colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Functional colors
    background: {
      light: '#ffffff',
      dark: '#111827',
    },

    surface: {
      light: '#f9fafb',
      dark: '#1f2937',
    },

    text: {
      primary: {
        light: '#111827',
        dark: '#ffffff',
      },
      secondary: {
        light: '#6b7280',
        dark: '#9ca3af',
      },
    },
  },

  // Border radius scale
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadow scale
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Animation durations
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Animation easing
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Component-specific tokens
  card: {
    height: {
      sm: '8rem', // 128px
      md: '12rem', // 192px
      lg: '16rem', // 256px
      xl: '20rem', // 320px
    },
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },

  button: {
    height: {
      sm: '2rem', // 32px
      md: '2.5rem', // 40px
      lg: '3rem', // 48px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },

  // Grid breakpoints
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  light: {
    '--color-primary': tokens.colors.primary[500],
    '--color-primary-light': tokens.colors.primary[100],
    '--color-primary-dark': tokens.colors.primary[700],
    '--color-background': tokens.colors.background.light,
    '--color-surface': tokens.colors.surface.light,
    '--color-text-primary': tokens.colors.text.primary.light,
    '--color-text-secondary': tokens.colors.text.secondary.light,
    '--card-height-sm': tokens.card.height.sm,
    '--card-height-md': tokens.card.height.md,
    '--card-height-lg': tokens.card.height.lg,
    '--card-height-xl': tokens.card.height.xl,
  },
  dark: {
    '--color-primary': tokens.colors.primary[400],
    '--color-primary-light': tokens.colors.primary[200],
    '--color-primary-dark': tokens.colors.primary[600],
    '--color-background': tokens.colors.background.dark,
    '--color-surface': tokens.colors.surface.dark,
    '--color-text-primary': tokens.colors.text.primary.dark,
    '--color-text-secondary': tokens.colors.text.secondary.dark,
    '--card-height-sm': tokens.card.height.sm,
    '--card-height-md': tokens.card.height.md,
    '--card-height-lg': tokens.card.height.lg,
    '--card-height-xl': tokens.card.height.xl,
  },
};

export default tokens;
