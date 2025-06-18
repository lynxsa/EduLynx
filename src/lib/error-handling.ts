import { toast } from 'react-toastify';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR', isOperational: boolean = true) {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  public details?: any;
  
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
  }
}

/**
 * Handles API errors and displays appropriate user messages
 */
export function handleApiError(error: any): ApiError {
  console.error('API Error:', error);

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    const apiError: ApiError = {
      message: 'Network connection failed. Please check your internet connection.',
      status: 0,
      code: 'NETWORK_ERROR'
    };
    toast.error(apiError.message);
    return apiError;
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    const apiError: ApiError = {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details
    };
    
    if (error.status === 401) {
      toast.error('Please log in to continue');
      // Redirect to login if needed
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    } else if (error.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.status === 404) {
      toast.error('The requested resource was not found');
    } else if (error.status >= 500) {
      toast.error('A server error occurred. Please try again later.');
    } else {
      toast.error(error.message);
    }
    
    return apiError;
  }

  // Handle HTTP response errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    const apiError: ApiError = {
      message: data?.message || data?.error || getDefaultErrorMessage(status),
      status,
      code: data?.code || `HTTP_${status}`,
      details: data?.details
    };

    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    } else if (status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('The requested resource was not found.');
    } else if (status === 409) {
      toast.error('This action conflicts with existing data.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(apiError.message);
    }

    return apiError;
  }

  // Handle unknown errors
  const apiError: ApiError = {
    message: error.message || 'An unexpected error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR',
    details: error
  };

  toast.error(apiError.message);
  return apiError;
}

/**
 * Wrapper for API calls with automatic error handling
 */
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  customErrorHandler?: (error: ApiError) => void
): Promise<T | null> {
  try {
    return await apiFunction();
  } catch (error) {
    const apiError = handleApiError(error);
    
    if (customErrorHandler) {
      customErrorHandler(apiError);
    }
    
    return null;
  }
}

/**
 * Validates required fields in a form
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string[] {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (South African format)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitizes input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Formats currency for South African Rand
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats date for display
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Throttles a function call
 */
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

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Gets default error message for HTTP status codes
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Authentication required.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict with existing data.';
    case 422:
      return 'Validation failed.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error.';
    case 502:
      return 'Bad gateway.';
    case 503:
      return 'Service unavailable.';
    case 504:
      return 'Gateway timeout.';
    default:
      return 'An error occurred.';
  }
}
