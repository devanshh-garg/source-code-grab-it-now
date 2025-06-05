/*
  # Fix RLS Policies for Customer Loyalty Cards

  1. Changes
    - Add new RLS policy to allow business owners to create loyalty cards for their customers
    - Keep existing policies intact
    - Ensure business owners can only create loyalty cards for their own business

  2. Security
    - Business owners can only create loyalty cards for loyalty programs they own
    - Maintains existing security constraints for other operations
*/

-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Business owners can assign loyalty cards to their customers" ON customer_loyalty_cards;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Add new policy for business owners to create loyalty cards
CREATE POLICY "Business owners can assign loyalty cards to their customers"
  ON customer_loyalty_cards
  FOR INSERT
  TO public
  WITH CHECK (loyalty_card_id IN (
    SELECT lc.id
    FROM loyalty_cards lc
    JOIN businesses b ON lc.business_id = b.id
    WHERE b.user_id = auth.uid()
  ));