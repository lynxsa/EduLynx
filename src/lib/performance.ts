/**
 * Performance optimization utilities for EduLynx Dashboard
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Debounce hook for search inputs and other frequent updates
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Memoized search filter for large datasets
 */
export const useSearchFilter = <T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  searchKeys: (keyof T)[]
) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(item =>
      searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(subValue =>
            typeof subValue === 'string' && subValue.toLowerCase().includes(query)
          );
        }
        return false;
      })
    );
  }, [data, searchQuery, searchKeys]);
};

/**
 * Pagination hook for large datasets
 */
export const usePagination = <T,>(data: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  
  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Virtual scrolling for very large lists
 */
export const useVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );
  
  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleStart,
    visibleEnd,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

/**
 * Memoized sort function for table data
 */
export const useSortedData = <T extends Record<string, any>>(
  data: T[],
  sortKey: keyof T | null,
  sortDirection: 'asc' | 'desc' | null
) => {
  return useMemo(() => {
    if (!sortKey || !sortDirection) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      // Handle different data types
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (
        aValue != null && 
        bValue != null && 
        typeof aValue === 'object' && 
        typeof bValue === 'object' &&
        (aValue as any) instanceof Date && 
        (bValue as any) instanceof Date
      ) {
        comparison = (aValue as Date).getTime() - (bValue as Date).getTime();
      } else if (
        aValue && 
        bValue && 
        typeof aValue === 'object' && 
        typeof bValue === 'object' && 
        'getTime' in aValue && 
        'getTime' in bValue &&
        typeof (aValue as any).getTime === 'function' &&
        typeof (bValue as any).getTime === 'function'
      ) {
        // Handle Date-like objects
        comparison = (aValue as any).getTime() - (bValue as any).getTime();
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [data, sortKey, sortDirection]);
};

/**
 * Performance monitoring hook for development
 */
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        console.log(`${componentName} render time: ${end - start}ms`);
      };
    }
  });
};

/**
 * Memory-efficient image loading hook
 */
export const useImageLoader = (src: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  return { loaded, error };
};
