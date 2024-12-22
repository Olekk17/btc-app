import { scrapeAndStoreMetrics } from "../helpers/metrics";
import { CronJob } from "cron";

export function scrapeMetricsJob() {
  const job = new CronJob("0 * * * *", async () => {
    console.log("Running cron job to scrape and store metrics...");
    await scrapeAndStoreMetrics();
  });

  job.start();
  console.log("Cron job scheduled.");
}
