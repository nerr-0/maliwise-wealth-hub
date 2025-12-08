-- Add UPDATE and DELETE policies for transactions table
-- These allow users to correct errors or remove duplicate entries while maintaining owner-based access control

-- Allow users to update their own transactions
CREATE POLICY "Users can update own transactions"
ON public.transactions
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own transactions
CREATE POLICY "Users can delete own transactions"
ON public.transactions
FOR DELETE
USING (auth.uid() = user_id);