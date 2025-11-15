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
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    // Cast to any because Prisma client types may be out of sync until `prisma generate` is run.
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
