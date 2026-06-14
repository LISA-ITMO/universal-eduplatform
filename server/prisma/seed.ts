import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'testpassword';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log('Admin user already exists');
  } else {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hash,
        role: 'admin',
        isActive: true,
        firstName: 'Системный',
        lastName: 'Администратор',
        middleName: '',
        phone: null,
        lastLogin: null,
      } as any,
    });

    console.log('Default admin created (username: admin, password: testpassword)');
  }

  // Create AI bot user if env provided (or default)
  const botUsername = process.env.AI_BOT_USERNAME || 'ai_bot';
  const botEmail = process.env.AI_BOT_EMAIL || 'ai_bot@example.com';
  const botPassword = process.env.AI_BOT_PASSWORD || 'ai_bot_password';

  const existingBot = await prisma.user.findUnique({ where: { username: botUsername } });
  if (existingBot) {
    console.log('AI bot user already exists');
  } else {
    const botHash = await bcrypt.hash(botPassword, 10);
    await prisma.user.create({
      data: {
        username: botUsername,
        email: botEmail,
        passwordHash: botHash,
        role: 'student',
        isActive: true,
        firstName: 'AI',
        lastName: 'Assistant',
        middleName: '',
        phone: null,
        lastLogin: null,
      } as any,
    });

    console.log(`AI bot created (username: ${botUsername}, password: ${botPassword})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
