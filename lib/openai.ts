import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_DISPLAY_MODEL = "gpt-4o"; // GPT-4o with vision support

export const OPENAI_DISPLAY_SYSTEM_PROMPT = `You watch Google Ads conversations and create visualizations when useful.

Look for:
- Campaign comparisons → DataTable
- Action items → TaskWindow
- Key metrics → MetricCard
- Trends → Chart

Output ONLY JSON (no markdown, no explanation):
{"action": "render", "componentId": "campaigns-1", "type": "DataTable", "position": "auto", "size": {"width": 500, "height": 300}, "props": {"title": "Campaign Performance", "columns": ["Campaign", "CTR", "CPC"], "rows": [{"Campaign": "A", "CTR": "3.7%", "CPC": "$1.23"}]}}

Or if no visualization needed:
{"action": "none"}

Examples:
- "Campaign A: 3.7% CTR, Campaign B: 2.9% CTR" → Create comparison table
- "Steps: 1. Analyze, 2. Optimize, 3. Test" → Create task window
- "Your CTR is 3.45%" → Create metric card

Be minimal. Only visualize when it genuinely helps.`;
