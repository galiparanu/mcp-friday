/**
 * Browser Configuration Tests
 */

import {
  DEFAULT_BROWSER_CONFIG,
  loadBrowserConfig,
  validateBrowserConfig,
} from "../../src/browser/browser-config";

describe("Browser Configuration", () => {
  describe("DEFAULT_BROWSER_CONFIG", () => {
    it("should have valid default configuration", () => {
      expect(DEFAULT_BROWSER_CONFIG.browser.type).toBe("chromium");
      expect(DEFAULT_BROWSER_CONFIG.browser.headless).toBe(false);
      expect(DEFAULT_BROWSER_CONFIG.browser.devtools).toBe(true);
    });

    it("should have valid viewport", () => {
      expect(DEFAULT_BROWSER_CONFIG.viewport.width).toBe(1920);
      expect(DEFAULT_BROWSER_CONFIG.viewport.height).toBe(1080);
    });

    it("should have valid timeouts", () => {
      expect(DEFAULT_BROWSER_CONFIG.timeout.navigation).toBe(30000);
      expect(DEFAULT_BROWSER_CONFIG.timeout.action).toBe(10000);
    });
  });

  describe("loadBrowserConfig", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should load default config without env vars", () => {
      const config = loadBrowserConfig();
      
      expect(config.browser.type).toBe("chromium");
      expect(config.browser.headless).toBe(false);
    });

    it("should load browser type from env", () => {
      process.env.FRIDAY_BROWSER_TYPE = "firefox";
      
      const config = loadBrowserConfig();
      
      expect(config.browser.type).toBe("firefox");
    });

    it("should load headless mode from env", () => {
      process.env.FRIDAY_BROWSER_HEADLESS = "true";
      
      const config = loadBrowserConfig();
      
      expect(config.browser.headless).toBe(true);
    });

    it("should load devtools setting from env", () => {
      process.env.FRIDAY_BROWSER_DEVTOOLS = "false";
      
      const config = loadBrowserConfig();
      
      expect(config.browser.devtools).toBe(false);
    });

    it("should load viewport from env", () => {
      process.env.FRIDAY_VIEWPORT_WIDTH = "1280";
      process.env.FRIDAY_VIEWPORT_HEIGHT = "720";
      
      const config = loadBrowserConfig();
      
      expect(config.viewport.width).toBe(1280);
      expect(config.viewport.height).toBe(720);
    });

    it("should load timeouts from env", () => {
      process.env.FRIDAY_NAV_TIMEOUT = "60000";
      process.env.FRIDAY_ACTION_TIMEOUT = "5000";
      
      const config = loadBrowserConfig();
      
      expect(config.timeout.navigation).toBe(60000);
      expect(config.timeout.action).toBe(5000);
    });
  });

  describe("validateBrowserConfig", () => {
    it("should validate correct config", () => {
      const result = validateBrowserConfig(DEFAULT_BROWSER_CONFIG);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject viewport width too small", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        viewport: { width: 100, height: 1080 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Viewport width must be between 320 and 3840");
    });

    it("should reject viewport width too large", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        viewport: { width: 5000, height: 1080 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
    });

    it("should reject viewport height too small", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        viewport: { width: 1920, height: 100 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Viewport height must be between 240 and 2160");
    });

    it("should reject navigation timeout too small", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        timeout: { navigation: 500, action: 10000 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Navigation timeout must be at least 1000ms");
    });

    it("should reject action timeout too small", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        timeout: { navigation: 30000, action: 50 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Action timeout must be at least 100ms");
    });

    it("should return multiple errors", () => {
      const config = {
        ...DEFAULT_BROWSER_CONFIG,
        viewport: { width: 100, height: 100 },
        timeout: { navigation: 500, action: 50 },
      };
      
      const result = validateBrowserConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
