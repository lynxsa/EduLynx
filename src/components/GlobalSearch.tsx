'use client';

import { useEscapeKey, useFocusTrap } from '@/lib/accessibility';
import { useDebounce } from '@/lib/performance';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Clock, Command, Filter, GraduationCap, Search, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type:
    | 'student'
    | 'teacher'
    | 'parent'
    | 'class'
    | 'subject'
    | 'announcement'
    | 'event'
    | 'assignment';
  url: string;
  metadata?: Record<string, any>;
}

interface APISearchResult {
  type: string;
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

interface GlobalSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

// Real search function that calls the API
const searchAPI = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();

    // Transform API results to match component interface
    return data.results.map(
      (result: APISearchResult): SearchResult => ({
        id: result.id,
        title: result.name,
        subtitle: result.subtitle,
        type: result.type as SearchResult['type'],
        url: result.href,
        metadata: {},
      })
    );
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
};

const getTypeIcon = (type: SearchResult['type']) => {
  const iconMap = {
    student: GraduationCap,
    teacher: Users,
    parent: Users,
    class: BookOpen,
    subject: BookOpen,
    announcement: Filter,
    event: Clock,
    assignment: BookOpen,
  };

  const Icon = iconMap[type];
  return <Icon className="w-4 h-4" />;
};

const getTypeColor = (type: SearchResult['type']) => {
  const colorMap = {
    student: 'text-blue-600 bg-blue-100',
    teacher: 'text-green-600 bg-green-100',
    parent: 'text-purple-600 bg-purple-100',
    class: 'text-orange-600 bg-orange-100',
    subject: 'text-indigo-600 bg-indigo-100',
    announcement: 'text-red-600 bg-red-100',
    event: 'text-yellow-600 bg-yellow-100',
    assignment: 'text-pink-600 bg-pink-100',
  };

  return colorMap[type] || 'text-gray-600 bg-gray-100';
};

export function GlobalSearch({
  onResultSelect,
  placeholder = 'Search students, teachers, classes...',
  isOpen = false,
  onToggle,
  className = '',
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus trap for accessibility
  const focusTrapRef = useFocusTrap(isOpen);

  // Close on escape key
  useEscapeKey(() => {
    if (isOpen) {
      handleClose();
    }
  }, isOpen);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('edulynx-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      searchAPI(debouncedQuery)
        .then(setResults)
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    onToggle?.(false);
  }, [onToggle]);

  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      // Save to recent searches
      const newRecents = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecents);
      localStorage.setItem('edulynx-recent-searches', JSON.stringify(newRecents));

      // Navigate to the result page
      router.push(result.url);

      // Call custom handler if provided
      onResultSelect?.(result);
      handleClose();
    },
    [query, recentSearches, router, onResultSelect, handleClose]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onToggle?.(!isOpen);
      }

      if (isOpen) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
              handleResultSelect(results[selectedIndex]);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onToggle, handleResultSelect]);

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('edulynx-recent-searches');
  };

  const showEmptyState = useMemo(() => {
    return !query.trim() && recentSearches.length === 0;
  }, [query, recentSearches]);

  const showRecents = useMemo(() => {
    return !query.trim() && recentSearches.length > 0;
  }, [query, recentSearches]);

  if (!isOpen) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`search-trigger ${className}`}
        onClick={() => onToggle?.(true)}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">{placeholder}</span>
          <kbd className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
        onClick={handleClose}
      >
        <motion.div
          ref={focusTrapRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-lg bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500"
            />
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            )}

            {!isLoading && showEmptyState && (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Search EduLynx
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Find students, teachers, classes, and more
                </p>
              </div>
            )}

            {!isLoading && showRecents && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultSelect(result)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-4 ${
                      selectedIndex === index
                        ? 'bg-purple-50 dark:bg-purple-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{result.type}</div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GlobalSearch;
