import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // create application context so providers/processors are initialized
  const appContext = await NestFactory.createApplicationContext(AppModule);
  // Keep process alive
  // eslint-disable-next-line no-console
  console.log('Worker application context started. Analytics processors should be active.');

  // handle graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((s) => process.on(s, async () => {
    // eslint-disable-next-line no-console
    console.log(`Received ${s}, closing worker...`);
    await appContext.close();
    process.exit(0);
  }));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Worker failed to bootstrap', err);
  process.exit(1);
});
