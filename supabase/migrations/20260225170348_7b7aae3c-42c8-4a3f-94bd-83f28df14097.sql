-- Add notes column to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS notes text;

-- Add DELETE policy for portfolio_holdings
CREATE POLICY "Users can delete own holdings"
  ON portfolio_holdings FOR DELETE
  USING (auth.uid() = user_id);

-- Unique constraint needed for upsert
ALTER TABLE portfolio_holdings
  ADD CONSTRAINT portfolio_holdings_user_asset_unique
  UNIQUE (user_id, asset_name, asset_type);

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

-- Attach trigger
CREATE TRIGGER on_transaction_insert
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_holdings_from_transaction();