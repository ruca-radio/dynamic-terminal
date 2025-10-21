# Google Ads AI Optimization Interface

AI-powered Google Ads optimization interface with dual-agent architecture. Built with Next.js, Claude-Code SDK, and dynamic canvas rendering.

## Architecture

- **Main Agent (Sonnet/Opus)**: Google Ads optimization expert
- **Display Agent (Haiku)**: Autonomous UI component generation
- **Dynamic Canvas**: AI-created visualizations (tables, charts, tasks)
- **Terminal Zone**: Chat interface (minimum 25% of screen)

## Setup

### Prerequisites

- Node.js 18+
- Python 3.8+ (for MCP backend)
- Anthropic API key
- Google Ads API access (optional for full functionality)

### Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

4. Start the development server:

```bash
npm run dev
```

5. (Optional) Start Python MCP backend:

```bash
cd ../mcp-backend
python api_server.py
```

## Project Structure

```
google-ads-interface/
├── app/
│   ├── page.tsx              # Main interface
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── chat/route.ts     # Main agent endpoint
│       └── display/route.ts  # Display agent endpoint
├── components/
│   ├── terminal/             # Chat/input components
│   ├── canvas/               # Dynamic canvas system
│   ├── ui/                   # UI components
│   └── visualizations/       # Data visualization components
├── lib/
│   ├── claude.ts             # Claude SDK wrapper
│   ├── mcp.ts                # MCP client
│   └── utils.ts              # Utilities
└── types/
    └── index.ts              # TypeScript types
```

## Features

### Dynamic Canvas

The canvas zone automatically displays AI-generated visualizations:

- **DataTable**: Campaign performance tables with sorting/filtering
- **TaskWindow**: Checklist of analysis tasks
- **MetricCard**: Single KPI displays with trends
- **Chart**: Line/bar charts for trends

### Terminal Zone

Chat interface with:

- Message history
- Real-time streaming
- Status indicators
- Command input

### Settings

Customize:

- Canvas/Terminal split ratio (25%-75%)
- Primary model selection
- Display agent toggle
- Theme preferences

## Development

### Adding New Visualization Components

1. Create component in `components/visualizations/`
2. Add to `ComponentRenderer.tsx`
3. Update Display Agent system prompt in `lib/claude.ts`

### Connecting MCP Servers

The interface expects MCP servers at:

- Google Ads API: `http://localhost:5000`
- Memory: `http://localhost:5000`

Update endpoints in `.env.local`:

```
GOOGLE_ADS_MCP_URL=http://localhost:5000
MEMORY_MCP_URL=http://localhost:5000
```

## Usage

1. Open `http://localhost:3000`
2. Type a query: "Analyze my Q4 campaign performance"
3. Main agent responds with analysis
4. Display agent automatically creates visualizations
5. Components appear on canvas in real-time

## Known Limitations

- WebSocket implementation requires custom server (currently using HTTP streaming)
- MCP integration is placeholder (implement based on your MCP API)
- Component positioning is basic (no drag-drop yet)

## Roadmap

- [ ] Full WebSocket implementation
- [ ] Real Google Ads MCP integration
- [ ] Drag-and-drop component repositioning
- [ ] More visualization types
- [ ] Settings persistence
- [ ] Multi-account support
- [ ] Collaboration features

## License

MIT

## Design Document

See `docs/plans/2025-10-20-google-ads-ai-interface-design.md` for complete design documentation.
