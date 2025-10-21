# Google Ads AI Optimization Interface - Design Document

**Date:** 2025-10-20
**Project:** AI-Native Google Ads Optimization Interface
**Status:** Design Complete, Ready for Implementation

---

## Executive Summary

A next-generation interface for Google Ads optimization powered by Claude-Code SDK. This system uses dual AI agents (main optimization agent + autonomous display agent) to create a dynamic, beautiful interface that adapts to each conversation. Built for local development initially, designed to showcase at CloudOne.

### Key Innovation
**Autonomous Display Agent**: A separate Haiku model watches the main conversation and independently creates visualizations, eliminating UI overhead from the main optimization model.

---

## Architecture Overview

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- WebSocket for real-time streaming

**Backend:**
- Next.js API Routes (`/api/chat`, `/api/display`)
- Claude-Code SDK (TypeScript/Node)
- Python Flask MCP Backend (existing - port 5000)

**AI Models:**
- **Main Agent**: Claude Sonnet 4/Opus - Google Ads optimization
- **Display Agent**: Claude Haiku - Autonomous UI generation

**MCP Integrations:**
- Google Ads API MCP Server
- Memory MCP Server

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌────────────────────┐  ┌──────────────────────────────┐  │
│  │  Terminal Zone     │  │     Canvas Zone              │  │
│  │  (25%+ min)        │  │     (up to 75%)              │  │
│  │  - User input      │  │  - Dynamic components        │  │
│  │  - Conversation    │  │  - Task windows              │  │
│  │  - Status          │  │  - Data visualizations       │  │
│  └────────────────────┘  └──────────────────────────────┘  │
│                            ↑                                 │
│                    WebSocket (real-time)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                   Next.js Server (port 3000)                 │
│                                                               │
│  ┌─────────────────────┐        ┌──────────────────────┐   │
│  │  /api/chat          │        │  /api/display        │   │
│  │  (WebSocket)        │        │  (WebSocket)         │   │
│  │                     │        │                      │   │
│  │  Claude SDK         │        │  Claude SDK          │   │
│  │  ↓                  │        │  ↓                   │   │
│  │  Main Agent         │────────│  Display Agent       │   │
│  │  (Sonnet/Opus)      │ watch  │  (Haiku)             │   │
│  │                     │        │                      │   │
│  │  - Ads optimization │        │  - Pattern matching  │   │
│  │  - Conversation     │        │  - UI generation     │   │
│  │  - MCP queries      │        │  - Auto-viz          │   │
│  └─────────────────────┘        └──────────────────────┘   │
│           ↓                              ↓                   │
│    Conversation Stream              UI Commands             │
└───────────────────────┬─────────────────────────────────────┘
                        │
            ┌───────────┴────────────┐
            │                        │
    ┌───────┴────────┐      ┌───────┴────────┐
    │ Python Flask    │      │ Python Flask    │
    │ Google Ads MCP  │      │ Memory MCP      │
    │ (port 5000)     │      │ (port 5000)     │
    └─────────────────┘      └─────────────────┘
```

---

## Core Design Principles

### 1. Zero UI Overhead for Main Agent
- Main Claude focuses 100% on Google Ads optimization
- Never thinks about layout, components, or visualization
- Uses full context window for analysis and reasoning

### 2. Autonomous Display Agent
- Haiku watches conversation stream in real-time
- Pattern matches on conversation content:
  - "3 campaigns" + "performance" → Create table
  - "comparing ads" → Comparison cards
  - "tasks: 1. 2. 3." → Task window
  - "trend over time" → Chart
- Makes independent decisions about visualization
- Can query MCP directly if needs additional data

### 3. Parallel Processing
- Both agents run simultaneously
- No synchronization required
- Main agent never waits for display
- Display never blocks main conversation

### 4. AI-Native Rendering
- No rigid component library
- Display agent can generate React components on-demand
- Components adapt to data shape and context
- Every visualization is unique to the problem

### 5. 25% Minimum Terminal Zone
- User always has access to input
- Can interrupt, redirect, or question at any time
- Safety rail for when things go sideways

---

## User Experience Flow

### Example Interaction: Campaign Analysis

```
User types: "Analyze Q4 campaign performance"

