/**
 * Accessibility utilities and hooks for EduLynx Dashboard
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Focus management hook for modals and dialogs
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element when trap activates
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isActive]);

  return containerRef;
};

/**
 * Escape key handler hook
 */
export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, isActive]);
};

/**
 * Announce changes to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * ARIA attributes helper for interactive elements
 */
export const getAriaAttributes = (options: {
  role?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}) => {
  const attrs: Record<string, any> = {};
  
  if (options.role) attrs['role'] = options.role;
  if (options.label) attrs['aria-label'] = options.label;
  if (options.labelledBy) attrs['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) attrs['aria-describedby'] = options.describedBy;
  if (typeof options.expanded === 'boolean') attrs['aria-expanded'] = options.expanded;
  if (typeof options.selected === 'boolean') attrs['aria-selected'] = options.selected;
  if (typeof options.disabled === 'boolean') attrs['aria-disabled'] = options.disabled;
  if (typeof options.required === 'boolean') attrs['aria-required'] = options.required;
  if (typeof options.invalid === 'boolean') attrs['aria-invalid'] = options.invalid;
  if (options.current) attrs['aria-current'] = options.current;
  
  return attrs;
};

/**
 * Keyboard navigation hook for lists and grids
 */
export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    wrap?: boolean;
    onSelect?: (element: HTMLElement) => void;
  } = {}
) => {
  const { orientation = 'vertical', wrap = true, onSelect } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = Array.from(
      container.querySelectorAll('[tabindex="0"], button:not([disabled]), [href]:not([disabled])')
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= focusableElements.length) {
            nextIndex = wrap ? 0 : focusableElements.length - 1;
          }
        }
        break;
      
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = wrap ? focusableElements.length - 1 : 0;
          }
        }
        break;
      
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= focusableElements.length) {
            nextIndex = wrap ? 0 : focusableElements.length - 1;
          }
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = wrap ? focusableElements.length - 1 : 0;
          }
        }
        break;
      
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      
      case 'End':
        e.preventDefault();
        nextIndex = focusableElements.length - 1;
        break;
      
      case 'Enter':
      case ' ':
        if (onSelect && document.activeElement) {
          e.preventDefault();
          onSelect(document.activeElement as HTMLElement);
        }
        break;
    }

    if (nextIndex !== currentIndex) {
      focusableElements[nextIndex]?.focus();
    }
  }, [containerRef, orientation, wrap, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, containerRef]);
};

/**
 * High contrast mode detection
 */
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = () => {
      setIsHighContrast(mediaQuery.matches);
    };

    handleChange(); // Check initial state
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

/**
 * Reduced motion detection
 */
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    handleChange(); // Check initial state
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
};
