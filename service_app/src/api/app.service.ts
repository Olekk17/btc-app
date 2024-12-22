import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'btc-api service by Oleh Kolodii';
  }
}