[Main Agent Stream]
"Let me fetch your Q4 campaigns...
↓ (MCP: Google Ads API)

I found 12 campaigns with total spend of $45,230.
Three campaigns are underperforming:
- Campaign A: 2.3% CTR (avg: 4.1%)
- Campaign B: $8.50 CPC (avg: $5.20)
- Campaign C: 1.2% conversion rate (avg: 3.1%)

Let me analyze the keywords..."

[Display Agent Stream - Watching]
Pattern match: "12 campaigns" + "performance metrics" + "3 underperforming"
→ Decision: Create performance table with highlighting

[Canvas Updates]
→ Performance table appears (top-left)
  - 12 rows (campaigns)
  - Columns: Name, CTR, CPC, Conv Rate, Spend
  - 3 rows highlighted in red
  - Sparklines showing 30-day trends
  - Auto-sorted by performance

[Main Agent Continues]
"Campaign A's keywords show high impressions but low clicks.
Top keywords:
1. 'enterprise software' - 0.8% CTR
2. 'business solutions' - 1.2% CTR
..."

[Display Agent Reacts]
Pattern match: "keywords" + "low CTR" + list format
→ Decision: Create keyword analysis window

[Canvas Updates]
→ Keyword window appears (top-right)
  - Interactive list
  - CTR bars (visual)
  - Search volume indicators
  - Suggested bid adjustments

