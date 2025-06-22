'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface UseDataOptions {
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<T>;
  update: (id: string | number, item: Partial<T>) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
  total: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function useData<T extends { id: string | number }>(
  endpoint: string,
  options: UseDataOptions = {}
): UseDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);

  const buildUrl = useCallback(() => {
    const url = new URL(endpoint, window.location.origin);
    const searchParams = new URLSearchParams();

    if (options.searchQuery) {
      searchParams.append('search', options.searchQuery);
    }
    if (options.sortBy) {
      searchParams.append('sortBy', options.sortBy);
      searchParams.append('sortOrder', options.sortOrder || 'asc');
    }
    if (options.page) {
      searchParams.append('page', options.page.toString());
    }
    if (options.limit) {
      searchParams.append('limit', options.limit.toString());
    }
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    if (searchParams.toString()) {
      url.search = searchParams.toString();
    }

    return url.toString();
  }, [endpoint, options]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildUrl());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();

      if (result.success === false) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      setData(result.data || []);
      setTotal(result.total || result.data?.length || 0);
      setPage(result.page || 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [buildUrl, endpoint]);

  const create = useCallback(
    async (item: Omit<T, 'id'>): Promise<T> => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.success === false) {
          throw new Error(result.message || 'Failed to create item');
        }

        const newItem = Array.isArray(result.data) ? result.data[0] : (result.data as unknown as T);

        // Optimistically update local state
        setData(prev => [newItem, ...prev]);
        setTotal(prev => prev + 1);

        return newItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
        setError(errorMessage);
        throw err;
      }
    },
    [endpoint]
  );

  const update = useCallback(
    async (id: string | number, item: Partial<T>): Promise<T> => {
      try {
        const response = await fetch(`${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.success === false) {
          throw new Error(result.message || 'Failed to update item');
        }

        const updatedItem = Array.isArray(result.data)
          ? result.data[0]
          : (result.data as unknown as T);

        // Optimistically update local state
        setData(prev => prev.map(prevItem => (prevItem.id === id ? updatedItem : prevItem)));

        return updatedItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
        setError(errorMessage);
        throw err;
      }
    },
    [endpoint]
  );

  const deleteItem = useCallback(
    async (id: string | number): Promise<void> => {
      try {
        const response = await fetch(`${endpoint}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Optimistically update local state
        setData(prev => prev.filter(item => item.id !== id));
        setTotal(prev => prev - 1);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
        setError(errorMessage);
        throw err;
      }
    },
    [endpoint]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasNextPage = page * (options.limit || 10) < total;
  const hasPrevPage = page > 1;

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    delete: deleteItem,
    total,
    page,
    hasNextPage,
    hasPrevPage,
  };
}
