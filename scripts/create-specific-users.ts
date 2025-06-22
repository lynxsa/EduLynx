import { PrismaClient, UserRole, UserSex, Day } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function createSpecificUsers() {
  console.log('🚀 Creating specific user accounts...');

  try {
    // Create a default school if it doesn't exist
    let school = await prisma.school.findFirst();
    if (!school) {
      school = await prisma.school.create({
        data: {
          name: 'Lynx Academy',
          address: '123 Education Street',
          city: 'Cape Town',
          province: 'Western Cape',
          country: 'South Africa',
          principal: 'Dr. Smith',
          schoolType: 'private',
          registrationNumber: 'LA001',
          motto: 'Excellence in Education',
        },
      });
      console.log('✅ Created default school:', school.name);
    }

    // 1. Admin User
    const adminPassword = await hashPassword('adminpass');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        password: adminPassword,
        isActive: true,
      },
      create: {
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        schoolId: school.id,
        isActive: true,
      },
    });

    // Create corresponding Admin record
    await prisma.admin.upsert({
      where: { id: admin.id },
      update: { username: 'admin' },
      create: {
        id: admin.id,
        username: 'admin',
      },
    });

    console.log('✅ Created/Updated Admin user');

    // 2. Teacher User
    const teacherPassword = await hashPassword('teacherpass');
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {
        password: teacherPassword,
        isActive: true,
      },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'John',
        lastName: 'Teacher',
        role: UserRole.TEACHER,
        schoolId: school.id,
        phone: '+27123456789',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Male',
        isActive: true,
      },
    });

    // Create corresponding Teacher record
    await prisma.teacher.upsert({
      where: { id: teacher.id },
      update: {},
      create: {
        id: teacher.id,
        username: 'teacher1',
        name: 'John',
        surname: 'Teacher',
        email: 'teacher1@lynxacademy.co.za',
        phone: '+27123456789',
        address: '456 Teacher Avenue, Cape Town',
        bloodType: 'O+',
        sex: UserSex.MALE,
        gender: 'Male',
        nationality: 'South African',
        qualifications: 'BEd Mathematics, Honours',
        yearsExperience: 8,
        employmentStatus: 'permanent',
        birthday: new Date('1985-06-15'),
        schoolId: school.id,
        userId: teacher.id,
      },
    });

    console.log('✅ Created/Updated Teacher user');

    // 3. Parent User
    const parentPassword = await hashPassword('parentpass');
    const parent = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {
        password: parentPassword,
        isActive: true,
      },
      create: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPassword,
        firstName: 'Sarah',
        lastName: 'Parent',
        role: UserRole.PARENT,
        schoolId: school.id,
        phone: '+27987654321',
        dateOfBirth: new Date('1980-03-22'),
        gender: 'Female',
        isActive: true,
      },
    });

    // Create corresponding Parent record
    await prisma.parent.upsert({
      where: { id: parent.id },
      update: {},
      create: {
        id: parent.id,
        username: 'parent1',
        name: 'Sarah',
        surname: 'Parent',
        email: 'parent1@lynxacademy.co.za',
        phone: '+27987654321',
        address: '789 Parent Street, Cape Town',
        sex: UserSex.FEMALE,
        occupation: 'Engineer',
        employer: 'Tech Corp',
        relationshipToStudent: 'Mother',
        schoolId: school.id,
        userId: parent.id,
      },
    });

    console.log('✅ Created/Updated Parent user');

    // Create a grade and class for the student
    const grade = await prisma.grade.upsert({
      where: { level: 10 },
      update: {},
      create: {
        level: 10,
        schoolId: school.id,
      },
    });

    const class_ = await prisma.class.upsert({
      where: { name: 'Grade 10A' },
      update: {},
      create: {
        name: 'Grade 10A',
        capacity: 30,
        roomNumber: 'Room 101',
        gradeId: grade.id,
        schoolId: school.id,
      },
    });

    // 4. Student User
    const studentPassword = await hashPassword('studentpass');
    const student = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {
        password: studentPassword,
        isActive: true,
      },
      create: {
        email: 'student1@lynxacademy.co.za',
        password: studentPassword,
        firstName: 'Mike',
        lastName: 'Student',
        role: UserRole.STUDENT,
        schoolId: school.id,
        phone: '+27555123456',
        dateOfBirth: new Date('2007-09-10'),
        gender: 'Male',
        isActive: true,
      },
    });

    // Create corresponding Student record
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: {
        id: student.id,
        username: 'student1',
        name: 'Mike',
        surname: 'Student',
        email: 'student1@lynxacademy.co.za',
        phone: '+27555123456',
        address: '321 Student Road, Cape Town',
        bloodType: 'A+',
        sex: UserSex.MALE,
        gender: 'Male',
        homeLanguage: 'English',
        admissionYear: 2023,
        status: 'active',
        birthday: new Date('2007-09-10'),
        parentId: parent.id,
        classId: class_.id,
        gradeId: grade.id,
        schoolId: school.id,
        userId: student.id,
      },
    });

    console.log('✅ Created/Updated Student user');

    // Create some sample subjects
    const subjects = [
      { name: 'Mathematics' },
      { name: 'English' },
      { name: 'Science' },
      { name: 'History' },
      { name: 'Geography' },
    ];

    for (const subject of subjects) {
      await prisma.subject.upsert({
        where: { name: subject.name },
        update: {},
        create: subject,
      });
    }

    // Link teacher to Mathematics subject
    const mathSubject = await prisma.subject.findFirst({ where: { name: 'Mathematics' } });
    if (mathSubject) {
      await prisma.subjectToTeacher.upsert({
        where: {
          subjectId_teacherId: {
            subjectId: mathSubject.id,
            teacherId: teacher.id,
          },
        },
        update: {},
        create: {
          subjectId: mathSubject.id,
          teacherId: teacher.id,
        },
      });
    }

    // Create a sample lesson
    if (mathSubject) {
      await prisma.lesson.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          name: 'Algebra Basics',
          day: Day.MONDAY,
          startTime: new Date('2025-06-23T09:00:00Z'),
          endTime: new Date('2025-06-23T10:00:00Z'),
          subjectId: mathSubject.id,
          classId: class_.id,
          teacherId: teacher.id,
        },
      });
    }

    // Create some sample events
    await prisma.event.createMany({
      data: [
        {
          title: 'Mathematics Test',
          description: 'Algebra and Geometry assessment',
          startTime: new Date('2025-06-25T10:00:00Z'),
          endTime: new Date('2025-06-25T11:30:00Z'),
          classId: class_.id,
        },
        {
          title: 'Science Fair',
          description: 'Annual science project exhibition',
          startTime: new Date('2025-06-27T14:00:00Z'),
          endTime: new Date('2025-06-27T17:00:00Z'),
          classId: class_.id,
        },
        {
          title: 'Parent-Teacher Conference',
          description: 'Quarterly progress discussion',
          startTime: new Date('2025-06-30T15:00:00Z'),
          endTime: new Date('2025-06-30T18:00:00Z'),
          classId: class_.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Created sample data');
    console.log('\n🎉 Setup complete! You can now login with these credentials:');
    console.log('📧 Admin: admin@lynxacademy.co.za / adminpass');
    console.log('👨‍🏫 Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('👨‍👩‍👧‍👦 Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('🎓 Student: student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

async function main() {
  try {
    await createSpecificUsers();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
