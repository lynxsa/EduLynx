import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed database...');

  try {
    // Create a school
    const school = await prisma.school.create({
      data: {
        name: 'Lynx Academy',
        address: '123 Education Street',
        city: 'Cape Town',
        province: 'Western Cape',
        country: 'South Africa',
        principal: 'Dr. Sarah Johnson',
        schoolType: 'private',
        registrationNumber: 'LA2024001',
        motto: 'Excellence Through Innovation',
        website: 'https://lynxacademy.edu.za',
      },
    });
    console.log('✅ School created:', school.name);

    // Create grades
    const grades = await Promise.all([
      prisma.grade.create({ data: { level: 8, schoolId: school.id } }),
      prisma.grade.create({ data: { level: 9, schoolId: school.id } }),
      prisma.grade.create({ data: { level: 10, schoolId: school.id } }),
      prisma.grade.create({ data: { level: 11, schoolId: school.id } }),
      prisma.grade.create({ data: { level: 12, schoolId: school.id } }),
    ]);
    console.log('✅ Grades created');

    // Create subjects
    const subjects = await Promise.all([
      prisma.subject.create({ data: { name: 'Mathematics' } }),
      prisma.subject.create({ data: { name: 'English' } }),
      prisma.subject.create({ data: { name: 'Physical Science' } }),
      prisma.subject.create({ data: { name: 'Life Sciences' } }),
      prisma.subject.create({ data: { name: 'History' } }),
      prisma.subject.create({ data: { name: 'Geography' } }),
      prisma.subject.create({ data: { name: 'Accounting' } }),
      prisma.subject.create({ data: { name: 'Business Studies' } }),
    ]);
    console.log('✅ Subjects created');

    // Create classes
    const classes = await Promise.all([
      prisma.class.create({
        data: {
          name: 'Grade 8A',
          capacity: 30,
          roomNumber: 'A101',
          gradeId: grades[0].id,
          schoolId: school.id,
        },
      }),
      prisma.class.create({
        data: {
          name: 'Grade 9B',
          capacity: 28,
          roomNumber: 'B201',
          gradeId: grades[1].id,
          schoolId: school.id,
        },
      }),
      prisma.class.create({
        data: {
          name: 'Grade 10C',
          capacity: 25,
          roomNumber: 'C301',
          gradeId: grades[2].id,
          schoolId: school.id,
        },
      }),
    ]);
    console.log('✅ Classes created');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@lynxacademy.edu.za',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        schoolId: school.id,
      },
    });
    console.log('✅ Admin user created');

    // Create teachers
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    const teachers = await Promise.all([
      // Math Teacher
      prisma.user.create({
        data: {
          email: 'john.smith@lynxacademy.edu.za',
          password: teacherPassword,
          firstName: 'John',
          lastName: 'Smith',
          role: 'TEACHER',
          schoolId: school.id,
          teacher: {
            create: {
              id: 'teacher_1',
              username: 'j.smith',
              name: 'John',
              surname: 'Smith',
              email: 'john.smith@lynxacademy.edu.za',
              phone: '+27821234567',
              address: '45 Oak Street, Cape Town',
              bloodType: 'O+',
              sex: 'MALE',
              birthday: new Date('1985-03-15'),
              qualifications: 'BSc Mathematics Education, PGCE',
              yearsExperience: 8,
              schoolId: school.id,
            },
          },
        },
        include: { teacher: true },
      }),
      // English Teacher
      prisma.user.create({
        data: {
          email: 'mary.johnson@lynxacademy.edu.za',
          password: teacherPassword,
          firstName: 'Mary',
          lastName: 'Johnson',
          role: 'TEACHER',
          schoolId: school.id,
          teacher: {
            create: {
              id: 'teacher_2',
              username: 'm.johnson',
              name: 'Mary',
              surname: 'Johnson',
              email: 'mary.johnson@lynxacademy.edu.za',
              phone: '+27827654321',
              address: '78 Pine Avenue, Cape Town',
              bloodType: 'A+',
              sex: 'FEMALE',
              birthday: new Date('1982-07-22'),
              qualifications: 'BA English Literature, PGCE',
              yearsExperience: 12,
              schoolId: school.id,
            },
          },
        },
        include: { teacher: true },
      }),
    ]);
    console.log('✅ Teachers created');

    // Assign teachers to subjects
    await Promise.all([
      prisma.subjectToTeacher.create({
        data: {
          teacherId: teachers[0].teacher!.id,
          subjectId: subjects[0].id, // Mathematics
        },
      }),
      prisma.subjectToTeacher.create({
        data: {
          teacherId: teachers[1].teacher!.id,
          subjectId: subjects[1].id, // English
        },
      }),
    ]);
    console.log('✅ Teacher-Subject assignments created');

    // Create parents and students
    const parentPassword = await bcrypt.hash('parent123', 12);
    const studentPassword = await bcrypt.hash('student123', 12);

    const parent1 = await prisma.user.create({
      data: {
        email: 'david.wilson@gmail.com',
        password: parentPassword,
        firstName: 'David',
        lastName: 'Wilson',
        role: 'PARENT',
        schoolId: school.id,
        parent: {
          create: {
            id: 'parent_1',
            username: 'd.wilson',
            name: 'David',
            surname: 'Wilson',
            email: 'david.wilson@gmail.com',
            phone: '+27833456789',
            address: '123 Elm Street, Cape Town',
            sex: 'MALE',
            occupation: 'Software Engineer',
            employer: 'Tech Solutions',
            schoolId: school.id,
          },
        },
      },
      include: { parent: true },
    });

    // Create students
    const students = await Promise.all([
      prisma.user.create({
        data: {
          email: 'emma.wilson@lynxacademy.edu.za',
          password: studentPassword,
          firstName: 'Emma',
          lastName: 'Wilson',
          role: 'STUDENT',
          schoolId: school.id,
          student: {
            create: {
              username: 'e.wilson',
              name: 'Emma',
              surname: 'Wilson',
              email: 'emma.wilson@lynxacademy.edu.za',
              phone: '+27834567890',
              address: '123 Elm Street, Cape Town',
              bloodType: 'B+',
              sex: 'FEMALE',
              gender: 'Female',
              birthday: new Date('2010-05-12'),
              parentId: parent1.parent!.id,
              classId: classes[0].id,
              gradeId: grades[0].id,
              schoolId: school.id,
              homeLanguage: 'English',
              admissionYear: 2024,
              status: 'active',
            },
          },
        },
        include: { student: true },
      }),
      prisma.user.create({
        data: {
          email: 'james.smith@lynxacademy.edu.za',
          password: studentPassword,
          firstName: 'James',
          lastName: 'Smith',
          role: 'STUDENT',
          schoolId: school.id,
          student: {
            create: {
              username: 'j.smith.student',
              name: 'James',
              surname: 'Smith',
              email: 'james.smith@lynxacademy.edu.za',
              phone: '+27835678901',
              address: '456 Maple Drive, Cape Town',
              bloodType: 'O-',
              sex: 'MALE',
              gender: 'Male',
              birthday: new Date('2009-09-18'),
              classId: classes[1].id,
              gradeId: grades[1].id,
              schoolId: school.id,
              homeLanguage: 'English',
              admissionYear: 2023,
              status: 'active',
            },
          },
        },
        include: { student: true },
      }),
    ]);
    console.log('✅ Students and parents created');

    // Create some lessons
    const lessons = await Promise.all([
      prisma.lesson.create({
        data: {
          name: 'Algebra Basics',
          day: 'MONDAY',
          startTime: new Date('2024-01-01T08:00:00Z'),
          endTime: new Date('2024-01-01T09:00:00Z'),
          subjectId: subjects[0].id,
          classId: classes[0].id,
          teacherId: teachers[0].teacher!.id,
        },
      }),
      prisma.lesson.create({
        data: {
          name: 'Creative Writing',
          day: 'TUESDAY',
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T11:00:00Z'),
          subjectId: subjects[1].id,
          classId: classes[0].id,
          teacherId: teachers[1].teacher!.id,
        },
      }),
    ]);
    console.log('✅ Lessons created');

    // Create some events
    const events = await Promise.all([
      prisma.event.create({
        data: {
          title: 'School Sports Day',
          description: 'Annual sports competition for all grades',
          startTime: new Date('2025-07-15T08:00:00Z'),
          endTime: new Date('2025-07-15T15:00:00Z'),
          classId: null, // School-wide event
        },
      }),
      prisma.event.create({
        data: {
          title: 'Grade 8A Science Fair',
          description: 'Students showcase their science projects',
          startTime: new Date('2025-07-20T13:00:00Z'),
          endTime: new Date('2025-07-20T16:00:00Z'),
          classId: classes[0].id,
        },
      }),
      prisma.event.create({
        data: {
          title: 'Parent-Teacher Conference',
          description: 'Meet with teachers to discuss student progress',
          startTime: new Date('2025-07-25T18:00:00Z'),
          endTime: new Date('2025-07-25T20:00:00Z'),
          classId: null,
        },
      }),
    ]);
    console.log('✅ Events created');

    // Create some assignments
    const assignments = await Promise.all([
      prisma.assignment.create({
        data: {
          title: 'Quadratic Equations Practice',
          startDate: new Date('2025-06-20T00:00:00Z'),
          dueDate: new Date('2025-06-27T23:59:00Z'),
          lessonId: lessons[0].id,
        },
      }),
      prisma.assignment.create({
        data: {
          title: 'Essay: My Summer Vacation',
          startDate: new Date('2025-06-21T00:00:00Z'),
          dueDate: new Date('2025-06-28T23:59:00Z'),
          lessonId: lessons[1].id,
        },
      }),
    ]);
    console.log('✅ Assignments created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📧 Login credentials:');
    console.log('Admin: admin@lynxacademy.edu.za / admin123');
    console.log('Teacher: john.smith@lynxacademy.edu.za / teacher123');
    console.log('Parent: david.wilson@gmail.com / parent123');
    console.log('Student: emma.wilson@lynxacademy.edu.za / student123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
