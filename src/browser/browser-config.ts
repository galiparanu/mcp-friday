/**
 * Browser Configuration
 */

import type { BrowserConfig } from "./types.js";

export const DEFAULT_BROWSER_CONFIG: BrowserConfig = {
  browser: {
    type: "chromium",
    headless: false,
    devtools: true,
    slowMo: 0,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  },

  viewport: {
    width: 1920,
    height: 1080,
  },

  timeout: {
    navigation: 30000,
    action: 10000,
  },

  network: {
    blockedOrigins: [],
    throttling: "None",
  },

  tracing: {
    enabled: false,
    screenshots: true,
    snapshots: true,
  },
};

/**
 * Load browser configuration from environment
 */
export function loadBrowserConfig(): BrowserConfig {
  const config: BrowserConfig = { ...DEFAULT_BROWSER_CONFIG };

  // Browser type from env
  const browserType = process.env.FRIDAY_BROWSER_TYPE as
    | "chromium"
    | "firefox"
    | "webkit"
    | undefined;
  if (browserType) {
    config.browser.type = browserType;
  }

  // Headless mode
  if (process.env.FRIDAY_BROWSER_HEADLESS === "true") {
    config.browser.headless = true;
  }

  // DevTools
  if (process.env.FRIDAY_BROWSER_DEVTOOLS === "false") {
    config.browser.devtools = false;
  }

  // Viewport
  const width = parseInt(process.env.FRIDAY_VIEWPORT_WIDTH || "1920");
  const height = parseInt(process.env.FRIDAY_VIEWPORT_HEIGHT || "1080");
  config.viewport = { width, height };

  // Timeouts
  const navTimeout = parseInt(process.env.FRIDAY_NAV_TIMEOUT || "30000");
  const actionTimeout = parseInt(process.env.FRIDAY_ACTION_TIMEOUT || "10000");
  config.timeout = { navigation: navTimeout, action: actionTimeout };

  return config;
}

/**
 * Validate browser configuration
 */
export function validateBrowserConfig(
  config: BrowserConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.viewport.width < 320 || config.viewport.width > 3840) {
    errors.push("Viewport width must be between 320 and 3840");
  }

  if (config.viewport.height < 240 || config.viewport.height > 2160) {
    errors.push("Viewport height must be between 240 and 2160");
  }

  if (config.timeout.navigation < 1000) {
    errors.push("Navigation timeout must be at least 1000ms");
  }

  if (config.timeout.action < 100) {
    errors.push("Action timeout must be at least 100ms");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