[Main Agent Continues Analysis]
[Display Agent Continues Creating Visualizations]
[User can type at any time]
```

---

## Display Agent Pattern Matching Rules

The display agent uses lightweight pattern recognition (not heavy NLP) to trigger visualizations:

### Data Patterns
- **Lists with metrics** → Table or Cards
- **Comparison (A vs B)** → Comparison View
- **Time series data** → Chart
- **Geographic mentions** → Map (if lat/long available)
- **Task/checklist format** → Task Window
- **Status updates** → Activity Feed
- **Single key metric** → Metric Badge

### Context Clues
- "Comparing..." → Side-by-side layout
- "Trend over..." → Line chart
- "Distribution of..." → Bar chart or histogram
- "Top 10..." → Ranked list
- "Here's the plan:" → Task window

### Adaptive Behavior
- < 10 items → Cards (scannable)
- 10-50 items → Table (sortable/filterable)
- 50+ items → Virtualized grid + search
- Has trends → Add sparklines inline
- Has outliers → Use color coding

---

## Component Rendering System

### Lightweight Protocol

Display agent outputs minimal commands:

```json
{
  "action": "render",
  "componentId": "perf-table-1",
  "type": "DataTable",
  "position": "auto",
  "data": {
    "columns": ["Campaign", "CTR", "CPC", "Conversions"],
    "rows": [...],
    "highlight": [0, 3, 7],
    "sort": "CTR-asc"
  }
}
```

### Frontend Smart Renderer

Frontend has ~30-50 pre-built React components that handle:
- Responsive sizing
- Theme/color application
- Animations (Framer Motion)
- Interactions
- State management

### Component Library (Pre-built)

**Data Display:**
- DataTable (sortable, filterable, color-coded)
- DataCards (grid of metric cards)
- Chart (line, bar, area, pie)
- ComparisonView (side-by-side)
- MetricBadge (single stat with trend)
- Sparkline (inline mini-chart)
- HeatMap (matrix visualization)

**Interaction:**
- TaskWindow (checklist with progress)
- Form (input collection)
- Slider (value adjustment)
- ButtonGroup (action choices)

**Layout:**
- Window (draggable, resizable container)
- Panel (fixed region)
- Tabs (tabbed content)
- Split (resizable panes)

**Notifications:**
- Toast (temporary notification)
- Alert (persistent message)
- ActivityFeed (scrolling updates)
- Badge (small indicator)

**Rich Content:**
- Markdown (formatted text)
- CodeBlock (syntax highlighted)
- Image (display images)
- Icon (Lucide icons)

### Custom Component Generation (Rare)

For truly unique visualizations, display agent can generate React code:

```json
{
  "action": "renderCustom",
  "componentId": "custom-viz-1",
  "code": "export default function CustomViz({ data }) { return <div>...</div> }"
}
```

Code runs in sandboxed iframe with whitelisted libraries.

---

## Layout Management

### Dynamic Canvas

- Components placed automatically unless position specified
- Smart positioning algorithm:
  - Related items cluster together
  - Important items get prominent positions
  - Avoids overlaps
  - Responsive to window resize

### User Control

- Can drag components to reposition
- Can resize windows
- Can minimize/maximize
- Can manually close components
- Settings to adjust terminal/canvas split

### Terminal Zone (25%+ minimum)

Fixed region for:
- User input (command line style)
- Conversation history
- Status indicators (AI thinking, MCP active, etc.)
- System notifications

---

## MCP Integration

### Google Ads API MCP

**Operations:**
- Fetch campaigns, ad groups, keywords
- Get performance metrics (CTR, CPC, conversions, spend)
- Update bids, budgets, ad copy
- Create new campaigns/ad groups
- Pause/enable entities

**Display Integration:**
When MCP call happens:
- Activity feed shows: "🔍 Fetching campaign data..."
- On success: "✓ Retrieved 12 campaigns"
- Data automatically available to display agent

### Memory MCP

**Operations:**
- Store conversation insights
- Recall past optimizations
- Track campaign history
- Remember user preferences

**Display Integration:**
- Subtle notification: "💾 Recalled Q3 optimization insights"
- Timeline view showing memory retrievals
- Non-intrusive (bottom-right corner)

---

## Visual Design System

### Aesthetic (VEILos4-inspired)

**Color Palette:**
- Base: Dark theme (#0A0A0A background)
- Accents: Blue (#3B82F6), Purple (#8B5CF6), Green (#10B981), Red (#EF4444)
- Gradients: Subtle gradients on metric cards
- Glassmorphism: Frosted glass effect on floating windows

**Typography:**
- Primary: Inter or SF Pro (modern, readable)
- Code: Fira Code (if showing code/data)
- Not limited to monospace

**Animations:**
- Smooth transitions (300ms ease)
- Components slide in from edges
- Tasks check off with animation
- Metrics count up when displayed
- Hover effects on interactive elements
- Loading states (shimmer, pulse)

**Layout:**
- Generous spacing
- Cards with rounded corners (8px-12px)
- Drop shadows for depth
- Responsive grid system

### Component Styling

All components support:
- Dark/light theme (dark default)
- Color coding for data (performance-based)
- Size variants (sm, md, lg)
- Animation variants (slide, fade, scale)
- Custom styling via Tailwind classes

---

## Settings & Configuration

### Boot Settings Panel

**AI Configuration:**
- Primary model selection (Sonnet 4 / Opus)
- Display agent toggle (on/off)
- Temperature settings
- Max tokens

**Layout Preferences:**
- Terminal/Canvas split ratio (25/75 default, adjustable)
- Default component positions
- Animation speed
- Theme customization

**MCP Configuration:**
- Google Ads API endpoint
- Memory server endpoint
- API credentials (secure storage)
- Connection status

**Display Preferences:**
- Auto-visualization (on/off)
- Component placement (auto/manual)
- Notification verbosity
- Activity feed visibility

---

## Performance Considerations

### Token Efficiency

**Main Agent:**
- No UI-related tokens
- Focus entirely on Google Ads domain
- Average response: 200-500 tokens

**Display Agent:**
- Lightweight pattern matching
- Minimal output format (JSON commands)
- Average response: 20-100 tokens
- Only activates when visualization needed

### Streaming

- Both agents stream responses
- Text appears immediately
- Components render as data arrives
- No waiting for complete response

### WebSocket Benefits

- Single persistent connection
- No HTTP overhead
- Real-time bidirectional communication
- Automatic reconnection

### Caching

- MCP responses cached (configurable TTL)
- Common queries memoized
- Component renders optimized (React memoization)

---

## Security

### API Keys
- Stored in environment variables
- Never sent to browser
- Backend handles all API calls

### Code Execution
- Custom components run in sandboxed iframe
- No access to localStorage, cookies, or network
- Only whitelisted libraries available
- Props are read-only

### MCP Security
- Python backend acts as secure proxy
- Validates all requests
- Rate limiting on API calls
- Audit logging

---

## Development Setup

### Local Development

```bash
# Terminal 1: Python MCP Backend
cd mcp-backend
python api_server.py  # Port 5000

