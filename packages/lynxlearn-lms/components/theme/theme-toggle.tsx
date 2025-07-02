'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <div className="h-8 w-8 p-0 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-8 p-0 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-8 p-0 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="h-8 w-8 p-0"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>

      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className="h-8 w-8 p-0"
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4" />
      </Button>

      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="h-8 w-8 p-0"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ThemeToggleSimple() {
  const { toggleTheme, effectiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 p-0 rounded bg-gray-200 dark:bg-gray-700" />;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0"
      aria-label={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {effectiveTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
