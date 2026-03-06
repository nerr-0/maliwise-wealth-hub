

# Add Stock Broker / Equities Category to Platforms

## Problem
There is currently no category for stockbrokers in the Platforms tab. Users holding shares on the Nairobi Securities Exchange (NSE) through licensed brokers have no place to connect or track those assets.

## Solution
Add a new **"Equities (Stock Brokers)"** category to both the Platforms tab and the AddPlatformDialog, populated with licensed Kenyan stockbrokers.

## Changes

### 1. `src/pages/EnhancedDashboard.tsx` — Platforms tab
Add a new category entry in the platforms array:
```
{
  category: "Equities (Stock Brokers)",
  platforms: [
    { name: "AIB-AXYS Africa", type: "Stock Broker", status: "Not Connected" },
    { name: "Faida Investment Bank", type: "Stock Broker", status: "Not Connected" },
  ]
}
```

### 2. `src/components/AddPlatformDialog.tsx` — PLATFORM_OPTIONS
Add a new key to the options map:
```
"Equities (Stock Brokers)": [
  "AIB-AXYS Africa",
  "Faida Investment Bank",
  "SBG Securities",
  "Genghis Capital",
  "Standard Investment Bank",
  "ABC Capital",
  "Dyer & Blair",
  "EFG Hermes",
  "KCB Capital",
  "NCBA Investment Bank",
  "Kingdom Securities",
]
```

### 3. `src/components/TransactionForm.tsx` — asset types
Add `equities` / `stocks` as an asset type option so users can also manually record share purchases/sales (for cases where broker integration isn't live yet). This will let the existing portfolio trigger handle stock holdings too.

These are UI-only changes — no database migration needed since `asset_type` and `platform_type` are free-text columns.

