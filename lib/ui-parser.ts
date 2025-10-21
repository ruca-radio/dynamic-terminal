import type { Component } from "@/types";
import { generateId } from "./utils";

export interface ParsedContent {
  text: string;
  components: Component[];
  commands: UICommand[];
}

export interface UICommand {
  type: "clear" | "layout";
  data?: any;
}

/**
 * Parse UI syntax from assistant messages
 * Supports: components, layouts, clear command
 */
export function parseUICommands(content: string): ParsedContent {
  const components: Component[] = [];
  const commands: UICommand[] = [];
  let text = content;

  // Check for ::clear:: command
  if (content.includes("::clear::")) {
    commands.push({ type: "clear" });
    text = text.replace(/::clear::/g, "");
  }

  // Parse layout containers (::layout::...components...::/layout::)
  const layoutRegex = /::(layout)\s+([^:]+)::(.+?)::\/(layout)::/gs;
  let layoutMatch;

  while ((layoutMatch = layoutRegex.exec(content)) !== null) {
    const attrs = parseAttributes(layoutMatch[2]);
    const innerContent = layoutMatch[3];

    // Parse components inside layout
    const innerParsed = parseComponents(innerContent);

    // Create layout wrapper component
    const layoutComponent: Component = {
      id: `layout-${generateId()}`,
      type: "Layout",
      position: "auto",
      size: { width: 0, height: 0 }, // Layout handles its own size
      props: {
        type: attrs.type || "flex",
        cols: parseInt(attrs.cols || "1"),
        rows: parseInt(attrs.rows || "1"),
        gap: parseInt(attrs.gap || "20"),
        direction: attrs.direction || "row",
        children: innerParsed,
      },
    };

    components.push(layoutComponent);
    text = text.replace(layoutMatch[0], "");
  }

  // Parse standalone components
  const standaloneComponents = parseComponents(content);
  components.push(...standaloneComponents);

  // Remove all component syntax from text
  text = text.replace(/::(table|tasks|metric|chart|panel|compare|progress)::[\s\S]*?::\/(table|tasks|metric|chart|panel|compare|progress)::/g, "");

  return {
    text: text.trim(),
    components,
    commands,
  };
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w+)="([^"]+)"/g;
  let match;

  while ((match = regex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }

  return attrs;
}

function parseComponents(content: string): Component[] {
  const components: Component[] = [];

  // Regex to match ::type::...data...::/type::
  const regex = /::(table|tasks|metric|chart|panel|compare|progress)::(.+?)::\/(table|tasks|metric|chart|panel|compare|progress)::/gs;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const type = match[1];
    const dataStr = match[2].trim();
    const closeType = match[3];

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
        panel: "TextPanel",
        compare: "ComparisonCard",
        progress: "ProgressBar",
      };

      const component: Component = {
        id: data.id || `${type}-${generateId()}`,
        type: componentTypeMap[type] || "DataTable",
        position: data.style?.position || "auto",
        size: {
          width: parseInt(data.style?.width) || 500,
          height: parseInt(data.style?.height) || 300,
        },
        props: data,
        zIndex: data.style?.zIndex,
      };

      components.push(component);
    } catch (e) {
      console.error(`Failed to parse ${type} data:`, e);
    }
  }

  return components;
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
