/**
 * Browser Performance Tool
 * Performance tracing and Core Web Vitals
 */

import { getBrowserManager } from "../../browser/index.js";

export interface BrowserPerformanceArgs {
  action: "start" | "stop" | "metrics";
}

export async function browserPerformanceTool(args: any) {
  const { action } = args as BrowserPerformanceArgs;

  try {
    const browser = await getBrowserManager();
    const page = browser.getCurrentPage();

    switch (action) {
      case "start": {
        // Start performance tracing
        await page.context().tracing.start({
          screenshots: true,
          snapshots: true,
        });

        return {
          content: [
            {
              type: "text",
              text: `✅ Performance tracing started\n\nCapturing screenshots and snapshots`,
            },
          ],
        };
      }

      case "stop": {
        // Stop tracing and save
        const tracePath = `./trace-${Date.now()}.zip`;
        await page.context().tracing.stop({ path: tracePath });

        return {
          content: [
            {
              type: "text",
              text: `✅ Performance tracing stopped\n\nTrace saved to: ${tracePath}`,
            },
          ],
        };
      }

      case "metrics": {
        // Get performance metrics
        const metrics = await page.evaluate(() => {
          const perfEntries = performance.getEntries();
          const navigation: any = perfEntries.find((e: any) => e.entryType === "navigation");
          const paints: any[] = perfEntries.filter((e: any) => e.entryType === "paint");

          return {
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
            load: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
            firstPaint: paints.find((p: any) => p.name === "first-paint")?.startTime || 0,
            firstContentfulPaint: paints.find((p: any) => p.name === "first-contentful-paint")?.startTime || 0,
          };
        });

        return {
          content: [
            {
              type: "text",
              text: `📊 Performance Metrics\n\nDOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms\nLoad Event: ${metrics.load?.toFixed(2)}ms\nFirst Paint: ${metrics.firstPaint?.toFixed(2)}ms\nFirst Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `❌ Performance operation failed: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
