# Browser DevTools Integration - Implementation Plan

## 📋 Executive Summary

Implementation of browser DevTools capabilities for FRIDAY MCP Server, enabling comprehensive web automation, debugging, and testing features based on industry best practices.

---

## 🎯 Objectives

1. **Browser Automation** - Navigate, interact, and control web pages
2. **DevTools Access** - Full Chrome DevTools Protocol integration
3. **Testing Support** - Screenshots, performance tracing, accessibility
4. **Multiple Strategies** - Support both Playwright and Chrome CDP approaches

---

## 🔍 Research Findings

### Best Practices from Context7:

**1. Playwright MCP** (`/microsoft/playwright-mcp`)

- ✅ **Trust Score:** 9.9/10
- ✅ **Code Snippets:** 2,123
- ✅ **Mature ecosystem** with structured accessibility snapshots
- ✅ **Multi-browser support** (Chromium, Firefox, WebKit)
- ✅ **Built-in capabilities:** screenshots, PDF, tracing, tabs
- ✅ **Extension mode** for existing browser profiles

**2. Chrome DevTools MCP** (`/chromedevtools/chrome-devtools-mcp`)

- ✅ **Trust Score:** 8.2/10
- ✅ **Direct CDP access** for fine-grained control
- ✅ **Performance tracing** with Core Web Vitals
- ✅ **Console message capture**
- ✅ **Network emulation** and CPU throttling

**3. Puppeteer** (`/puppeteer/puppeteer`)

- ✅ **Trust Score:** 8.0/10
- ✅ **Code Snippets:** 2,318
- ✅ **DevTools Protocol** native integration
- ✅ **Headless/headed modes**
- ✅ **Extensive CDP access**

### Recommended Approach: **Hybrid Strategy**

Combine Playwright's high-level API with Chrome CDP for maximum flexibility.

---

## 🏗️ Architecture Design

### Component Structure

```
src/
├── browser/
│   ├── index.ts                    # Main browser manager
│   ├── playwright-client.ts        # Playwright integration
│   ├── cdp-client.ts              # Chrome DevTools Protocol
│   ├── browser-config.ts          # Configuration
│   └── types.ts                   # Type definitions
├── tools/
│   ├── browser-navigate.ts        # Navigation tool
│   ├── browser-screenshot.ts      # Screenshots
│   ├── browser-evaluate.ts        # JavaScript execution
│   ├── browser-devtools.ts        # DevTools access
│   ├── browser-performance.ts     # Performance tracing
│   └── browser-tabs.ts            # Tab management
└── utils/
    └── browser-helpers.ts         # Utilities
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "playwright": "^1.51.0",
    "playwright-core": "^1.51.0",
    "chrome-remote-interface": "^0.33.0"
  },
  "devDependencies": {
    "@types/chrome-remote-interface": "^0.31.0"
  }
}
```

---

## 🛠️ Feature Set

### Phase 1: Core Browser Automation ✅

**Priority:** Critical
**Timeline:** 2-3 days

#### Tools:

1. **`browser-navigate`**

   - Navigate to URL
   - Go back/forward
   - Reload page
   - Wait for navigation

2. **`browser-evaluate`**

   - Execute JavaScript
   - Element evaluation
   - Page-level scripts
   - Return data extraction

3. **`browser-screenshot`**

   - Full page screenshots
   - Element screenshots
   - Multiple formats (PNG, JPEG, WebP)
   - Quality control

4. **`browser-tabs`**

   - List tabs
   - Create new tab
   - Switch tabs
   - Close tabs

5. **`browser-click`**

   - Click elements
   - Double click
   - Right click
   - Hover actions

6. **`browser-type`**
   - Type text
   - Press keys
   - Keyboard shortcuts
   - Fill forms

### Phase 2: DevTools Integration ✅

**Priority:** High
**Timeline:** 2-3 days

#### Tools:

1. **`browser-devtools-open`**

   - Open DevTools panel
   - Select specific panel (Console, Network, Performance)
   - CDP session management

2. **`browser-console`**

   - Get console messages
   - Filter by type (log, error, warn)
   - Clear console
   - Execute console commands

