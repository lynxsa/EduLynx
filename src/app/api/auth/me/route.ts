import { NextRequest } from 'next/server';
import { withAuth, createResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    // Return the current user data
    return createResponse(user, 'User data retrieved successfully');
  });
}
