import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';

@Controller('api/metrics')
export class MetricsController {
  @Get()
  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }
}
