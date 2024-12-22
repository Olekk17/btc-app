import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { sendBtcPriceNotification } from 'src/smtp/letters/sendBtcPriceNotification';
import * as client from 'prom-client';

@Controller('api/rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}
  private readonly emailSentCounter = new client.Counter({
    name: 'email_sent_counter',
    help: 'The total number of emails sent',
  });

  private readonly emailSendingErrorCounter = new client.Counter({
    name: 'email_sending_error_counter',
    help: 'The total number of email sending errors',
  });

  private readonly exchangeRateGauge = new client.Gauge({
    name: 'exchange_rate_gauge',
    help: 'The current exchange rate of BTC to UAH',
  });

  private readonly exchangeRateGaugeInLastEmail = new client.Gauge({
    name: 'exchange_rate_gauge_in_last_email',
    help: 'The exchange rate of BTC to UAH in the last email',
  });

  @Get()
  async getBtcRate(): Promise<number> {
    try {
      const btcRate = await this.rateService.fetchBtcRate();
      this.exchangeRateGauge.set(btcRate);
      return btcRate;
    } catch {
      throw new HttpException(
        'Failed to fetch BTC rate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async sendBtcRate(): Promise<string> {
    try {
      const btcRate = await this.rateService.fetchBtcRate();

      this.exchangeRateGauge.set(btcRate);

      const activeEmails = await this.rateService.getActiveEmails();

      if (!activeEmails.length) {
        throw new Error('No active subscriptions found');
      }

      await sendBtcPriceNotification(activeEmails, btcRate);

      this.exchangeRateGaugeInLastEmail.set(btcRate);
      this.emailSentCounter.inc(activeEmails.length);

      return 'Rate successfully sent to active subscriptions';
    } catch (e) {
      this.emailSendingErrorCounter.inc();
      throw new HttpException(
        e?.message || 'Failed to send BTC rate notifiactions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