3. **`browser-network`**

   - Monitor network requests
   - Block origins
   - Throttle network
   - Capture HAR files

4. **`browser-performance`**

   - Start/stop tracing
   - Core Web Vitals
   - Performance insights
   - CPU/memory profiling

5. **`browser-accessibility`**
   - Accessibility tree snapshot
   - A11y audit
   - ARIA verification

### Phase 3: Advanced Features ✅

**Priority:** Medium
**Timeline:** 2-3 days

#### Tools:

1. **`browser-pdf`**

   - Generate PDF from page
   - Custom dimensions
   - Headers/footers

2. **`browser-emulate`**

   - Device emulation
   - Geolocation
   - Timezone
   - User agent

3. **`browser-viewport`**

   - Resize viewport
   - Responsive testing
   - Multiple screen sizes

4. **`browser-storage`**

   - Cookies management
   - LocalStorage
   - SessionStorage
   - IndexedDB

5. **`browser-session`**
   - Save/restore session
   - Authentication state
   - Profile management

---

## 🎨 Tool Interface Design

### Example: `browser-navigate` Tool

```typescript
export interface BrowserNavigateArgs {
  url?: string;
  action?: "back" | "forward" | "reload";
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle";
}

export async function browserNavigateTool(args: BrowserNavigateArgs) {
  const browser = await getBrowserInstance();
  const page = browser.currentPage();

  if (args.url) {
    await page.goto(args.url, {
      timeout: args.timeout || 30000,
      waitUntil: args.waitUntil || "load",
    });
  } else if (args.action === "back") {
    await page.goBack();
  } else if (args.action === "forward") {
    await page.goForward();
  } else if (args.action === "reload") {
    await page.reload();
  }

  return {
    content: [
      {
        type: "text",
        text: `✅ Navigated to: ${page.url()}\nTitle: ${await page.title()}`,
      },
    ],
  };
}
```

### Example: `browser-devtools-console` Tool

```typescript
export interface BrowserConsoleArgs {
  action: "list" | "clear" | "execute";
  onlyErrors?: boolean;
  command?: string;
}

export async function browserConsoleTool(args: BrowserConsoleArgs) {
  const browser = await getBrowserInstance();
  const cdp = await browser.getCDPSession();

  if (args.action === "list") {
    const messages = browser.getConsoleMessages();
    const filtered = args.onlyErrors
      ? messages.filter((m) => m.type === "error")
      : messages;

    return {
      content: [
        {
          type: "text",
          text: formatConsoleMessages(filtered),
        },
      ],
    };
  }

  if (args.action === "execute" && args.command) {
    await cdp.send("Runtime.evaluate", {
      expression: args.command,
      includeCommandLineAPI: true,
    });
  }

  // ... implementation
}
```

---

## 🔧 Configuration

### Browser Configuration (`browser-config.ts`)

```typescript
export interface BrowserConfig {
  browser: {
    type: "chromium" | "firefox" | "webkit";
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

  network: {
    blockedOrigins?: string[];
    throttling?: "Fast 3G" | "Slow 3G" | "Offline";
  };

  tracing: {
    enabled: boolean;
    screenshots: boolean;
    snapshots: boolean;
  };
}

export const DEFAULT_CONFIG: BrowserConfig = {
  browser: {
    type: "chromium",
    headless: false,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  viewport: {
    width: 1920,
    height: 1080,
  },
  timeout: {
    navigation: 30000,
    action: 10000,
  },
  network: {},
  tracing: {
    enabled: false,
    screenshots: true,
    snapshots: true,
  },
};
```

---

## 📊 Integration Points

### 1. Tool Registration

```typescript
// In src/index.ts
import {
  browserNavigateTool,
  browserScreenshotTool,
  browserEvaluateTool,
  browserConsoleTool,
  // ... other tools
} from "./tools/browser/index.js";

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "browser-navigate":
      return browserNavigateTool(request.params.arguments);
    case "browser-screenshot":
      return browserScreenshotTool(request.params.arguments);
    case "browser-console":
      return browserConsoleTool(request.params.arguments);
    // ... other cases
  }
});
```

