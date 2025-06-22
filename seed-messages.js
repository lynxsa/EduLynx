import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMessages() {
  try {
    // First, let's find some users to create messages between
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    if (users.length < 2) {
      console.log('Not enough users found to create messages');
      return;
    }

    console.log(`Found ${users.length} users, creating sample messages...`);

    const sampleMessages = [
      {
        subject: 'Welcome to EduLynx Messaging System',
        content:
          'Welcome to the new messaging system! You can now send and receive messages within the platform. This system supports different priority levels and message types.',
        priority: 'NORMAL',
        fromId: users[0].id,
        toId: users[1].id,
      },
      {
        subject: 'Important: Grade 12 Final Exam Schedule',
        content:
          'Please review the proposed exam schedule for Grade 12 students. The exams will begin on January 25th and continue through February 15th. We need your approval on the proposed time slots.',
        priority: 'HIGH',
        fromId: users[1].id,
        toId: users[0].id,
      },
      {
        subject: 'Parent-Teacher Conference Request',
        content:
          "I would like to schedule a meeting to discuss my child's progress in mathematics. Are you available sometime next week for a brief discussion?",
        priority: 'NORMAL',
        fromId: users[2]?.id || users[0].id,
        toId: users[0].id,
      },
      {
        subject: 'Student Absence Notification',
        content:
          'My daughter will be absent from school tomorrow due to a medical appointment. She will return on the following day. Please let me know if there are any important assignments she will miss.',
        priority: 'LOW',
        fromId: users[3]?.id || users[1].id,
        toId: users[0].id,
      },
      {
        subject: 'Equipment Request for Science Lab',
        content:
          "We need to order new laboratory equipment for the upcoming semester. The current microscopes are outdated and some beakers are cracked. I've prepared a detailed list of required items.",
        priority: 'HIGH',
        fromId: users[4]?.id || users[1].id,
        toId: users[0].id,
      },
    ];

    for (const messageData of sampleMessages) {
      const preview =
        messageData.content.length > 100
          ? messageData.content.substring(0, 100) + '...'
          : messageData.content;

      await prisma.message.create({
        data: {
          ...messageData,
          preview,
        },
      });
    }

    console.log('Sample messages created successfully!');

    // Show created messages
    const createdMessages = await prisma.message.findMany({
      include: {
        from: { select: { firstName: true, lastName: true } },
        to: { select: { firstName: true, lastName: true } },
      },
    });

    console.log('\nCreated messages:');
    createdMessages.forEach(msg => {
      console.log(
        `- ${msg.subject} (from ${msg.from.firstName} ${msg.from.lastName} to ${msg.to.firstName} ${msg.to.lastName})`
      );
    });
  } catch (error) {
    console.error('Error seeding messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMessages();
