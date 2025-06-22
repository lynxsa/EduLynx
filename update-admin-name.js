const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function updateAdminName() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Updating admin name to Derah Manyelo...');

    const hashedPassword = await bcrypt.hash('adminpass', 12);

    const updatedAdmin = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        firstName: 'Derah',
        lastName: 'Manyelo',
        preferredName: 'Derah',
        password: hashedPassword,
      },
      create: {
        email: 'admin@lynxacademy.co.za',
        firstName: 'Derah',
        lastName: 'Manyelo',
        preferredName: 'Derah',
        password: hashedPassword,
        phone: '+27-82-456-7890',
        addressLine1: '123 Vilakazi Street',
        addressLine2: 'Orlando West',
        city: 'Soweto',
        province: 'Gauteng',
        postalCode: '1804',
        country: 'South Africa',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin updated successfully:');
    console.log('   Name:', updatedAdmin.firstName, updatedAdmin.lastName);
    console.log('   Email:', updatedAdmin.email);
    console.log('   Role:', updatedAdmin.role);
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminName();