# Terminal 2: Next.js Frontend
cd google-ads-interface
npm install
npm run dev          # Port 3000
```

### Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_ADS_MCP_URL=http://localhost:5000
MEMORY_MCP_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### Project Structure

```
google-ads-interface/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main interface
│   │   ├── layout.tsx            # Root layout
│   │   └── api/
│   │       ├── chat/route.ts     # Main agent WebSocket
│   │       └── display/route.ts  # Display agent WebSocket
│   ├── components/
│   │   ├── terminal/             # Terminal zone components
│   │   ├── canvas/               # Canvas and layout
│   │   ├── ui/                   # UI component library
│   │   └── visualizations/       # Data viz components
│   ├── lib/
│   │   ├── claude.ts             # Claude SDK wrapper
│   │   ├── mcp.ts                # MCP client
│   │   ├── websocket.ts          # WebSocket utilities
│   │   └── display-patterns.ts   # Pattern matching rules
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
├── docs/
│   └── plans/
│       └── 2025-10-20-google-ads-ai-interface-design.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Next.js project setup
- [ ] Basic layout (terminal + canvas zones)
- [ ] WebSocket infrastructure
- [ ] Claude SDK integration (main agent only)
- [ ] Simple text conversation working

### Phase 2: Display Agent (Week 2)
- [ ] Second WebSocket for display agent
- [ ] Pattern matching system
- [ ] Basic component library (5-10 components)
- [ ] Auto-rendering from patterns
- [ ] Component placement algorithm

### Phase 3: MCP Integration (Week 3)
- [ ] Connect to Python MCP backend
- [ ] Google Ads API integration
- [ ] Memory MCP integration
- [ ] Activity feed for MCP calls
- [ ] Error handling

### Phase 4: Rich Components (Week 4)
- [ ] Complete component library (30+ components)
- [ ] Advanced visualizations (charts, maps, etc.)
- [ ] Animations and transitions
- [ ] Interaction handlers
- [ ] Custom component sandbox

### Phase 5: Polish & Features (Week 5)
- [ ] Settings panel
- [ ] Theme customization
- [ ] Performance optimization
- [ ] Error boundaries
- [ ] Loading states

### Phase 6: CloudOne Ready (Week 6)
- [ ] Documentation
- [ ] Demo scenarios
- [ ] Performance testing
- [ ] Security audit
- [ ] Deployment guide

---

## Success Criteria

### Technical
- ✓ Main agent responses stream in < 500ms
- ✓ Display agent adds < 100ms overhead
- ✓ Components render in < 100ms
- ✓ WebSocket reconnects automatically
- ✓ No memory leaks after 1hr session

### User Experience
- ✓ User can always type (25% terminal minimum)
- ✓ Visualizations appear automatically
- ✓ Interface feels responsive and smooth
- ✓ MCP calls are visible but not intrusive
- ✓ Errors are handled gracefully

### Showcase (CloudOne)
- ✓ Visually impressive (modern, animated)
- ✓ Novel approach (dual-agent architecture)
- ✓ Practically useful (real Google Ads work)
- ✓ Technically sound (production-ready code)
- ✓ Scalable (can extend to other domains)

---

## Future Enhancements

### Multi-Account Support
- Switch between Google Ads accounts
- Compare accounts side-by-side
- Cross-account insights

### Collaboration
- Multiple users viewing same session
- Shared canvas
- Real-time collaboration

### Advanced Visualizations
- 3D data exploration (Three.js)
- Interactive network graphs
- Predictive modeling visualization

### Learning System
- Display agent learns which visualizations work best
- User feedback on component usefulness
- Personalized visualization preferences

### Voice Interface
- Voice input for queries
- Text-to-speech for responses
- Hands-free optimization

---

## Conclusion

This design creates a fundamentally new type of AI interface where:
1. The main AI focuses purely on domain expertise
2. A separate AI handles all visualization decisions
3. No scripting or rigid workflows
4. Every interaction is unique and adaptive
5. Zero performance overhead

The result is an interface that feels intelligent, responsive, and purpose-built for Google Ads optimization, while being generalizable to other domains.

**Ready for implementation.**
