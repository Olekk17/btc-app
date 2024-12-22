import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { prisma } from '../../../prisma/client';
import { Status } from 'src/types';

@Injectable()
export class RateService {
  private readonly BTC_RATE_API =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah';

  async fetchBtcRate(): Promise<number> {
    try {
      const response = await axios.get(this.BTC_RATE_API);
      const rate = response.data.bitcoin.uah;

      if (!rate) {
        throw new Error('Rate not found');
      }

      return rate;
    } catch (error) {
      console.error('Error fetching BTC rate:', error.message);
      throw new Error('Failed to fetch BTC rate');
    }
  }

  async getActiveEmails(): Promise<string[]> {
    const emails = await prisma.email.findMany({
      where: {
        status: Status.subscribed,
      },
      select: {
        email: true,
      },
    });
    return emails.map((email) => email.email);
  }
}
