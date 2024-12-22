import { Injectable } from '@nestjs/common';
import { prisma } from '../../../prisma/client';
import { Email } from '@prisma/client';
import { Status } from 'src/types';
import * as client from 'prom-client'; // Import Prometheus client

@Injectable()
export class EmailsService {
  private readonly subscribeEmailCount = new client.Counter({
    name: 'subscribe_email_count',
    help: 'Total number of email subscriptions',
  });

  private readonly unsubscribeEmailCount = new client.Counter({
    name: 'unsubscribe_email_count',
    help: 'Total number of email unsubscriptions',
  });

  async addEmailToSubscribed(email: string): Promise<Email | null> {
    const response = await prisma.email.create({
      data: {
        email,
        status: Status.subscribed,
      },
    });

    this.subscribeEmailCount.inc();

    return response;
  }

  getEmails(): Promise<Email[]> {
    return prisma.email.findMany({});
  }

  async deleteEmail(email: string): Promise<Email> {
    const response = await prisma.email.update({
      where: { email, status: Status.subscribed },
      data: { status: Status.unsubscribed, deletedAt: new Date() },
    });

    this.unsubscribeEmailCount.inc();

    return response;
  }
}
