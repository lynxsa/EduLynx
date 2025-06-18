// Script to create specific demo accounts for EduLynx
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createDemoAccounts() {
  console.log('Creating demo accounts...')
  
  try {
    // Get the school
    const school = await prisma.school.findFirst({
      where: { name: 'LYNX Academy' }
    })
    
    if (!school) {
      console.error('School not found. Please run the main seed first.')
      return
    }
    
    // Hash passwords
    const adminPass = await bcrypt.hash('adminpass', 12)
    const teacherPass = await bcrypt.hash('teacherpass', 12)
    const parentPass = await bcrypt.hash('parentpass', 12)
    const studentPass = await bcrypt.hash('studentpass', 12)
    
    // Create demo accounts
    const demoAccounts = [
      {
        email: 'admin@lynxacademy.co.za',
        password: adminPass,
        firstName: 'Admin',
        lastName: 'Demo',
        role: 'ADMIN',
        schoolId: school.id,
      },
      {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPass,
        firstName: 'Teacher',
        lastName: 'Demo',
        role: 'TEACHER',
        schoolId: school.id,
      },
      {
        email: 'parent1@lynxacademy.co.za',
        password: parentPass,
        firstName: 'Parent',
        lastName: 'Demo',
        role: 'PARENT',
        schoolId: school.id,
      },
      {
        email: 'student1@lynxacademy.co.za',
        password: studentPass,
        firstName: 'Student',
        lastName: 'Demo',
        role: 'STUDENT',
        schoolId: school.id,
      }
    ]
    
    for (const account of demoAccounts) {
      const user = await prisma.user.upsert({
        where: { email: account.email },
        update: {
          password: account.password,
          firstName: account.firstName,
          lastName: account.lastName,
          role: account.role as any,
        },
        create: account as any
      })
      
      console.log(`✅ Created ${account.role.toLowerCase()} account: ${account.email}`)
    }
    
    console.log('✅ All demo accounts created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating demo accounts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoAccounts()
