import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const parseMetrics = (
  metricsData: string
): { name: string; value: number }[] => {
  const metrics: { name: string; value: number }[] = [];
  const lines = metricsData.split("\n");

  for (const line of lines) {
    if (line.startsWith("#") || line.trim() === "") continue;

    const [name, value] = line.split(" ");
    if (name && value) {
      metrics.push({ name, value: parseFloat(value) });
    }
  }

  return metrics;
};

export async function scrapeAndStoreMetrics(): Promise<void> {
  try {
    const response = await axios.get(`${process.env.BASE_APP_URL}/api/metrics`);
    const metricsData = response.data;

    const metrics = parseMetrics(metricsData);
    for (const metric of metrics) {
      await prisma.metric.create({
        data: {
          name: metric.name,
          value: metric.value,
        },
      });
    }

    const lastEmailPrice = metrics.find(
      (metric) => metric.name === "exchange_rate_gauge_in_last_email"
    );

    if (lastEmailPrice && lastEmailPrice.value) {
      const currentPrice = await axios.get<number>(
        `${process.env.BASE_APP_URL}/api/rate`
      );

      const diff = Math.abs(lastEmailPrice.value / currentPrice.data - 1);

      if (diff > 0.05) {
        await axios.post(`${process.env.BASE_APP_URL}/api/rate`);
      }
    }

    console.log("Metrics scraped and stored successfully.");
  } catch (error) {
    console.error("Error scraping or storing metrics:", error);
  }
}
