/**
 * Browser Type Definitions
 */

import type { Browser, Page, BrowserContext, CDPSession } from "playwright";

export type BrowserType = "chromium" | "firefox" | "webkit";
export type NavigationAction = "back" | "forward" | "reload";
export type WaitUntil = "load" | "domcontentloaded" | "networkidle";
export type ScreenshotFormat = "png" | "jpeg" | "webp";
export type NetworkThrottle = "Fast 3G" | "Slow 3G" | "Offline" | "None";

export interface BrowserConfig {
  browser: {
    type: BrowserType;
    headless: boolean;
    devtools: boolean;
    slowMo?: number;
    args?: string[];
  };

  viewport: {
    width: number;
    height: number;
  };

  timeout: {
    navigation: number;
    action: number;
  };

  network?: {
    blockedOrigins?: string[];
    throttling?: NetworkThrottle;
  };

  tracing: {
    enabled: boolean;
    screenshots: boolean;
    snapshots: boolean;
  };
}

export interface BrowserState {
  browser: Browser | null;
  context: BrowserContext | null;
  pages: Page[];
  currentPageIndex: number;
  cdpSession: CDPSession | null;
  consoleMessages: ConsoleMessage[];
  config: BrowserConfig;
}

export interface ConsoleMessage {
  type: "log" | "warn" | "error" | "info" | "debug";
  text: string;
  timestamp: number;
  location?: {
    url: string;
    lineNumber: number;
    columnNumber: number;
  };
}

export interface PageSnapshot {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  timestamp: number;
}

export interface PerformanceMetrics {
  timestamp: number;
  metrics: {
    domContentLoaded?: number;
    load?: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
  };
}

export interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  timestamp: number;
  size: number;
  duration: number;
}
