

# Plan: Refocus Transactions Tab for Manual/Alternative Assets

## Overview
Redesign the Transactions tab to serve as a ledger for assets that cannot be automatically fetched from broker or platform APIs -- things like motor vehicles, land, art, jewelry, personal loans, and other alternative investments. Stock/bond/REIT transactions will eventually come from connected platforms, so the manual form should focus on these "off-platform" asset types.

## Changes

### 1. Update asset types in TransactionForm
Replace the current asset type options (stock, bond, reit, mmf, etc.) with categories suited to manual entry:

- **Motor Vehicle** -- cars, trucks, motorcycles
- **Land** -- plots, agricultural land
- **Real Estate (Property)** -- houses, apartments, commercial buildings
- **Business** -- business investments, equity in private companies
- **Art & Collectibles** -- paintings, antiques, jewelry
- **Livestock** -- cattle, poultry, etc.
- **Personal Loan (Given)** -- money lent to someone
- **Other** -- catch-all for anything else

The Zod schema and select dropdown will be updated to reflect these new categories.

### 2. Update transaction types
Simplify to: **Purchase**, **Sale**, **Valuation Update** (to record a new estimated value), and **Income** (e.g., rental income from property, dividends from a private business).

### 3. Add descriptive context to the tab
Add an explanatory banner at the top of the Transactions section:
> "Record purchases and sales of assets that aren't tracked by connected platforms -- like vehicles, land, property, or personal investments."

### 4. Database trigger for portfolio sync
Create a Postgres trigger so that when a "purchase" transaction is recorded, a corresponding holding is automatically created/updated in `portfolio_holdings`. "Sale" transactions reduce or remove the holding. This requires:
- A new SQL migration with the trigger function
- A DELETE RLS policy on `portfolio_holdings` (currently missing)

### 5. Add optional fields
Add a "Notes/Description" field to the form so users can record details like location of land, vehicle registration number, etc. This will require adding a `notes` column to the `transactions` table.

## Technical Details

### Files to modify
- `src/components/TransactionForm.tsx` -- new asset types, transaction types, notes field, updated validation
- `src/pages/EnhancedDashboard.tsx` -- add explanatory banner to the Transactions tab section

### Database migration (SQL)
```sql
-- Add notes column to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS notes text;

-- Add DELETE policy for portfolio_holdings
CREATE POLICY "Users can delete own holdings"
  ON portfolio_holdings FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger function: sync holdings from transactions
CREATE OR REPLACE FUNCTION update_holdings_from_transaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.transaction_type = 'purchase' THEN
    INSERT INTO portfolio_holdings (user_id, asset_name, asset_type, quantity, average_cost, current_value)
    VALUES (
      NEW.user_id, NEW.asset_name, NEW.asset_type,
      COALESCE(NEW.quantity, 1),
      NEW.amount,
      NEW.amount
    )
    ON CONFLICT ON CONSTRAINT portfolio_holdings_user_asset_unique
    DO UPDATE SET
      quantity = portfolio_holdings.quantity + COALESCE(NEW.quantity, 1),
      average_cost = (
        (portfolio_holdings.average_cost * portfolio_holdings.quantity)
        + NEW.amount
      ) / (portfolio_holdings.quantity + COALESCE(NEW.quantity, 1)),
      current_value = portfolio_holdings.current_value + NEW.amount,
      last_updated = now();

  ELSIF NEW.transaction_type = 'sale' THEN
    UPDATE portfolio_holdings
    SET quantity = quantity - COALESCE(NEW.quantity, 1),
        current_value = current_value - NEW.amount,
        last_updated = now()
    WHERE user_id = NEW.user_id
      AND asset_name = NEW.asset_name
      AND asset_type = NEW.asset_type;

    DELETE FROM portfolio_holdings
    WHERE user_id = NEW.user_id
      AND asset_name = NEW.asset_name
      AND quantity <= 0;

  ELSIF NEW.transaction_type = 'valuation' THEN
    UPDATE portfolio_holdings
    SET current_value = NEW.amount,
        last_updated = now()
    WHERE user_id = NEW.user_id
      AND asset_name = NEW.asset_name
      AND asset_type = NEW.asset_type;
  END IF;

  RETURN NEW;
END;
$$;

-- Unique constraint needed for upsert
ALTER TABLE portfolio_holdings
  ADD CONSTRAINT portfolio_holdings_user_asset_unique
  UNIQUE (user_id, asset_name, asset_type);

-- Attach trigger
CREATE TRIGGER on_transaction_insert
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_holdings_from_transaction();
```

### Files unchanged
- `src/hooks/usePortfolio.tsx` -- already invalidates both query caches after transaction insert

