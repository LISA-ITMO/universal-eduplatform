import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // TODO: Implement email sending (SMTP/SendGrid)
    console.log(`Sending email to ${to}: ${subject}`);
  }

  async sendSMS(to: string, message: string): Promise<void> {
    // TODO: Implement SMS sending (Twilio)
    console.log(`Sending SMS to ${to}: ${message}`);
  }

  async sendOTPEmail(to: string, code: string): Promise<void> {
    await this.sendEmail(to, 'Your OTP Code', `Your OTP code is: ${code}`);
  }

  async sendOTPSMS(to: string, code: string): Promise<void> {
    await this.sendSMS(to, `Your OTP code is: ${code}`);
  }
}