### 2. Lifecycle Management

```typescript
export class BrowserManager {
  private browser: Browser | null = null;
  private cdpSession: CDPSession | null = null;
  private pages: Page[] = [];

  async initialize(config: BrowserConfig) {
    this.browser = await playwright.chromium.launch({
      headless: config.browser.headless,
      devtools: config.browser.devtools,
      args: config.browser.args,
    });

    const page = await this.browser.newPage({
      viewport: config.viewport,
    });

    this.pages.push(page);
    this.cdpSession = await page.context().newCDPSession(page);

    // Setup console message listener
    page.on("console", (msg) => this.consoleMessages.push(msg));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
```

---

## 🧪 Testing Strategy

### Test Coverage:

1. **Unit Tests** (per tool)

   - `browser-navigate.test.ts`
   - `browser-screenshot.test.ts`
   - `browser-devtools.test.ts`
   - etc.

2. **Integration Tests**

   - Full workflow scenarios
   - Multi-tab operations
   - DevTools integration

3. **E2E Tests**
   - Real browser automation
   - Performance benchmarks

### Example Test:

```typescript
describe("browser-navigate", () => {
  let browser: BrowserManager;

  beforeEach(async () => {
    browser = new BrowserManager();
    await browser.initialize(DEFAULT_CONFIG);
  });

  afterEach(async () => {
    await browser.cleanup();
  });

  it("should navigate to URL", async () => {
    const result = await browserNavigateTool({
      url: "https://example.com",
    });

    expect(result.content[0].text).toContain("example.com");
  });

  it("should go back in history", async () => {
    await browserNavigateTool({ url: "https://example.com" });
    await browserNavigateTool({ url: "https://github.com" });

    const result = await browserNavigateTool({ action: "back" });
    expect(result.content[0].text).toContain("example.com");
  });
});
```

---

## 📚 Documentation

### User Documentation:

- Tool usage examples
- Configuration guide
- Common workflows
- Troubleshooting

### Developer Documentation:

- Architecture diagrams
- API reference
- Extension guide
- Contributing guidelines

---

## 🚀 Implementation Timeline

### Week 1: Core Features

- **Day 1-2:** Project setup, dependencies, basic browser manager
- **Day 3-4:** Navigation, screenshot, evaluate tools
- **Day 5:** Tab management, testing

### Week 2: DevTools Integration

- **Day 1-2:** CDP client, console access
- **Day 3-4:** Network monitoring, performance tracing
- **Day 5:** Testing, documentation

### Week 3: Advanced Features

- **Day 1-2:** PDF generation, emulation
- **Day 3-4:** Storage management, sessions
- **Day 5:** Final testing, polish

---

## ✅ Success Criteria

1. ✅ All 15+ browser tools implemented and tested
2. ✅ Full DevTools Protocol access available
3. ✅ Comprehensive test coverage (>90%)
4. ✅ Documentation complete
5. ✅ Performance benchmarks passed
6. ✅ Zero critical bugs

---

## 🔒 Security Considerations

1. **Sandboxing:** Run browser in isolated environment
2. **URL Validation:** Validate all navigation targets
3. **Script Injection:** Sanitize all executed scripts
4. **File Access:** Restrict screenshot/PDF save locations
5. **Credentials:** Never log sensitive data

---

## 🎯 Future Enhancements

1. **WebSocket Support:** Real-time browser events
2. **Recording:** Session recording and playback
3. **AI Integration:** Smart element detection
4. **Multi-browser:** Parallel browser instances
5. **Cloud Testing:** BrowserStack/Sauce Labs integration

---

## 📝 Notes

- Use Playwright for primary automation (high-level, stable)
- CDP for low-level DevTools features (protocol access)
- Keep tools simple and focused
- Prioritize user experience and documentation
- Follow FRIDAY persona in all responses

---

**Status:** Ready for Implementation  
**Estimated Effort:** 3 weeks  
**Risk Level:** Medium  
**Dependencies:** Playwright, Chrome DevTools Protocol

**Next Step:** Approve plan and begin Phase 1 implementation
