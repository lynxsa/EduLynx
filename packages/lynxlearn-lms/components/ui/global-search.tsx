'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Command,
  FileText,
  MessageSquare,
  Search,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'course' | 'assignment' | 'resource' | 'message' | 'grade' | 'calendar' | 'ai-chat';
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onClose?: () => void;
}

// Mock search function - replace with actual API call
const searchAPI = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Mathematics Grade 12',
      subtitle: 'Calculus and Functions',
      type: 'course',
      url: '/courses/mathematics-grade-12',
    },
    {
      id: '2',
      title: 'Physical Science Assignment',
      subtitle: 'Due tomorrow',
      type: 'assignment',
      url: '/assignments/physics-motion',
    },
    {
      id: '3',
      title: 'English Literature Essay',
      subtitle: 'Shakespeare Analysis',
      type: 'assignment',
      url: '/assignments/english-essay',
    },
    {
      id: '4',
      title: 'Study Guide: Chemistry',
      subtitle: 'Organic compounds',
      type: 'resource',
      url: '/resources/chemistry-guide',
    },
    {
      id: '5',
      title: 'Ask ProfLynx about Algebra',
      subtitle: 'Get AI help with math problems',
      type: 'ai-chat',
      url: '/ai-tutor?topic=algebra',
    },
  ];

  return mockResults.filter(
    result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(query.toLowerCase())
  );
};

const getTypeIcon = (type: SearchResult['type']) => {
  const iconMap = {
    course: BookOpen,
    assignment: FileText,
    resource: Target,
    message: MessageSquare,
    grade: Trophy,
    calendar: Calendar,
    'ai-chat': Brain,
  };

  const Icon = iconMap[type] || Search;
  return <Icon className="w-4 h-4" />;
};

const getTypeColor = (type: SearchResult['type']) => {
  const colorMap = {
    course: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    assignment: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    resource: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    message: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    grade: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    calendar: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30',
    'ai-chat': 'text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/30',
  };

  return colorMap[type] || 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
};

export function GlobalSearch({ isOpen = false, onToggle, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lynxlearn-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search when query changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        searchAPI(query)
          .then(setResults)
          .finally(() => setIsLoading(false));
      } else {
        setResults([]);
      }
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

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
    onClose?.();
  }, [onToggle, onClose]);

  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      // Save to recent searches
      const newRecents = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecents);
      localStorage.setItem('lynxlearn-recent-searches', JSON.stringify(newRecents));

      // Navigate to the result page
      router.push(result.url);

      handleClose();
    },
    [query, recentSearches, router, handleClose]
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
          case 'Escape':
            e.preventDefault();
            handleClose();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onToggle, handleResultSelect, handleClose]);

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('lynxlearn-recent-searches');
  };

  const showEmptyState = !query.trim() && recentSearches.length === 0;
  const showRecents = !query.trim() && recentSearches.length > 0;

  if (!isOpen) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="search-trigger cursor-pointer"
        onClick={() => onToggle?.(true)}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">
            Search courses, assignments, resources...
          </span>
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
              placeholder="Search courses, assignments, resources..."
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            )}

            {showEmptyState && (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Search LynxLearn
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Find courses, assignments, resources, and more
                </p>
              </div>
            )}

            {showRecents && (
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
                <p className="text-sm text-gray-400 mt-1">
                  Try searching for courses, assignments, or resources
                </p>
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
                        ? 'bg-primary/10 dark:bg-primary/20'
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
