/*
  # Customer Registration Schema

  1. New Tables
    - customer_profiles
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - email (text)
      - phone (text, optional)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - customer_loyalty_cards
      - id (uuid, primary key)
      - customer_profile_id (uuid, references customer_profiles)
      - loyalty_card_id (uuid, references loyalty_cards)
      - points (integer)
      - stamps (integer)
      - tier (text)
      - joined_at (timestamptz)
      - last_activity (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for customer profile management
    - Add policies for loyalty card management
*/

-- Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT customer_profiles_user_id_key UNIQUE (user_id)
);

-- Create customer_loyalty_cards table
CREATE TABLE IF NOT EXISTS customer_loyalty_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_profile_id uuid REFERENCES customer_profiles ON DELETE CASCADE NOT NULL,
  loyalty_card_id uuid REFERENCES loyalty_cards ON DELETE CASCADE NOT NULL,
  points integer DEFAULT 0 NOT NULL,
  stamps integer DEFAULT 0 NOT NULL,
  tier text DEFAULT 'bronze',
  joined_at timestamptz DEFAULT now() NOT NULL,
  last_activity timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT customer_loyalty_cards_customer_profile_id_loyalty_card_id_key UNIQUE (customer_profile_id, loyalty_card_id)
);

-- Enable RLS
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create own customer profile" ON customer_profiles;
  DROP POLICY IF EXISTS "Users can update own customer profile" ON customer_profiles;
  DROP POLICY IF EXISTS "Users can view own customer profile" ON customer_profiles;
  DROP POLICY IF EXISTS "Customers can join loyalty programs" ON customer_loyalty_cards;
  DROP POLICY IF EXISTS "Customers can view own loyalty cards" ON customer_loyalty_cards;
  DROP POLICY IF EXISTS "Business owners can view their customers' cards" ON customer_loyalty_cards;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Policies for customer_profiles
CREATE POLICY "Users can create own customer profile"
  ON customer_profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customer profile"
  ON customer_profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own customer profile"
  ON customer_profiles
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Policies for customer_loyalty_cards
CREATE POLICY "Customers can join loyalty programs"
  ON customer_loyalty_cards
  FOR INSERT
  TO public
  WITH CHECK (customer_profile_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Customers can view own loyalty cards"
  ON customer_loyalty_cards
  FOR SELECT
  TO public
  USING (customer_profile_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Business owners can view their customers' cards"
  ON customer_loyalty_cards
  FOR SELECT
  TO public
  USING (loyalty_card_id IN (
    SELECT lc.id
    FROM loyalty_cards lc
    JOIN businesses b ON lc.business_id = b.id
    WHERE b.user_id = auth.uid()
  ));