// Performance optimization utilities for EduLynx LMS
'use client';

// Prefetch critical resources
export function prefetchCriticalResources() {
  if (typeof window !== 'undefined') {
    // Prefetch common course images
    const commonImages = [
      '/courses/mathematics.jpg',
      '/courses/physical-sciences.jpg',
      '/courses/life-sciences.jpg',
      '/courses/english.jpg',
      '/courses/afrikaans.jpg',
      '/courses/history.jpg',
    ];

    commonImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(callback: IntersectionObserverCallback) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.1,
    });
  }
  return null;
}

// Smooth scroll utility
export function smoothScrollTo(element: HTMLElement | string, offset = 0) {
  if (typeof window !== 'undefined') {
    const target =
      typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;

    if (target) {
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }
}

// Image loading optimization
export function optimizeImageLoading(img: HTMLImageElement) {
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  } else {
    // Fallback for browsers that don't support native lazy loading
    const observer = createIntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.classList.remove('loading-shimmer');
            observer?.unobserve(image);
          }
        }
      });
    });

    if (observer) {
      observer.observe(img);
    }
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
}

// Debounce utility for search and resize events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
