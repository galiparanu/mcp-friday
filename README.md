# FRIDAY MCP Server

Personal AI Agent with Upstash integration for seamless project setup.

## Features

- 🚀 One-command setup (`#friday-setup`)
- 🧠 Hybrid memory (Git + Upstash Redis + Context7)
- 📚 Built-in persona & copilot instructions
- 🔍 Semantic search via Upstash Context7
- 💾 Session persistence
- 🌍 Always-on (serverless)
- 💰 100% FREE tier

## Quick Start

```bash
# Install
npm install -g friday-mcp-server

# Configure (one-time)
friday-mcp config

# Use in any project
# In VS Code chat:
#friday-setup web
```

## Architecture

- **Upstash Context7**: Library documentation & semantic search
- **Git Memory**: Project-specific context (`.github/memory/`)
- **Upstash Redis**: Session state & cache
- **MCP Tools**: friday-setup, friday-search, friday-sync

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## License

MIT
