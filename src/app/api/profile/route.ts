import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user profile based on role
    let userProfile;

    switch (payload.role.toLowerCase()) {
      case 'admin':
        userProfile = await prisma.admin.findUnique({
          where: { id: payload.userId },
        });
        break;

      case 'teacher':
        userProfile = await prisma.teacher.findUnique({
          where: { id: payload.userId },
          include: {
            subjects: true,
            lessons: true,
            class: true,
          },
        });
        break;

      case 'student':
        userProfile = await prisma.student.findUnique({
          where: { id: payload.userId },
          include: {
            class: {
              include: {
                grade: true,
              },
            },
            parent: true,
            attendances: {
              take: 10,
              orderBy: { date: 'desc' },
            },
            results: {
              take: 5,
              orderBy: { id: 'desc' },
              include: {
                exam: {
                  include: {
                    lesson: {
                      include: {
                        subject: true,
                      },
                    },
                  },
                },
                assignment: {
                  include: {
                    lesson: {
                      include: {
                        subject: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        break;

      case 'parent':
        userProfile = await prisma.parent.findUnique({
          where: { id: payload.userId },
          include: {
            students: {
              include: {
                class: {
                  include: {
                    grade: true,
                  },
                },
                attendances: {
                  take: 10,
                  orderBy: { date: 'desc' },
                },
                results: {
                  take: 5,
                  orderBy: { id: 'desc' },
                },
              },
            },
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
    }

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Add computed fields
    const profileWithExtras = {
      ...userProfile,
      role: payload.role,
      fullName:
        `${(userProfile as any).name || (userProfile as any).firstName || ''} ${(userProfile as any).surname || (userProfile as any).lastName || ''}`.trim(),
      lastLogin: new Date().toISOString(), // This would come from a session tracking system
    };

    return NextResponse.json({
      success: true,
      profile: profileWithExtras,
    });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
