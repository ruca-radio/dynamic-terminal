# UI Canvas Syntax v2 - Complete Layout System

## Overview

Control the dynamic canvas with HTML/CSS-inspired syntax. Components can be positioned, styled, and organized into layouts.

---

## Layout Commands

### Clear Canvas
```
::clear::
```
Removes all components from canvas. Use before starting a new analysis.

### Layout Container
```
::layout type="grid" cols="2" gap="20"::
  [components here]
::/layout::
```

**Layout Types:**
- `grid` - CSS Grid layout
- `flex` - Flexbox layout
- `stack` - Vertical stack
- `absolute` - Absolute positioning

**Grid Options:**
- `cols="2"` - Number of columns
- `rows="2"` - Number of rows
- `gap="20"` - Gap between items (pixels)

**Flex Options:**
- `direction="row|column"` - Flex direction
- `wrap="wrap|nowrap"` - Wrap behavior
- `justify="start|center|end|between"` - Justify content
- `align="start|center|end"` - Align items

---

## Component Syntax

### Universal Attributes

All components support:
```
::component:: {
  "id": "unique-id",           // Optional: for updates
  "style": {
    "width": "500px",          // Can use px, %, vh, vw
    "height": "300px",
    "maxHeight": "400px",
    "background": "#1a1a1a",
    "border": "1px solid #333",
    "borderRadius": "12px",
    "padding": "20px",
    "shadow": "large|medium|small|none",
    "position": {"x": 20, "y": 20},  // Absolute positioning
    "zIndex": 10,
    "overflow": "auto|hidden|scroll"
  }
}
::/component::
```

---

## Component Types

### 1. Data Table
```
::table:: {
  "title": "Campaign Performance",
  "columns": ["Campaign", "CTR", "CPC", "Status"],
  "rows": [
    {"Campaign": "Brand", "CTR": "7.5%", "CPC": "$1.23", "Status": "✓ Good"},
    {"Campaign": "Generic", "CTR": "3.5%", "CPC": "$1.45", "Status": "⚠ Needs Work"}
  ],
  "highlight": [1],              // Row indices to highlight in red
  "sortable": true,
  "colorCode": {
    "CTR": {"type": "gradient", "low": "#ef4444", "high": "#10b981"},
    "Status": {"type": "badge", "Good": "green", "Needs Work": "yellow"}
  },
  "style": {"height": "400px", "overflow": "auto"}
}
::/table::
```

### 2. Task Window
```
::tasks:: {
  "title": "Optimization Priorities",
  "tasks": [
    {"id": "1", "text": "Pause low-performing keywords", "status": "completed"},
    {"id": "2", "text": "Add negative keywords", "status": "in_progress"},
    {"id": "3", "text": "Test new ad copy", "status": "pending"}
  ],
  "checkable": true,             // Allow user to check off
  "style": {"width": "350px"}
}
::/tasks::
```

### 3. Metric Card
```
::metric:: {
  "title": "Click-Through Rate",
  "value": "3.45%",
  "trend": 12.5,
  "trendLabel": "vs last week",
  "color": "blue|green|red|purple",
  "icon": "📊",                  // Optional emoji icon
  "style": {"width": "250px"}
}
::/metric::
```

### 4. Chart
```
::chart:: {
  "title": "Weekly Performance",
  "type": "line|bar|area",
  "data": [
    {"day": "Mon", "clicks": 120, "conversions": 3},
    {"day": "Tue", "clicks": 145, "conversions": 4}
  ],
  "xKey": "day",
  "yKey": "clicks",
  "series": ["clicks", "conversions"],  // Multiple lines
  "colors": {"clicks": "#3B82F6", "conversions": "#10B981"},
  "style": {"height": "300px"}
}
::/chart::
```

### 5. Text Panel
```
::panel:: {
  "title": "Action Plan",
  "content": "## Top Recommendations\n\n**1. Generic Keywords**...",
  "format": "markdown|html|plain",
  "style": {"width": "400px", "overflow": "auto"}
}
::/panel::
```

### 6. Comparison Cards
```
::compare:: {
  "title": "Campaign Comparison",
  "items": [
    {
      "label": "Campaign A",
      "metrics": {"CTR": "3.7%", "CPC": "$1.23"},
      "status": "good"
    },
    {
      "label": "Campaign B",
      "metrics": {"CTR": "2.9%", "CPC": "$1.45"},
      "status": "warning"
    }
  ],
  "style": {"width": "600px"}
}
::/compare::
```

### 7. Progress Indicator
```
::progress:: {
  "title": "Campaign Budget",
  "value": 75,                   // Percentage
  "max": 100,
  "label": "$7,500 of $10,000",
  "color": "blue",
  "style": {"width": "300px"}
}
::/progress::
```

---

## Complete Example

```
::clear::

::layout type="grid" cols="3" gap="20"::

::metric:: {
  "title": "Avg CTR",
  "value": "3.45%",
  "trend": 12,
  "color": "green"
}
::/metric::

::metric:: {
  "title": "Avg CPC",
  "value": "$1.34",
  "trend": -5,
  "color": "blue"
}
::/metric::

::metric:: {
  "title": "Conv Rate",
  "value": "2.1%",
  "trend": 8,
  "color": "purple"
}
::/metric::

::/layout::

::layout type="flex" direction="row" gap="20"::

::table:: {
  "title": "Campaign Performance",
  "columns": ["Campaign", "CTR", "CPC", "Status"],
  "rows": [...],
  "style": {"width": "60%", "maxHeight": "500px", "overflow": "auto"}
}
::/table::

::panel:: {
  "title": "Recommendations",
  "content": "## Next Steps\n\n1. Increase bid on...",
  "format": "markdown",
  "style": {"width": "40%", "maxHeight": "500px", "overflow": "auto"}
}
::/panel::

::/layout::

::tasks:: {
  "title": "Action Items",
  "tasks": [...],
  "style": {"width": "100%"}
}
::/tasks::
```

---

## Best Practices

1. **Start with `::clear::`** when showing a new analysis
2. **Use layouts** to organize components (grid for dashboards, flex for panels)
3. **Set maxHeight + overflow** for scrollable content
4. **Use consistent widths** (%, not px) for responsive design
5. **Color code data** in tables for quick scanning
6. **Group related metrics** in grid layouts
7. **Keep text panels** to the right for reading

---

## Styling Guide

### Colors
- `blue` - Primary actions, neutral metrics
- `green` - Positive trends, success
- `red` - Warnings, underperforming
- `purple` - Secondary metrics
- `yellow` - Caution, needs attention

### Shadows
- `none` - Flat design
- `small` - Subtle depth
- `medium` - Standard elevation
- `large` - Prominent cards

### Sizes
- Metric cards: 200-300px width
- Tables: 50-70% width when side-by-side
- Text panels: 30-40% width
- Full-width components: 100%

---

## Update vs Create

To update an existing component:
```
::table id="campaigns-table":: {
  // New data
}
::/table::
```

If `id` matches existing component, it updates instead of creating new.
