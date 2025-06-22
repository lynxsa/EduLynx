import { BookOpen, GraduationCap, School, Search, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchResult, useGlobalSearch } from '../../hooks/useGlobalSearch';

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  onResultSelect?: (result: SearchResult) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const typeIcons = {
  student: Users,
  teacher: GraduationCap,
  parent: Users,
  class: School,
  subject: BookOpen,
};

const typeLabels = {
  student: 'Student',
  teacher: 'Teacher',
  parent: 'Parent',
  class: 'Class',
  subject: 'Subject',
};

export function GlobalSearch({
  placeholder = 'Search students, teachers, classes...',
  className = '',
  onResultSelect,
  isOpen: externalIsOpen,
  onClose,
}: GlobalSearchProps) {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Use external isOpen prop if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const { query, setQuery, results, isLoading, error, clearSearch, hasResults, isEmpty } =
    useGlobalSearch({
      debounceMs: 300,
      minSearchLength: 2,
      maxResults: 10,
    });

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
    setSelectedIndex(-1);
    clearSearch();
    inputRef.current?.blur();
  }, [onClose, clearSearch]);

  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      onResultSelect?.(result);
      router.push(result.url);
      handleClose();
    },
    [onResultSelect, router, handleClose]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !hasResults) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, hasResults, results, selectedIndex, handleResultSelect, handleClose]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Only manage internal open state if not externally controlled
    if (externalIsOpen === undefined) {
      setInternalIsOpen(value.length > 0);
    }
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    if (query.length > 0 && externalIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
        />
        {query && (
          <button
            onClick={handleClose}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50
                     max-h-80 overflow-y-auto"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">Error: {error}</div>
          )}

          {isEmpty && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </div>
          )}

          {hasResults && (
            <div className="py-1">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                               flex items-center space-x-3 transition-colors duration-150
                               ${isSelected ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                  >
                    <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {typeLabels[result.type]}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
