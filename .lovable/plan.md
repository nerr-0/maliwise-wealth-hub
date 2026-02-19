

# Resume: Real-Time Data Implementation

## Status Check

Nothing from the real-time plan has been built yet. Here's what we need to do:

---

## Step 1: Database Migration -- Enable Realtime

Enable Supabase Realtime subscriptions on two tables so the dashboard auto-updates when data changes.

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_holdings;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
```

---

## Step 2: Create `src/hooks/useRealtimePortfolio.tsx`

A new hook that:
- Subscribes to Supabase Realtime channels for `portfolio_holdings` and `transactions`
- On any INSERT, UPDATE, or DELETE event, invalidates the relevant React Query cache keys
- Cleans up subscriptions on unmount

---

## Step 3: Create `supabase/functions/fetch-market-prices/index.ts`

A new edge function that:
- Accepts a JSON body with an array of asset symbols (e.g., `["SCOM.XNAI", "KCB.XNAI"]`)
- Reads the `ALPHA_VANTAGE_API_KEY` secret
- Calls the Alpha Vantage `GLOBAL_QUOTE` endpoint for each symbol
- Returns a map of symbol to current price
- Includes proper CORS headers

Also update `supabase/config.toml` to disable JWT verification for this function (we'll validate auth in code).

---

## Step 4: API Key Requirement

Before the market prices feature works, you'll need a **free Alpha Vantage API key**:
1. Go to [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free key (no credit card needed)
3. I'll prompt you to securely store it as a Supabase secret

I'll request this secret before writing the edge function code.

---

## Step 5: Create `src/hooks/useMarketPrices.tsx`

A new hook that:
- Takes the user's holdings and extracts asset symbols
- Calls the `fetch-market-prices` edge function via `supabase.functions.invoke()`
- Polls every 5 minutes using React Query's `refetchInterval`
- Merges live prices with holdings, falling back to stored `current_value` for unsupported assets
- Tracks a "last updated" timestamp

---

## Step 6: Update `src/pages/EnhancedDashboard.tsx`

- Import and activate the `useRealtimePortfolio` hook for live database sync
- Import and use `useMarketPrices` to display live prices
- Add a green pulsing "Live" badge in the header indicating real-time connection
- Show "Last updated: X minutes ago" near the portfolio value
- Update holdings cards to show live price, daily change percentage, and real-time gain/loss with green/red color coding
- Recalculate total portfolio value using live prices when available

---

## Execution Order

1. Run database migration (enable Realtime)
2. Request `ALPHA_VANTAGE_API_KEY` secret from you
3. Create `useRealtimePortfolio.tsx` hook
4. Create `fetch-market-prices` edge function + update config.toml
5. Create `useMarketPrices.tsx` hook
6. Update `EnhancedDashboard.tsx` with live indicators and real-time data

