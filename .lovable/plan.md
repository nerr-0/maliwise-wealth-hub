

# Plan: Fix Welcome Message and Apply Brand Colors

## Overview

Two changes are needed:

1. **Welcome message** -- The Enhanced Dashboard currently shows the full email (`Welcome back, user@example.com`). We'll change it to show the user's first name from their `profiles` table (which has a `full_name` column), falling back to "Investor" if no name is set.

2. **Brand colors throughout the app** -- The app currently uses a mostly white/light theme. Per your design preference (dark theme with green accents), we'll update the CSS variables so the entire app embraces the dark color scheme with green accents consistently.

3. **Build error fix** -- There's a TypeScript error in the edge function (`error` is of type `unknown`). We'll fix that too.

---

## Technical Details

### 1. Welcome Message (EnhancedDashboard.tsx)

- Query the `profiles` table to get the current user's `full_name`
- Extract the first name from `full_name` (split by space, take first part)
- Change line 107 from `Welcome back, {user?.email}` to `Welcome back, {firstName}`
- Fallback chain: first name from profile -> "Investor"

### 2. Brand Colors (src/index.css)

Update the `:root` (light mode) CSS variables to use the dark theme as the default, matching the hero section's dark palette with green accents:

- **Background**: Dark (220 13% 8-10%) instead of white
- **Foreground**: Light text (210 40% 98%) instead of dark
- **Card**: Dark card backgrounds (220 13% 12-14%)
- **Primary**: Keep current dark primary but adjust foreground for contrast
- **Accent**: Keep the green (142 76% 36%) -- this is your brand green
- **Muted/Secondary**: Dark tones instead of light grays
- **Border/Input**: Dark borders to match

This ensures every page (Dashboard, Auth, About, Pricing, Contact) automatically picks up the dark + green brand identity without changing individual component files.

### 3. Edge Function Build Fix (supabase/functions/generate-investment-insights/index.ts)

- Change `error.message` to `(error as Error).message` to fix the TypeScript `unknown` type error

### Files to modify:
- `src/pages/EnhancedDashboard.tsx` -- welcome message with profile name
- `src/index.css` -- dark brand color scheme as default
- `supabase/functions/generate-investment-insights/index.ts` -- TypeScript fix

