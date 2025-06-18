import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      include: {
        student: {
          select: {
            name: true,
            surname: true,
            img: true,
          }
        }
      }
    });
    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error("[API_HEALTH_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      bloodType,
      allergies,
      medications,
      conditions,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      doctorName,
      doctorPhone,
      notes
    } = body;

    if (!studentId) {
      return new NextResponse("Student ID is required", { status: 400 });
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        studentId,
        bloodType,
        allergies,
        medications,
        conditions,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        doctorName,
        doctorPhone,
        notes
      }
    });

    return NextResponse.json(medicalRecord, { status: 201 });

  } catch (error) {
    console.error("[API_HEALTH_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
