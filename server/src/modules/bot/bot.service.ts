import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}

  async validateServiceKey(keyHash: string): Promise<boolean> {
    const serviceKey = await this.prisma.serviceKey.findFirst({
      where: {
        keyHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!serviceKey;
  }

  async processAnalytics() {
    // TODO: Implement background analytics processing
    console.log('Processing analytics...');
  }
}




