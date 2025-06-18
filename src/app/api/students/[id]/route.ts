import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Student } from '@/types/models';

function toStudentInterface(student: any): Student {
  return {
    ...student,
    createdAt: student.createdAt.toISOString(),
    birthday: student.birthday.toISOString(),
  };
}

// GET: Get student by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          address: true,
          occupation: true,
          relationshipToStudent: true,
        }
      },
      class: {
        include: {
          grade: true,
          supervisor: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
            }
          },
          lessons: {
            include: {
              subject: true,
              teacher: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                }
              }
            }
          }
        }
      },
      grade: true,
      results: {
        include: {
          exam: {
            include: {
              lesson: {
                include: {
                  subject: true
                }
              }
            }
          },
          assignment: {
            include: {
              lesson: {
                include: {
                  subject: true
                }
              }
            }
          }
        },
        orderBy: {
          id: 'desc'
        },
        take: 10 // Latest 10 results
      },
      attendances: {
        include: {
          lesson: {
            include: {
              subject: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        },
        take: 20 // Latest 20 attendance records
      },
      medicalRecord: true,
    },
  });
  
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Calculate attendance percentage
  const totalAttendances = student.attendances?.length || 0;
  const presentCount = student.attendances?.filter((a: any) => a.present).length || 0;
  const attendancePercentage = totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

  // Calculate average score
  const scores = student.results?.map((r: any) => r.score) || [];
  const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

  // Enhanced student data
  const enhancedStudent = {
    ...toStudentInterface(student),
    attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    averageScore: Math.round(averageScore * 100) / 100,
    totalResults: student.results?.length || 0,
    totalAttendances: totalAttendances,
    presentCount,
    absentCount: totalAttendances - presentCount,
    results: student.results?.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) || [],
    attendances: student.attendances?.map((a: any) => ({
      ...a,
      date: a.date.toISOString(),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })) || [],
  };

  return NextResponse.json(enhancedStudent);
}

// PUT: Update student by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const student = await prisma.student.update({
    where: { id: params.id },
    data: {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      gender: data.gender,
      homeLanguage: data.homeLanguage,
      allergies: data.allergies,
      medicalInfo: data.medicalInfo,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      guardianRelationship: data.guardianRelationship,
      specialNeeds: data.specialNeeds,
      extracurriculars: data.extracurriculars,
      admissionYear: data.admissionYear,
      status: data.status,
      profileImage: data.profileImage,
      birthday: data.birthday,
      parentId: data.parentId,
      classId: data.classId,
      gradeId: data.gradeId,
      schoolId: data.schoolId,
    },
  });
  return NextResponse.json(toStudentInterface(student));
}

// DELETE: Delete student by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.student.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
