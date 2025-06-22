import { useEffect, useMemo, useState } from 'react';
import { debounce } from '../lib/performance';

export interface SearchResult {
  id: string;
  title: string;
  type: 'student' | 'teacher' | 'parent' | 'class' | 'subject';
  subtitle?: string;
  avatar?: string;
  url: string;
}

export interface UseGlobalSearchOptions {
  debounceMs?: number;
  minSearchLength?: number;
  maxResults?: number;
}

export function useGlobalSearch(options: UseGlobalSearchOptions = {}) {
  const { debounceMs = 300, minSearchLength = 2, maxResults = 10 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length < minSearchLength) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}&limit=${maxResults}`
          );

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();
          setResults(data.results || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs),
    [debounceMs, minSearchLength, maxResults]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsLoading(false);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: query.length >= minSearchLength && results.length === 0 && !isLoading,
  };
}
