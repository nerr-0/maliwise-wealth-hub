

# Plan: Real-Time Data for MaliWise

## Overview

We'll add two real-time capabilities:

1. **Live Database Sync** -- When portfolio holdings or transactions change in the database, the dashboard updates instantly without page refresh (using Supabase Realtime subscriptions).

2. **Live Market Prices** -- Fetch current stock/asset prices from an external API and display them alongside your holdings, showing live gains/losses.

---

## Part 1: Live Database Sync (Supabase Realtime)

### What it does
When you add a transaction, update a holding, or any change happens in the database, the dashboard will reflect it immediately -- no refresh needed. This also works if data changes from another device or session.

### How it works
- We'll create a new hook (`useRealtimePortfolio`) that subscribes to Supabase Realtime channels for the `portfolio_holdings` and `transactions` tables
- When an INSERT, UPDATE, or DELETE event is detected, it automatically refreshes the React Query cache, causing the UI to update
- Subscriptions are cleaned up when you leave the dashboard

### What needs to change
- **Enable Realtime** on `portfolio_holdings` and `transactions` tables via a database migration
- **New hook**: `src/hooks/useRealtimePortfolio.tsx` -- subscribes to changes and invalidates queries
- **Update `EnhancedDashboard.tsx`** -- use the new realtime hook

---

## Part 2: Live Market Prices (Alpha Vantage API)

### What it does
For each holding in your portfolio, we'll fetch the latest market price and calculate real-time profit/loss. This replaces the static `current_value` with live data.

### How it works
- **Alpha Vantage** offers a free API with stock price data (including some NSE-listed stocks via the exchange code `XNAI`)
- We'll create a Supabase Edge Function that fetches prices from Alpha Vantage and returns them
- The dashboard will call this edge function periodically (every 5 minutes) to update prices
- For assets not available on Alpha Vantage (e.g., M-Pesa, Chama investments), the app will fall back to the manually entered `current_value`

### What you'll need
- A **free Alpha Vantage API key** (get one at alphavantage.co -- it's free, no credit card needed)
- We'll store it securely as a Supabase secret

### What needs to change
- **New Edge Function**: `supabase/functions/fetch-market-prices/index.ts` -- fetches prices from Alpha Vantage
- **New hook**: `src/hooks/useMarketPrices.tsx` -- calls the edge function and caches results
- **Update `EnhancedDashboard.tsx`** -- show live prices with a "last updated" indicator
- **Update holdings display** -- show live price vs. average cost with real-time gain/loss

---

## Technical Details

### Database Migration
```sql
-- Enable Realtime on portfolio_holdings and transactions
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_holdings;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
```

### New Hook: useRealtimePortfolio.tsx
- Subscribe to Supabase Realtime channels for both tables
- Filter events to only the current user's rows
- On any change event (INSERT/UPDATE/DELETE), call `queryClient.invalidateQueries` for the relevant query keys
- Return cleanup function to unsubscribe

### Edge Function: fetch-market-prices
- Accepts a list of asset symbols
- Calls Alpha Vantage `GLOBAL_QUOTE` endpoint for each symbol
- Returns current prices mapped by symbol
- Includes CORS headers for browser calls
- Uses the `ALPHA_VANTAGE_API_KEY` secret

### New Hook: useMarketPrices.tsx
- Calls the edge function with the user's holding symbols
- Polls every 5 minutes (configurable)
- Merges live prices with holdings data
- Falls back to stored `current_value` for unsupported assets

### Dashboard Updates
- Add a "Live" indicator badge showing real-time status
- Show "Last updated: X minutes ago" for market prices
- Holdings cards show live price, daily change, and total gain/loss
- Green/red color coding based on live performance

### Files to create:
- `src/hooks/useRealtimePortfolio.tsx`
- `src/hooks/useMarketPrices.tsx`
- `supabase/functions/fetch-market-prices/index.ts`

### Files to modify:
- `src/pages/EnhancedDashboard.tsx`
- `supabase/config.toml` (add JWT config for new edge function)

### Database migration:
- Enable Realtime publication on `portfolio_holdings` and `transactions`

### Secret needed:
- `ALPHA_VANTAGE_API_KEY` -- free key from alphavantage.co

