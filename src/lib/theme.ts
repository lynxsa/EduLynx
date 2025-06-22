/**
 * Theme utility functions for consistent styling across the application
 */

export const themeClasses = {
  // Layout backgrounds
  background: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    card: 'bg-white dark:bg-gray-800',
    overlay: 'bg-black/50 dark:bg-black/70',
  },

  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-600',
    inverse: 'text-white dark:text-gray-900',
  },

  // Borders
  border: {
    default: 'border-gray-200 dark:border-gray-700',
    light: 'border-gray-100 dark:border-gray-800',
    strong: 'border-gray-300 dark:border-gray-600',
  },

  // Interactive states
  interactive: {
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
    active: 'active:bg-gray-100 dark:active:bg-gray-700',
    focus: 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm dark:shadow-gray-900/20',
    default: 'shadow dark:shadow-gray-900/30',
    lg: 'shadow-lg dark:shadow-gray-900/40',
    xl: 'shadow-xl dark:shadow-gray-900/50',
  },

  // Gradients
  gradient: {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500',
    success:
      'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500',
    warning:
      'bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500',
  },

  // Input styles
  input: {
    base: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
    focus:
      'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400',
  },

  // Button variants
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
    secondary:
      'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    success: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white',
    warning:
      'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  },
};

/**
 * Utility function to combine theme classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get appropriate theme classes for a component
 */
export const getThemeClasses = (variant: keyof typeof themeClasses, type?: string) => {
  const variantClasses = themeClasses[variant];
  if (!type || typeof variantClasses === 'string') {
    return variantClasses;
  }
  return (variantClasses as any)[type] || '';
};

/**
 * Common component class combinations
 */
export const componentClasses = {
  card: cn(
    themeClasses.background.card,
    themeClasses.border.default,
    themeClasses.shadow.default,
    'rounded-lg border'
  ),

  cardHover: cn(
    themeClasses.background.card,
    themeClasses.border.default,
    themeClasses.shadow.default,
    themeClasses.interactive.hover,
    'rounded-lg border transition-all duration-200 cursor-pointer'
  ),

  input: cn(
    themeClasses.input.base,
    themeClasses.input.focus,
    'rounded-lg border px-3 py-2 transition-colors duration-200'
  ),

  button: cn(
    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
    themeClasses.interactive.focus
  ),

  modal: cn(
    themeClasses.background.card,
    themeClasses.border.default,
    themeClasses.shadow.xl,
    'rounded-xl border'
  ),

  sidebar: cn(themeClasses.background.secondary, themeClasses.border.default, 'border-r'),

  navbar: cn(
    themeClasses.background.card,
    themeClasses.border.default,
    themeClasses.shadow.sm,
    'border-b'
  ),
};

export default themeClasses;
