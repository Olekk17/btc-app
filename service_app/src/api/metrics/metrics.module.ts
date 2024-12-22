import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [],
  controllers: [MetricsController],
  providers: [],
})
export class MetricsModule {}
