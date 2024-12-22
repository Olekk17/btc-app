import { CronJob } from "cron";
import { sendCurrentRate } from "../helpers/sendCurrentRate";

export function sendDailyEmailJob() {
  const job = new CronJob(
    "0 9 * * *",
    async () => {
      console.log("Running cron job to send daily email...");
      await sendCurrentRate();
    },
    null,
    false,
    "Europe/Kyiv"
  );

  job.start();
  console.log("Cron job scheduled.");
}
