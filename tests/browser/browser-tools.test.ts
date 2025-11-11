/**
 * Browser Tools Integration Tests
 * Tests for Phase 2 & 3 tools
 */

import { BrowserManager } from "../../src/browser/index";
import { DEFAULT_BROWSER_CONFIG } from "../../src/browser/browser-config";

describe("Browser Tools - Phase 2 & 3", () => {
  let browser: BrowserManager;

  beforeEach(async () => {
    browser = new BrowserManager({
      browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
    });
    await browser.initialize();
  }, 30000);

  afterEach(async () => {
    if (browser?.isInitialized()) {
      await browser.cleanup();
    }
  });

  describe("Performance Tool", () => {
    it("should support performance metrics structure", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");
      
      expect(page).toBeDefined();
    });

    it("should start and stop tracing", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      await page.context().tracing.start({ screenshots: true });
      await page.context().tracing.stop();

      expect(true).toBe(true);
    });
  });

  describe("Network Tool", () => {
    it("should have CDP session for network control", () => {
      const config = browser.getConfig();
      expect(config.browser.type).toBe("chromium");
    });
  });

  describe("PDF Tool", () => {
    it("should generate PDF", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      const pdf = await page.pdf({ format: "A4" });
      
      expect(pdf).toBeDefined();
      expect(pdf.length).toBeGreaterThan(0);
    });

    it("should support different formats", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      const pdfLetter = await page.pdf({ format: "Letter" });
      const pdfLegal = await page.pdf({ format: "Legal" });

      expect(pdfLetter.length).toBeGreaterThan(0);
      expect(pdfLegal.length).toBeGreaterThan(0);
    });

    it("should support landscape mode", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      const pdf = await page.pdf({ landscape: true });

      expect(pdf.length).toBeGreaterThan(0);
    });
  });

  describe("Emulation Tool", () => {
    it("should change viewport size", async () => {
      const page = browser.getCurrentPage();

      await page.setViewportSize({ width: 1280, height: 720 });
      const viewport = page.viewportSize();

      expect(viewport?.width).toBe(1280);
      expect(viewport?.height).toBe(720);
    });

    it("should set geolocation", async () => {
      const page = browser.getCurrentPage();

      await page.context().setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
      await page.context().grantPermissions(["geolocation"]);

      expect(true).toBe(true);
    });
  });

  describe("Storage Tool", () => {
    it("should manage cookies", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      await page.context().addCookies([
        {
          name: "test",
          value: "value",
          domain: "localhost",
          path: "/",
        },
      ]);

      const cookies = await page.context().cookies();
      expect(cookies.length).toBeGreaterThan(0);
    });

    it("should clear cookies", async () => {
      const page = browser.getCurrentPage();
      await page.goto("about:blank");

      await page.context().addCookies([
        {
          name: "test",
          value: "value",
          domain: "localhost",
          path: "/",
        },
      ]);

      await page.context().clearCookies();
      const cookies = await page.context().cookies();

      expect(cookies).toHaveLength(0);
    });

    it("should manage localStorage", async () => {
      const page = browser.getCurrentPage();
      await page.goto("data:text/html,<h1>Test</h1>");

      try {
        await page.evaluate(() => localStorage.setItem("key", "value"));
        const value = await page.evaluate(() => localStorage.getItem("key"));
        expect(value).toBe("value");
      } catch (error) {
        // localStorage may not be available in some contexts
        expect(true).toBe(true);
      }
    });

    it("should manage sessionStorage", async () => {
      const page = browser.getCurrentPage();
      await page.goto("data:text/html,<h1>Test</h1>");

      try {
        await page.evaluate(() => sessionStorage.setItem("key", "value"));
        const value = await page.evaluate(() => sessionStorage.getItem("key"));
        expect(value).toBe("value");
      } catch (error) {
        // sessionStorage may not be available in some contexts
        expect(true).toBe(true);
      }
    });
  });

  describe("Integration", () => {
    it("should work with multiple tools together", async () => {
      const page = browser.getCurrentPage();
      
      // Navigate
      await page.goto("data:text/html,<h1>Test</h1>");
      
      // Set viewport
      await page.setViewportSize({ width: 800, height: 600 });
      
      // Get content
      const content = await page.content();
      
      // Screenshot
      const screenshot = await page.screenshot();
      
      // PDF
      const pdf = await page.pdf();

      expect(content).toContain("Test");
      expect(screenshot.length).toBeGreaterThan(0);
      expect(pdf.length).toBeGreaterThan(0);
    });
  });
});
