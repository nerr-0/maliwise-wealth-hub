

# Fix Chart Data, Live Icon, and Welcome Banner

## Three Changes

### 1. Portfolio Performance chart: show full year data
The chart currently only has 6 months of mock data (Jan-Jun), regardless of which period button is selected. Fix this by:
- Expanding the mock data array to 12 months (Jan-Dec)
- Filtering the data based on the selected period (1M = last 1 month, 3M = last 3, 6M = last 6, 1Y = all 12, ALL = all 12)
- Default the selected period to "1Y" instead of "6M"

### 2. Live badge: icon only
Replace the current Badge with "Live" text next to the welcome message with just a small pulsing green dot/radio icon — no text label. This keeps it clean and minimal.

### 3. Welcome message becomes a temporary greeting
Transform the header so that:
- On login, a greeting banner ("Welcome back, {firstName}") appears and auto-fades after 4 seconds
- After it disappears, a compact **navigation bar** remains with: tab shortcuts (Overview, Transactions, AI Insights, Platforms), the live indicator icon, and action buttons (Alerts, Settings, Sign Out)
- This gives users quick navigation at the top of the page at all times

## Technical Details

### File: `src/pages/EnhancedDashboard.tsx`

**Chart data (lines 100-107):** Expand `portfolioData` to 12 months and add filtering logic based on `selectedPeriod`. Change default period from `"6M"` to `"1Y"`.

**Live badge (lines 141-144):** Replace the `Badge` component with a simple `Radio` icon with green color and pulse animation — no surrounding badge or text.

**Header (lines 131-171):** 
- Add a `showGreeting` state that starts `true` and auto-sets to `false` after 4 seconds via `useEffect`
- When `showGreeting` is true, show the welcome message with a fade-out animation
- Always show a slim navigation bar with tab links and action buttons
- The navigation bar replaces the current header structure once the greeting fades

