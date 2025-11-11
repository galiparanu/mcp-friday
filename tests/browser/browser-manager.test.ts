/**
 * Browser Manager Tests
 */

import { BrowserManager } from "../../src/browser/index";
import { DEFAULT_BROWSER_CONFIG } from "../../src/browser/browser-config";

describe("BrowserManager", () => {
  let browser: BrowserManager;

  afterEach(async () => {
    if (browser?.isInitialized()) {
      await browser.cleanup();
    }
  });

  describe("Constructor", () => {
    it("should create manager with default config", () => {
      browser = new BrowserManager();
      expect(browser).toBeDefined();
      expect(browser.isInitialized()).toBe(false);
    });

    it("should create manager with custom config", () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true },
      });
      expect(browser).toBeDefined();
    });

    it("should throw on invalid config", () => {
      expect(() => {
        new BrowserManager({
          viewport: { width: 100, height: 100 },
        });
      }).toThrow("Invalid browser config");
    });
  });

  describe("initialize", () => {
    it("should initialize browser", async () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
      });
      
      await browser.initialize();
      
      expect(browser.isInitialized()).toBe(true);
      expect(browser.getAllPages()).toHaveLength(1);
    }, 30000);

    it("should not reinitialize if already initialized", async () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
      });
      
      await browser.initialize();
      const firstPage = browser.getCurrentPage();
      
      await browser.initialize();
      const secondPage = browser.getCurrentPage();
      
      expect(firstPage).toBe(secondPage);
    }, 30000);
  });

  describe("Page Management", () => {
    beforeEach(async () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
      });
      await browser.initialize();
    }, 30000);

    it("should get current page", () => {
      const page = browser.getCurrentPage();
      expect(page).toBeDefined();
    });

    it("should create new page", async () => {
      const initialCount = browser.getAllPages().length;
      
      await browser.createPage();
      
      expect(browser.getAllPages()).toHaveLength(initialCount + 1);
    });

    it("should select page by index", async () => {
      await browser.createPage();
      
      browser.selectPage(0);
      const firstPage = browser.getCurrentPage();
      
      browser.selectPage(1);
      const secondPage = browser.getCurrentPage();
      
      expect(firstPage).not.toBe(secondPage);
    });

    it("should throw on invalid page index", () => {
      expect(() => browser.selectPage(999)).toThrow("Invalid page index");
    });

    it("should close page", async () => {
      await browser.createPage();
      const initialCount = browser.getAllPages().length;
      
      await browser.closePage(1);
      
      expect(browser.getAllPages()).toHaveLength(initialCount - 1);
    });

    it("should not close last page", async () => {
      await expect(browser.closePage(0)).rejects.toThrow("Cannot close the last page");
    });
  });

  describe("Console Messages", () => {
    beforeEach(async () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
      });
      await browser.initialize();
    }, 30000);

    it("should capture console messages", async () => {
      const page = browser.getCurrentPage();
      
      await page.evaluate(() => {
        console.log("Test message");
        console.error("Test error");
      });
      
      // Wait for messages to be captured
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const messages = browser.getConsoleMessages();
      expect(messages.length).toBeGreaterThan(0);
    });

    it("should filter error messages", async () => {
      const page = browser.getCurrentPage();
      
      await page.evaluate(() => {
        console.log("Log message");
        console.error("Error message");
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const errors = browser.getConsoleMessages(true);
      expect(errors.every(msg => msg.type === "error")).toBe(true);
    });

    it("should clear console messages", async () => {
      const page = browser.getCurrentPage();
      
      await page.evaluate(() => console.log("Test"));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      browser.clearConsoleMessages();
      
      expect(browser.getConsoleMessages()).toHaveLength(0);
    });
  });

  describe("cleanup", () => {
    it("should cleanup all resources", async () => {
      browser = new BrowserManager({
        browser: { ...DEFAULT_BROWSER_CONFIG.browser, headless: true, devtools: false },
      });
      await browser.initialize();
      
      await browser.cleanup();
      
      expect(browser.isInitialized()).toBe(false);
    }, 30000);
  });
});
