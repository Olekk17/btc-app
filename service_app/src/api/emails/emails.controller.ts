import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
  Delete,
  Get,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
@Controller('api/emails')
export class EmailsController {
  constructor(private readonly subscriptionService: EmailsService) {}

  @Post()
  async addEmailToSubscribed(@Body() payload: { email: string }) {
    try {
      const response = await this.subscriptionService.addEmailToSubscribed(
        payload.email,
      );
      return response;
    } catch (e: unknown) {
      if (typeof e === 'object' && 'code' in e) {
        if (e['code'] === 'P2002') {
          throw new HttpException(
            'Email already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException(
        'Failed to add email to subscribed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete()
  async deleteEmail(@Body() payload: { email: string }) {
    try {
      const response = await this.subscriptionService.deleteEmail(
        payload.email,
      );
      return response;
    } catch {
      throw new HttpException('Failed to delete email', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getEmails() {
    try {
      const response = await this.subscriptionService.getEmails();
      return response;
    } catch {
      throw new HttpException('Failed to get emails', HttpStatus.BAD_REQUEST);
    }
  }
}
