import { transporter } from '../transporter';

export const sendBtcPriceNotification = (emails: string[], btcPrice: number) =>
  transporter.sendMail({
    to: emails.join(', '),
    subject: 'BTC price notification',
    text: `BTC/UAH price is ${btcPrice}`,
  });
