// Accessibility utilities for EduLynx LMS
'use client';

// Focus management utilities
export class FocusManager {
  private static instance: FocusManager;
  private focusableElements: string =
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  // Trap focus within a container
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      this.focusableElements
    ) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Focus first focusable element in container
  focusFirst(container: HTMLElement): void {
    const firstFocusable = container.querySelector(this.focusableElements) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  // Get all focusable elements in container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableElements));
  }
}

// Keyboard navigation utilities
export const KeyboardUtils = {
  // Handle arrow key navigation in grids/lists
  handleArrowNavigation(e: KeyboardEvent, elements: HTMLElement[], currentIndex: number) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % elements.length;
        elements[nextIndex]?.focus();
        return nextIndex;

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        elements[prevIndex]?.focus();
        return prevIndex;

      case 'Home':
        e.preventDefault();
        elements[0]?.focus();
        return 0;

      case 'End':
        e.preventDefault();
        elements[elements.length - 1]?.focus();
        return elements.length - 1;

      default:
        return currentIndex;
    }
  },

  // Handle escape key
  handleEscape(e: KeyboardEvent, callback: () => void) {
    if (e.key === 'Escape') {
      e.preventDefault();
      callback();
    }
  },

  // Handle enter/space for button-like elements
  handleActivation(e: KeyboardEvent, callback: () => void) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
};

// Screen reader utilities
export const ScreenReaderUtils = {
  // Announce message to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Update aria-label dynamically
  updateAriaLabel(element: HTMLElement, label: string) {
    element.setAttribute('aria-label', label);
  },

  // Update aria-describedby
  updateAriaDescribedby(element: HTMLElement, descriptionId: string) {
    element.setAttribute('aria-describedby', descriptionId);
  },
};

// Color contrast utilities
export const ContrastUtils = {
  // Check if color contrast meets WCAG guidelines
  checkContrast(foreground: string, background: string): { ratio: number; passes: boolean } {
    // Simplified contrast calculation - in production, use a proper library
    const ratio = 4.5; // Placeholder - implement actual calculation
    const passes = ratio >= 4.5;
    return { ratio, passes };
  },

  // Get high contrast colors for themes
  getHighContrastColors() {
    return {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#0000FF',
      warning: '#FF0000',
      success: '#008000',
    };
  },
};

// Motion preferences
export const MotionUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  // Apply animation only if user doesn't prefer reduced motion
  conditionalAnimation(element: HTMLElement, animationClass: string) {
    if (!this.prefersReducedMotion()) {
      element.classList.add(animationClass);
    }
  },
};

// Form accessibility utilities
export const FormUtils = {
  // Add proper error announcements
  announceFormError(fieldName: string, errorMessage: string) {
    ScreenReaderUtils.announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive');
  },

  // Add proper success announcements
  announceFormSuccess(message: string) {
    ScreenReaderUtils.announce(message, 'polite');
  },

  // Associate labels and errors with form fields
  associateFieldsWithLabels(form: HTMLFormElement) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const label = form.querySelector(`label[for="${input.id}"]`);
      if (!label && input.id) {
        console.warn(`No label found for input with id: ${input.id}`);
      }
    });
  },
};

// ARIA utilities
export const AriaUtils = {
  // Toggle aria-expanded
  toggleExpanded(element: HTMLElement) {
    const current = element.getAttribute('aria-expanded') === 'true';
    element.setAttribute('aria-expanded', (!current).toString());
  },

  // Set aria-pressed for toggle buttons
  setPressed(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  // Set aria-selected for selectable items
  setSelected(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', selected.toString());
  },

  // Set aria-current for navigation
  setCurrent(
    element: HTMLElement,
    current: 'page' | 'step' | 'location' | 'date' | 'time' | boolean
  ) {
    if (typeof current === 'boolean') {
      element.setAttribute('aria-current', current.toString());
    } else {
      element.setAttribute('aria-current', current);
    }
  },
};

// Export main accessibility manager
export class AccessibilityManager {
  private focusManager: FocusManager;

  constructor() {
    this.focusManager = FocusManager.getInstance();
  }

  // Initialize accessibility features
  init() {
    this.addSkipLinks();
    this.setupKeyboardShortcuts();
    this.addHighContrastToggle();
  }

  // Add skip links for keyboard navigation
  private addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className =
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded';

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Setup global keyboard shortcuts
  private setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Alt + M: Focus main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      }

      // Alt + S: Focus search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="search" i]'
        ) as HTMLElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  // Add high contrast mode toggle
  private addHighContrastToggle() {
    const button = document.createElement('button');
    button.textContent = 'Toggle High Contrast';
    button.className =
      'fixed bottom-4 right-4 z-50 px-3 py-2 bg-gray-900 text-white rounded text-sm';
    button.setAttribute('aria-label', 'Toggle high contrast mode');

    button.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHighContrast = document.body.classList.contains('high-contrast');
      ScreenReaderUtils.announce(
        `High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`,
        'polite'
      );
    });

    document.body.appendChild(button);
  }
}
