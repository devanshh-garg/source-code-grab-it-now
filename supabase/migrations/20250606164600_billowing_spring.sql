/*
  # Fix RLS Policy for Business Creation

  1. Changes
    - Add RLS policy to allow authenticated users to create their own business records
    - Ensure users can only create businesses where user_id matches their auth.uid()

  2. Security
    - Users can only insert business records for themselves
    - Maintains data isolation between different users
*/

-- Add policy for authenticated users to create their own business
CREATE POLICY "Users can create their own business"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());