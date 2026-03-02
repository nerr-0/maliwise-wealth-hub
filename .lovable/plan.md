

# Fix: Portfolio Performance Chart Overflow on Mobile

## Problem
The `ChartContainer` component (in `src/components/ui/chart.tsx`) applies `aspect-video` (16:9 ratio) by default. On mobile screens, this forces the chart to be wider than the card, causing it to overflow its container.

## Solution
Override the aspect ratio on the chart containers in the Enhanced Dashboard so they respect the card width instead of forcing a 16:9 ratio.

## Changes

### File: `src/pages/EnhancedDashboard.tsx`

1. **Portfolio Performance chart (line 262)**: Change `className="h-[300px]"` to `className="h-[300px] w-full aspect-auto"` so the chart fills available width without overflowing.

2. **Asset Allocation chart (line 288)**: Same fix -- add `w-full aspect-auto` to prevent overflow on that chart as well.

3. **Header layout (lines 245-258)**: Wrap the title and period buttons in a flex container that stacks vertically on mobile (`flex-col sm:flex-row`) so the period filter buttons don't get squashed on small screens.

### Technical Detail
- `aspect-auto` overrides the default `aspect-video` from `ChartContainer`, letting the explicit height control sizing
- `w-full` ensures the chart respects its parent card's width boundary
- No changes to shared UI components -- fixes are scoped to the dashboard page only

