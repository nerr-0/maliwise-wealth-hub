

# Add Offshore Brokers Section with Holdings Sync

## Overview
Add a new "International / Offshore Brokers" section to the Platforms tab with Finch, Alpaca, Simul8or, and Interactive Brokers. Create an edge function to fetch holdings from these brokers (starting with Alpaca which has a real API), and wire the fetched holdings into the existing portfolio balance calculation.

## Changes

### 1. UI: New "International / Offshore Brokers" category in Platforms tab
**File: `src/pages/EnhancedDashboard.tsx`**
- Add a new category block after the existing "Equities (Stock Brokers)" section with the four brokers: Finch, Alpaca, Simul8or, Interactive Brokers
- Each shows "Not Connected" status with a Connect button
- Include the same "Add" card pattern for custom entries

**File: `src/components/AddPlatformDialog.tsx`**
- Add `"International / Offshore Brokers": ["Finch", "Alpaca", "Simul8or", "Interactive Brokers"]` to `PLATFORM_OPTIONS`

### 2. Database: Add `currency` and `source` columns to holdings
**Migration SQL:**
- Add `currency TEXT DEFAULT 'KES'` to `portfolio_holdings` — allows storing USD/EUR holdings
- Add `source TEXT DEFAULT 'manual'` to `portfolio_holdings` — tracks whether holding came from manual entry or broker sync (e.g., `'alpaca'`, `'finch'`)
- Add `currency` column to `transactions` table as well

### 3. Edge Function: `fetch-broker-holdings`
**File: `supabase/functions/fetch-broker-holdings/index.ts`**
- Accepts `{ platform_name: string, platform_id: string }` in the body
- Authenticates the user via JWT
- Looks up the user's `connected_platforms` record to get stored API credentials
- Based on `platform_name`, calls the appropriate broker API:
  - **Alpaca**: Uses Alpaca Trading API (`GET /v2/positions`) to fetch real positions
  - **Finch, Simul8or, Interactive Brokers**: Returns a structured error indicating "API integration coming soon" — these don't have simple public REST APIs like Alpaca
- Upserts fetched positions into `portfolio_holdings` with `source = 'alpaca'` and `currency = 'USD'`
- Returns the synced holdings

### 4. Connect Flow: Store broker credentials
**File: `src/components/ConnectBrokerDialog.tsx`** (new)
- A dialog that appears when clicking "Connect" on an offshore broker
- Collects API Key and API Secret (for Alpaca) or shows "Coming soon" for others
- Saves credentials to `connected_platforms` table with `platform_type = 'offshore_broker'`

### 5. Hook: `useOffshoreBrokerSync`
**File: `src/hooks/useOffshoreBrokerSync.tsx`** (new)
- Calls `fetch-broker-holdings` edge function for each connected offshore platform
- Triggers on dashboard load and provides a manual "Sync" button
- Invalidates `portfolio-holdings` query on success

### 6. Portfolio Balance: Include offshore holdings with currency conversion
**File: `src/pages/EnhancedDashboard.tsx`**
- Update `totalPortfolioValue` calculation to handle USD holdings:
  - Use a hardcoded exchange rate initially (e.g., 1 USD = 129 KES) with a TODO for live rates
  - Holdings with `currency = 'USD'` get multiplied by the rate before summing
- Display currency badge on individual holding cards (KES vs USD)

### 7. Config
**File: `supabase/config.toml`**
- Add `[functions.fetch-broker-holdings]` with `verify_jwt = false`

## Technical Notes

- Alpaca has a straightforward REST API (`api.alpaca.markets`) that returns positions with symbol, qty, market_value, avg_entry_price — maps directly to our `portfolio_holdings` schema
- Finch is primarily an employment/payroll API, not a brokerage — the Connect button will be present but sync will show "integration pending"
- Interactive Brokers uses a complex Client Portal API requiring OAuth — also "integration pending" initially
- Simul8or appears to be a simulation platform — same treatment
- The `connected_platforms` table already stores `api_key` — we'll use that field for broker API keys
- Currency conversion uses a static rate initially; a future enhancement would fetch live FX rates

## Files Modified
- `src/pages/EnhancedDashboard.tsx` — add offshore section + currency-aware balance
- `src/components/AddPlatformDialog.tsx` — add offshore broker options
- `src/components/ConnectBrokerDialog.tsx` — new: credential input dialog
- `src/hooks/useOffshoreBrokerSync.tsx` — new: sync hook
- `supabase/functions/fetch-broker-holdings/index.ts` — new: edge function
- `supabase/config.toml` — register new function
- Database migration — add `currency` and `source` columns

