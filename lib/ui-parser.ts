import type { Component } from "@/types";
import { generateId } from "./utils";

export interface ParsedContent {
  text: string;
  components: Component[];
}

/**
 * Parse UI syntax from assistant messages
 * Syntax: ::type::...data...::/type::
 */
export function parseUICommands(content: string): ParsedContent {
  const components: Component[] = [];
  let text = content;

  // Regex to match ::type::...data...::/type::
  const regex = /::(table|tasks|metric|chart)::(.+?)::\/(table|tasks|metric|chart)::/gs;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const type = match[1];
    const dataStr = match[2].trim();
    const closeType = match[3];

    // Validate matching tags
    if (type !== closeType) {
      console.error(`Mismatched tags: ::${type}:: and ::/${closeType}::`);
      continue;
    }

    try {
      const data = JSON.parse(dataStr);

      // Map type to component type
      const componentTypeMap: Record<string, string> = {
        table: "DataTable",
        tasks: "TaskWindow",
        metric: "MetricCard",
        chart: "Chart",
      };

      const component: Component = {
        id: `${type}-${generateId()}`,
        type: componentTypeMap[type] || "DataTable",
        position: "auto",
        size: { width: 500, height: 300 },
        props: data,
      };

      components.push(component);

      // Remove the UI command from text
      text = text.replace(match[0], "");
    } catch (e) {
      console.error(`Failed to parse ${type} data:`, e);
    }
  }

  return {
    text: text.trim(),
    components,
  };
}

/**
 * Generate syntax documentation for the main agent
 */
export function getUISyntaxDocs(): string {
  return `
## UI Canvas Syntax

You can create visual components by using this syntax:

**Data Table:**
::table::
{
  "title": "Campaign Performance",
  "columns": ["Campaign", "CTR", "CPC", "Conversions"],
  "rows": [
    {"Campaign": "Brand", "CTR": "3.7%", "CPC": "$1.23", "Conversions": "45"},
    {"Campaign": "Generic", "CTR": "2.9%", "CPC": "$1.45", "Conversions": "32"}
  ],
  "highlight": [0]
}
::/table::

**Task List:**
::tasks::
{
  "title": "Optimization Plan",
  "tasks": [
    {"id": "1", "text": "Analyze keyword performance", "status": "completed"},
    {"id": "2", "text": "Adjust bids for top keywords", "status": "in_progress"},
    {"id": "3", "text": "Test new ad copy", "status": "pending"}
  ]
}
::/tasks::

**Metric Card:**
::metric::
{
  "title": "Click-Through Rate",
  "value": "3.45%",
  "trend": 12.5,
  "trendLabel": "vs last week",
  "color": "green"
}
::/metric::

**Chart:**
::chart::
{
  "title": "Weekly Performance",
  "type": "line",
  "data": [
    {"day": "Mon", "clicks": 120},
    {"day": "Tue", "clicks": 145},
    {"day": "Wed", "clicks": 132}
  ],
  "xKey": "day",
  "yKey": "clicks",
  "color": "#3B82F6"
}
::/chart::

Use these when showing data, metrics, or action plans. The UI will automatically render on the canvas.
`;
}
