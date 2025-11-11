#!/usr/bin/env node

/**
 * FRIDAY MCP Server
 * Personal AI Agent with Upstash integration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { setupTool } from "./tools/setup/index.js";
import { searchTool } from "./tools/search.js";
import { syncTool } from "./tools/sync.js";
import { contextTool } from "./tools/context.js";
import { greetingTool } from "./tools/greeting.js";
import { SmartSearchStrategy, formatSmartSearchResults } from "./tools/smart-search.js";
import { ConfigLoader } from "./utils/config-loader.js";
import {
  browserNavigateTool,
  browserScreenshotTool,
  browserEvaluateTool,
  browserTabsTool,
  browserConsoleTool,
  browserClickTool,
  browserTypeTool,
  browserPressTool,
} from "./tools/browser/index.js";
import { cleanupBrowserManager } from "./browser/index.js";

const server = new Server(
  {
    name: "friday-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "friday-setup",
          description: "Initialize FRIDAY in current project",
          inputSchema: {
            type: "object",
            properties: {
              projectType: { type: "string" },
              enableRedis: { type: "boolean" },
              memoryCapacity: { type: "number" },
            },
          },
        },
        {
          name: "friday-search",
          description: "Search FRIDAY memory",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
        {
          name: "friday-context",
          description: "Load full project context",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "friday-sync",
          description: "Sync memory to Redis",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "friday-greeting",
          description: "Greet FRIDAY and get project status",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "friday-smart-search",
          description: "Smart search for new features (local → upstash → context7)",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Feature or topic to search for" },
              featureContext: { type: "string", description: "Additional context (optional)" },
            },
            required: ["query"],
          },
        },
        {
          name: "browser-navigate",
          description: "Navigate browser to URL or use history navigation",
          inputSchema: {
            type: "object",
            properties: {
              url: { type: "string" },
              action: { type: "string", enum: ["back", "forward", "reload"] },
              timeout: { type: "number" },
              waitUntil: { type: "string", enum: ["load", "domcontentloaded", "networkidle"] },
            },
          },
        },
        {
          name: "browser-screenshot",
          description: "Capture screenshot of current page",
          inputSchema: {
            type: "object",
            properties: {
              format: { type: "string", enum: ["png", "jpeg", "webp"] },
              quality: { type: "number" },
              fullPage: { type: "boolean" },
              filePath: { type: "string" },
            },
          },
        },
        {
          name: "browser-evaluate",
          description: "Execute JavaScript in browser context",
          inputSchema: {
            type: "object",
            properties: {
              function: { type: "string" },
              args: { type: "array" },
            },
            required: ["function"],
          },
        },
        {
          name: "browser-tabs",
          description: "Manage browser tabs (list, create, select, close)",
          inputSchema: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["list", "create", "select", "close"] },
              index: { type: "number" },
            },
            required: ["action"],
          },
        },
        {
          name: "browser-console",
          description: "View or clear browser console messages",
          inputSchema: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["list", "clear"] },
              onlyErrors: { type: "boolean" },
            },
            required: ["action"],
          },
        },
        {
          name: "browser-click",
          description: "Click an element on the page",
          inputSchema: {
            type: "object",
            properties: {
              selector: { type: "string" },
              button: { type: "string", enum: ["left", "right", "middle"] },
              clickCount: { type: "number" },
            },
            required: ["selector"],
          },
        },
        {
          name: "browser-type",
          description: "Type text into an input field",
          inputSchema: {
            type: "object",
            properties: {
              selector: { type: "string" },
              text: { type: "string" },
              delay: { type: "number" },
            },
            required: ["selector", "text"],
          },
        },
        {
          name: "browser-press",
          description: "Press a keyboard key",
          inputSchema: {
            type: "object",
            properties: {
              key: { type: "string" },
            },
            required: ["key"],
          },
        },
      ],
    };
  });

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "friday-setup":
        return await setupTool(args);

      case "friday-search":
        return await searchTool(args);

      case "friday-sync":
        return await syncTool(args);

      case "friday-context":
        return await contextTool(args);

      case "friday-greeting":
        return await greetingTool();

      case "friday-smart-search": {
        const config = ConfigLoader.load();
        const smartSearch = new SmartSearchStrategy(config.projectRoot);
        const query = (args as any)?.query || "";
        const featureContext = (args as any)?.featureContext;
        const result = await smartSearch.search(query, featureContext);
        return {
          content: [
            {
              type: "text",
              text: formatSmartSearchResults(result),
            },
          ],
        };
      }

      case "browser-navigate":
        return await browserNavigateTool(args);

      case "browser-screenshot":
        return await browserScreenshotTool(args);

      case "browser-evaluate":
        return await browserEvaluateTool(args);

      case "browser-tabs":
        return await browserTabsTool(args);

      case "browser-console":
        return await browserConsoleTool(args);

      case "browser-click":
        return await browserClickTool(args);

      case "browser-type":
        return await browserTypeTool(args);

      case "browser-press":
        return await browserPressTool(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FRIDAY MCP Server running on stdio");

  // Cleanup on exit
  process.on("SIGINT", async () => {
    console.error("\nShutting down FRIDAY MCP Server...");
    await cleanupBrowserManager();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.error("\nShutting down FRIDAY MCP Server...");
    await cleanupBrowserManager();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
