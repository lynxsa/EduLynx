import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Student } from '@/types/models';
import { getRoleFromRequest } from '@/lib/auth';

function toStudentInterface(student: any): Student {
  return {
    ...student,
    createdAt: student.createdAt.toISOString(),
    birthday: student.birthday.toISOString(),
  };
}

// GET: List students with server-side pagination, attendance %, and avg score
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  let limit = parseInt(searchParams.get('limit') || '15', 10);
  if (limit > 50) limit = 50;
  const skip = (page - 1) * limit;

  // Role-based filtering
  const role = getRoleFromRequest(req);
  let userId: string | undefined;
  try {
    const sessionToken = req.cookies.get('__session')?.value;
    if (sessionToken) {
      const payload = JSON.parse(Buffer.from(sessionToken.split('.')[1], 'base64').toString());
      userId = payload?.id;
    }
  } catch {}

  let where: any = {};
  if (role === 'TEACHER' && userId) {
    // Teacher: students in their classes (many-to-many)
    const classes = await prisma.class.findMany({
      where: {
        teachers: {
          some: { id: userId }
        }
      },
      select: { id: true }
    });
    const classIds = classes.map(c => c.id);
    where = { classId: { in: classIds } };
  } else if (role === 'PARENT' && userId) {
    // Parent: their children
    where = { parentId: userId };
  } else if (role === 'STUDENT' && userId) {
    // Student: self only
    where = { id: userId };
  }
  // Admin: no filter (see all)

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: { parent: true, class: true, grade: true },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  // For each student, fetch attendance % and avg score
  const studentIds = students.map(s => s.id);
  // Attendance: count present/total per student
  const attendanceRecords = await prisma.attendance.findMany({
    where: { studentId: { in: studentIds } },
    select: { studentId: true, present: true },
  });
  // Score: get all results per student
  const resultRecords = await prisma.result.findMany({
    where: { studentId: { in: studentIds } },
    select: { studentId: true, score: true },
  });

  // Aggregate attendance and scores
  const attendanceMap: Record<string, { present: number; total: number }> = {};
  attendanceRecords.forEach(r => {
    if (!attendanceMap[r.studentId]) attendanceMap[r.studentId] = { present: 0, total: 0 };
    attendanceMap[r.studentId].total++;
    if (r.present) attendanceMap[r.studentId].present++;
  });
  const scoreMap: Record<string, { sum: number; count: number }> = {};
  resultRecords.forEach(r => {
    if (!scoreMap[r.studentId]) scoreMap[r.studentId] = { sum: 0, count: 0 };
    scoreMap[r.studentId].sum += r.score;
    scoreMap[r.studentId].count++;
  });

  // Attach to students
  const typedStudents = students.map(s => {
    const base = toStudentInterface(s);
    const att = attendanceMap[s.id] || { present: 0, total: 0 };
    const attendancePercent = att.total > 0 ? Math.round((att.present / att.total) * 100) : null;
    const score = scoreMap[s.id] || { sum: 0, count: 0 };
    const avgScore = score.count > 0 ? Math.round((score.sum / score.count) * 10) / 10 : null;
    return {
      ...base,
      attendancePercent,
      avgScore,
    };
  });
  return NextResponse.json({ data: typedStudents, total });
}

// POST: Create a new student
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const student = await prisma.student.create({
    data: {
      id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
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
