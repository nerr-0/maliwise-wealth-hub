

# Redesign Platform Cards — Vuka-Inspired Minimal Style

## Overview
Redesign all platform cards in the Platforms tab to be larger, cleaner, and more visual — with logo placeholder areas, colored status dots (green for connected, orange for disconnected), and improved typography. The existing connect/disconnect logic stays identical.

## Changes

### `src/pages/EnhancedDashboard.tsx` — Platform card markup (lines ~546-610 and ~642-700)

**Current card**: Small, dense `Card` with stacked text and a full-width button. No visual identity for the platform.

**New card design**:
- **Larger card** with `min-h-[160px]` and more padding (`p-6`)
- **Logo placeholder**: A 48x48 rounded square at the top-left with the platform's first letter and a subtle background color — gives each card visual identity
- **Status dot**: A small colored circle (green `bg-green-500` / orange `bg-orange-400`) next to a "Connected" or "Not Connected" label, replacing the current Badge and orange text
- **Cleaner typography**: Platform name in `text-base font-semibold`, type in `text-xs text-muted-foreground uppercase tracking-wide`
- **Button styling**: Connect button uses `variant="default"` (filled green) for better CTA visibility; Disconnect stays `variant="outline"` with destructive text
- Connected cards get a subtle left green border (`border-l-4 border-l-primary`) instead of full border tint

**Visual structure per card**:
```text
┌──────────────────────────────┐
│  ┌────┐                      │
│  │ KC │   KCB Bank        ●  │
│  └────┘   BANKING             │
│                               │
│  [ Connect ]                  │
└──────────────────────────────┘
```

- The letter avatar uses the platform's initials (e.g., "KC" for KCB Bank, "AL" for Alpaca)
- Background color of the avatar cycles through a set of muted colors based on platform name hash

**Same pattern applied to offshore broker cards** (lines ~642-700) — identical card structure, just with the existing sync button for connected brokers instead of disconnect.

**"Add" card** stays dashed-border but gets the same `min-h-[160px]` height for consistency.

### Category headers
- Add a subtle bottom border under each category heading for visual separation
- Keep the existing `h3` but add `pb-2 border-b border-border` styling

### No other files change
All connect/disconnect/dialog logic remains untouched. This is purely a visual/layout change within the Platforms `TabsContent`.

## Files Modified
- `src/pages/EnhancedDashboard.tsx` — platform card markup and styling only

