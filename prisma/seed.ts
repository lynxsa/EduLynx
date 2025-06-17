// prisma/seed.ts
import { PrismaClient, UserSex, Day } from '@prisma/client'
const prisma = new PrismaClient()

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  // 1) ADMINS
  await prisma.admin.createMany({
    data: [
      { id: 'a001', username: 'lynx_head' },
      { id: 'a002', username: 'lynx_ops' },
    ],
    skipDuplicates: true,
  })

  // 2) GRADES 8–12
  const grades = []
  for (let lvl = 8; lvl <= 12; lvl++) {
    grades.push(
      await prisma.grade.upsert({
        where: { level: lvl },
        update: {},
        create: { level: lvl },
      })
    )
  }

  // 3) CLASSES: A–E per grade → 25 total
  const classes = []
  for (const grade of grades) {
    for (const suffix of ['A', 'B', 'C', 'D', 'E']) {
      classes.push(
        await prisma.class.upsert({
          where: { name: `${grade.level}${suffix}` },
          update: {},
          create: {
            name: `${grade.level}${suffix}`,
            capacity: 30,
            gradeId: grade.id,
          },
        })
      )
    }
  }

  // 4) SUBJECTS (20)
  const subjectNames = [
    'Mathematics', 'English', 'Afrikaans', 'Physical Sciences', 'Life Sciences',
    'Accounting', 'Business Studies', 'Economics', 'History', 'Geography',
    'Life Orientation', 'Consumer Studies', 'Visual Arts', 'Music',
    'Industrial Technology', 'Agricultural Science',
    'Computer Applications Technology', 'Information Technology',
    'Design', 'Civil Technology',
  ]
  const subjects = []
  for (const name of subjectNames) {
    subjects.push(
      await prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  }

  // 5) TEACHERS & SUBJECT-TO-TEACHER (2 teachers per subject = 40)
  const tf = ['Sipho', 'Naledi', 'Teboho', 'Lerato', 'Thabo', 'Mpho', 'Anele', 'Nomsa', 'Tumelo', 'Karabo']
  const tl = ['Dlamini', 'Mokgobu', 'Nkosi', 'Mahlangu', 'Mokoena', 'Radebe', 'Zulu', 'Mbatha', 'Mkhize', 'Khoza']
  const teachers = []
  let tc = 1
  for (const subj of subjects) {
    for (let i = 0; i < 2; i++, tc++) {
      const fn = rand(tf), ln = rand(tl)
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${tc}@lynxacademy.co.za`
      const t = await prisma.teacher.upsert({
        where: { email },
        update: {},
        create: {
          id: `t${String(tc).padStart(3, '0')}`,
          username: `teacher${tc}`,
          name: fn,
          surname: ln,
          email,
          phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          address: '86 Jubilee Road, Johannesburg',
          bloodType: rand(['A+', 'B+', 'O+', 'AB+']),
          sex: rand([UserSex.MALE, UserSex.FEMALE]),
          birthday: new Date(1970 + Math.floor(Math.random() * 25), 0, 1),
          classId: rand(classes).id,
        },
      })
      teachers.push(t)
      await prisma.subjectToTeacher.upsert({
        where: {
          subjectId_teacherId: {
            subjectId: subj.id,
            teacherId: t.id,
          }
        },
        update: {},
        create: {
          subjectId: subj.id,
          teacherId: t.id,
        }
      })
    }
  }

  // Build subject → [teacherIds]
  const subjMap = new Map<number, string[]>()
  const rels = await prisma.subjectToTeacher.findMany()
  rels.forEach(r => {
    const arr = subjMap.get(r.subjectId) ?? []
    arr.push(r.teacherId)
    subjMap.set(r.subjectId, arr)
  })

  // 6) PARENTS (625)
  const pf = ['Linda', 'Peter', 'Angela', 'Thandi', 'David', 'Refilwe', 'Kgomotso', 'Siphelele']
  const pl = ['Mthetwa', 'Van Zyl', 'Nkuna', 'Khumalo', 'Mabuza', 'Baloyi', 'Mokoena', 'Moloi']
  const parents = []
  for (let i = 1; i <= 625; i++) {
    const fn = rand(pf), ln = rand(pl)
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@lynxacademy.co.za`
    parents.push(
      await prisma.parent.upsert({
        where: { email },
        update: {},
        create: {
          id: `p${String(i).padStart(3, '0')}`,
          username: `parent${i}`,
          name: fn,
          surname: ln,
          email,
          phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          address: '86 Jubilee Road, Johannesburg',
          sex: rand([UserSex.MALE, UserSex.FEMALE]),
        }
      })
    )
  }

  // 7) STUDENTS (625 = 25 per class)
  const sf = ['Keletso', 'Liam', 'Zanele', 'Mpho', 'Ntombi', 'Sipho', 'Kabelo', 'Amanda']
  const sl = ['Khosa', 'Mphahlele', 'Seboko', 'Tshabalala', 'Ngcobo', 'Mthembu', 'Dube', 'Khoza']
  const students = []
  let sc = 1
  for (const cls of classes) {
    for (let j = 0; j < 25; j++, sc++) {
      const fn = rand(sf), ln = rand(sl)
      const parent = parents[sc - 1]
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${sc}@lynxacademy.co.za`
      students.push(
        await prisma.student.upsert({
          where: { email },
          update: {},
          create: {
            id: `s${String(sc).padStart(3, '0')}`,
            username: `student${sc}`,
            name: fn,
            surname: ln,
            email,
            phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
            address: '86 Jubilee Road, Johannesburg',
            bloodType: rand(['A+', 'B+', 'O+', 'AB+']),
            sex: rand([UserSex.MALE, UserSex.FEMALE]),
            birthday: new Date(2005 + Math.floor(Math.random() * 5), 0, 1),
            parentId: parent.id,
            classId: cls.id,
            gradeId: cls.gradeId,
          }
        })
      )
    }
  }

  // 8) LESSONS (25×20=500)
  const lessons = []
  for (const cls of classes) {
    for (const subj of subjects) {
      const tIds = subjMap.get(subj.id)!
      lessons.push(
        await prisma.lesson.create({
          data: {
            name: `${subj.name} Lesson`,
            day: rand(Object.values(Day)),
            startTime: new Date(2025, 5, 1, 8, 0),
            endTime: new Date(2025, 5, 1, 9, 0),
            subjectId: subj.id,
            classId: cls.id,
            teacherId: rand(tIds),
          }
        })
      )
    }
  }

  // 9) EXAMS & ASSIGNMENTS (500 each) + RESULTS (625×2 per lesson = 1250)
  for (const lesson of lessons) {
    const exam = await prisma.exam.create({
      data: {
        title: `${lesson.name} Exam`,
        startTime: new Date(2025, 5, 15, 9, 0),
        endTime: new Date(2025, 5, 15, 11, 0),
        lessonId: lesson.id,
      }
    })
    const assignment = await prisma.assignment.create({
      data: {
        title: `${lesson.name} Assignment`,
        startDate: new Date(2025, 5, 2),
        dueDate: new Date(2025, 5, 9),
        lessonId: lesson.id,
      }
    })
    const clsStus = students.filter(s => s.classId === lesson.classId)
    for (const stu of clsStus) {
      await prisma.result.create({
        data: {
          examId: exam.id,
          assignmentId: assignment.id,
          studentId: stu.id,
          score: Math.floor(50 + Math.random() * 50),
        }
      })
    }
  }

  // 10) ATTENDANCE: one per student per lesson
  for (const lesson of lessons) {
    const clsStus = students.filter(s => s.classId === lesson.classId)
    for (const stu of clsStus) {
      await prisma.attendance.create({
        data: {
          lessonId: lesson.id,
          studentId: stu.id,
          present: Math.random() > 0.1,
        }
      })
    }
  }

  // 11) ANNOUNCEMENTS & EVENTS (2 each per class = 50)
  for (const cls of classes) {
    for (let i = 1; i <= 2; i++) {
      await prisma.announcement.create({
        data: {
          title: `Notice ${i} for ${cls.name}`,
          description: `This is announcement ${i} for class ${cls.name}.`,
          classId: cls.id,
        }
      })
      await prisma.event.create({
        data: {
          title: `Event ${i} for ${cls.name}`,
          description: `Details of event ${i} for class ${cls.name}.`,
          startTime: new Date(2025, 5, 20 + i, 10, 0),
          endTime: new Date(2025, 5, 20 + i, 12, 0),
          classId: cls.id,
        }
      })
    }
  }

  console.log('✅ Seed complete — All tables populated!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
