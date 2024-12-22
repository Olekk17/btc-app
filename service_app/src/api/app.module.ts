import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { EmailsModule } from './emails/emails.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [RateModule, EmailsModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
