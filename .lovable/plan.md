

# Enable Account Connection for All Platform Categories

## Problem
Currently, only the offshore brokers section has a working "Connect" button (via `ConnectBrokerDialog`). All Kenyan platform cards have a non-functional "Connect" button. The user wants **all platforms** (Kenyan and offshore) to use a unified connection dialog where users enter their **username/email** and **password** to link their accounts.

## Approach

### 1. Create a unified `ConnectPlatformDialog` component
**File: `src/components/ConnectPlatformDialog.tsx`** (new)

A general-purpose dialog used by **all** platform categories (Financial Services, Banking, MMFs, REITs, Fixed Income, Stock Brokers). It will collect:
- **Email / Username** (text input)
- **Password** (password input)

On submit, it saves to `connected_platforms` table with:
- `platform_name`, `platform_type` (the category)
- `api_key` = `email:password` (same pattern as the existing broker dialog)
- `connection_status` = `'connected'`

The dialog title and description adapt to the platform name (e.g., "Connect KCB Bank — Enter your KCB Bank login credentials").

### 2. Update `ConnectBrokerDialog` to use email/password labels
**File: `src/components/ConnectBrokerDialog.tsx`**

Change the labels from "API Key" / "API Secret" to "Email or Username" / "Password" for all brokers except Alpaca (which genuinely uses API keys). This way offshore brokers also use the friendly credential format.

Actually, since the user wants consistency — change **all** brokers to use "Email or Username" and "Password" labels, including Alpaca. The storage format stays the same (`email:password` concatenated in `api_key` column).

### 3. Wire Kenyan platform "Connect" buttons
**File: `src/pages/EnhancedDashboard.tsx`**

- Add state: `connectPlatform` = `{ name: string, category: string } | null`
- Wire each Kenyan platform card's "Connect" button to open `ConnectPlatformDialog` with the platform name and category
- Check `connectedPlatforms` state to show "Connected" badge and status for Kenyan platforms (same pattern already used for offshore)
- Add a "Disconnect" option for connected platforms
- Refresh `connectedPlatforms` after connect/disconnect

### 4. No database changes needed
The `connected_platforms` table already has all required columns. RLS policies are already in place.

## Files
- **`src/components/ConnectPlatformDialog.tsx`** — new: email/password connection dialog for Kenyan platforms
- **`src/components/ConnectBrokerDialog.tsx`** — update labels to email/password instead of API key/secret
- **`src/pages/EnhancedDashboard.tsx`** — wire Connect buttons for all categories, show real connection status, add disconnect

