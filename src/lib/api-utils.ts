import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, TokenPayload, hasPermission } from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

export function createResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function createErrorResponse(
  error: string,
  status: number = 400,
  errors?: string[]
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      errors,
    },
    { status }
  );
}

export function createValidationErrorResponse(errors: string[]): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 400 }
  );
}

export function createUnauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized access',
    },
    { status: 401 }
  );
}

export function createForbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Forbidden - insufficient permissions',
    },
    { status: 403 }
  );
}

export function createNotFoundResponse(resource: string = 'Resource'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
    },
    { status: 404 }
  );
}

export function createServerErrorResponse(
  error: string = 'Internal server error'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 500 }
  );
}

// Middleware for API routes
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return createUnauthorizedResponse();
    }

    return await handler(request, user);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return createServerErrorResponse();
  }
}

export async function withRoles(
  request: NextRequest,
  requiredRoles: string[],
  handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, user) => {
    if (!hasPermission(user.role, requiredRoles)) {
      return createForbiddenResponse();
    }

    return await handler(req, user);
  });
}

// Request validation utilities
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (data: any) => { isValid: boolean; errors: string[]; data?: T }
): Promise<{ isValid: boolean; errors: string[]; data?: T }> {
  try {
    const body = await request.json();
    return validator(body);
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid JSON in request body'],
    };
  }
}

// Pagination utilities
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    success: true,
    data: {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
}

// Search and filter utilities
export function getSearchParams(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = url.searchParams.get('sortOrder') || 'desc';
  const filters: Record<string, string> = {};

  // Extract filter parameters (anything that starts with 'filter_')
  url.searchParams.forEach((value, key) => {
    if (key.startsWith('filter_')) {
      const filterKey = key.replace('filter_', '');
      filters[filterKey] = value;
    }
  });

  return { search, sortBy, sortOrder, filters };
}
