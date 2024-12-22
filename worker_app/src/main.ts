import { scrapeMetricsJob } from "./jobs/scrapeMetrics.job";
import { sendDailyEmailJob } from "./jobs/sendDailyEmail.job";

async function main() {
  console.log("Starting");
  scrapeMetricsJob();
  sendDailyEmailJob();
}

main();
