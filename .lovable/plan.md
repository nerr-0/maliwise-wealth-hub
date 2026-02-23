

# Plan: Implement "Add Platform" Dialog with Full Kenyan Investment Options

## Overview
Make the "Add" button in each platform category functional by opening a dialog that presents a curated list of additional Kenyan investment platforms the user can add to their dashboard.

## Implementation

### 1. Create a new component: `src/components/AddPlatformDialog.tsx`

A dialog component that:
- Accepts the current category name as a prop
- Displays a searchable list of additional platforms for that category
- Lets the user select one or type a custom name
- Adds the selected platform to the displayed list

The dialog will contain a hardcoded options map:

```
Financial Services: M-Pesa, Britam, Old Mutual, Jubilee Insurance, ICEA Lion, Stanbic
Banking: Co-operative Bank, NCBA Bank, Absa Bank Kenya, DTB Bank, Standard Chartered, I&M Bank, Family Bank
Money Market Funds: Sanlam MMF, Britam MMF, Old Mutual MMF, GenAfrica MMF, Nabo Capital MMF, Zimele MMF, ICEA Lion MMF, Madison MMF, Dry Associates MMF, Apollo MMF, AA Kenya MMF
REITs: Acorn I-REIT (additional class), Vaal REIT
Fixed Income: Infrastructure Bonds, M-Akiba, Corporate Bonds, Savings Bonds, Green Bonds
```

The dialog will include:
- A search/filter input at the top
- A scrollable list of platform options with radio-style selection
- A "Custom" option with a text input for platforms not in the list
- "Cancel" and "Add Platform" buttons

### 2. Add state management in `EnhancedDashboard.tsx`

- Add a `useState` for `additionalPlatforms` (an object keyed by category, with arrays of added platform objects)
- Add a `useState` for controlling which category's dialog is open
- Merge `additionalPlatforms` with the hardcoded base platforms when rendering
- Wire the "Add" card's `onClick` to open the dialog for that category

### 3. Update the Platforms tab rendering

- The dashed "Add" card gets an `onClick` handler to open the `AddPlatformDialog`
- Newly added platforms render as regular platform cards (same style as existing ones) with "Not Connected" status
- Users can add multiple platforms per category

## Technical Details

- **No database changes needed** -- added platforms are stored in component state for now (can be persisted to Supabase later)
- **No new dependencies** -- uses existing Dialog, Input, Button, ScrollArea components from the UI library
- **Files to create**: `src/components/AddPlatformDialog.tsx`
- **Files to modify**: `src/pages/EnhancedDashboard.tsx`

