/**
 * Formatting utilities for EduLynx application
 * Includes currency, date, number, and text formatting functions
 */

/**
 * Formats a number as South African Rand (ZAR) currency
 * @param amount - The amount to format
 * @param options - Additional formatting options
 * @returns Formatted currency string (e.g., "R 1,234.56")
 */
export function formatZAR(
  amount: number,
  options: {
    showDecimals?: boolean;
    showCurrencyCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    showDecimals = true,
    showCurrencyCode = false,
    minimumFractionDigits = showDecimals ? 2 : 0,
    maximumFractionDigits = showDecimals ? 2 : 0,
  } = options;

  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: showCurrencyCode ? 'code' : 'symbol',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(amount);
}

/**
 * Formats a number with thousand separators
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a percentage
 * @param value - The decimal value (e.g., 0.75 for 75%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string (e.g., "75.0%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a date in South African locale
 * @param date - The date to format
 * @param format - The format type
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const dateObj = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat('en-ZA', options).format(dateObj);
}

/**
 * Formats a time in South African locale
 * @param date - The date/time to format
 * @param format - The format type
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | number, format: '12' | '24' = '24'): string {
  const dateObj = new Date(date);

  return new Intl.DateTimeFormat('en-ZA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12',
  }).format(dateObj);
}

/**
 * Formats a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - The date to compare
 * @param baseDate - The base date to compare against (defaults to now)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date | string | number,
  baseDate: Date = new Date()
): string {
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((dateObj.getTime() - baseDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en-ZA', { numeric: 'auto' });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2628000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ] as const;

  for (const { unit, seconds } of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Formats a file size in human-readable format
 * @param bytes - The size in bytes
 * @returns Formatted size string (e.g., "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Formats a grade or mark with appropriate styling classes
 * @param score - The score (0-100)
 * @param total - The total possible score (defaults to 100)
 * @returns Object with formatted percentage and styling class
 */
export function formatGrade(
  score: number,
  total: number = 100
): {
  percentage: string;
  letter: string;
  className: string;
  status: 'excellent' | 'good' | 'average' | 'poor' | 'fail';
} {
  const percentage = (score / total) * 100;

  let letter: string;
  let status: 'excellent' | 'good' | 'average' | 'poor' | 'fail';
  let className: string;

  if (percentage >= 90) {
    letter = 'A+';
    status = 'excellent';
    className = 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
  } else if (percentage >= 80) {
    letter = 'A';
    status = 'excellent';
    className = 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
  } else if (percentage >= 70) {
    letter = 'B';
    status = 'good';
    className = 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
  } else if (percentage >= 60) {
    letter = 'C';
    status = 'average';
    className = 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
  } else if (percentage >= 50) {
    letter = 'D';
    status = 'poor';
    className = 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
  } else {
    letter = 'F';
    status = 'fail';
    className = 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
  }

  return {
    percentage: formatPercentage(percentage / 100),
    letter,
    className,
    status,
  };
}

/**
 * Formats a student ID with proper padding
 * @param id - The student ID number
 * @param prefix - Prefix for the ID (e.g., "STU")
 * @param length - Total length of the numeric part
 * @returns Formatted student ID (e.g., "STU00123")
 */
export function formatStudentId(
  id: number | string,
  prefix: string = 'STU',
  length: number = 5
): string {
  const numStr = id.toString().padStart(length, '0');
  return `${prefix}${numStr}`;
}

/**
 * Formats a phone number for South African format
 * @param phone - The phone number
 * @returns Formatted phone number (e.g., "+27 12 345 6789")
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle South African numbers
  if (digits.startsWith('27')) {
    // International format: +27 XX XXX XXXX
    const match = digits.match(/^27(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `+27 ${match[1]} ${match[2]} ${match[3]}`;
    }
  } else if (digits.startsWith('0')) {
    // Local format: 0XX XXX XXXX
    const match = digits.match(/^0(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `0${match[1]} ${match[2]} ${match[3]}`;
    }
  }

  // Return original if no match
  return phone;
}

const formatUtils = {
  formatZAR,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatRelativeTime,
  truncateText,
  formatFileSize,
  formatGrade,
  formatStudentId,
  formatPhoneNumber,
};

export default formatUtils;
