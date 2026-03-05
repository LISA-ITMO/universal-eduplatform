import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Retry connecting to the database for a while to handle cases where
    // Postgres is still starting when the app container begins initialization.
    const maxAttempts = 30;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        // connected
        return;
      } catch (err) {
        // Last attempt -> rethrow so Nest will fail fast
        if (attempt === maxAttempts) {
          throw err;
        }
        // otherwise wait and retry
        // eslint-disable-next-line no-console
        console.warn(`Prisma connect attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        // sleep
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}




