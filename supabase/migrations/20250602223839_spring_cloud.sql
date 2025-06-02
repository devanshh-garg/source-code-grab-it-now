/*
  # Analytics Tables Migration

  1. New Tables
    - analytics_daily_stats
      - Stores daily aggregated metrics
    - analytics_events
      - Stores individual analytics events
    - analytics_customer_segments
      - Stores customer segmentation data

  2. Security
    - Enable RLS on all tables
    - Add policies for business owners to view their data

  3. Functions
    - Add functions for aggregating analytics data
*/

-- Create analytics_daily_stats table
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  total_visits integer DEFAULT 0,
  total_points_earned integer DEFAULT 0,
  total_points_redeemed integer DEFAULT 0,
  total_stamps_earned integer DEFAULT 0,
  total_stamps_redeemed integer DEFAULT 0,
  new_customers integer DEFAULT 0,
  active_customers integer DEFAULT 0,
  total_transactions integer DEFAULT 0,
  revenue_cents integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(business_id, date)
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  occurred_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create analytics_customer_segments table
CREATE TABLE IF NOT EXISTS analytics_customer_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  criteria jsonb NOT NULL,
  customer_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(business_id, name)
);

-- Enable RLS
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_customer_segments ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_daily_stats
CREATE POLICY "Business owners can view their analytics stats"
  ON analytics_daily_stats
  FOR SELECT
  TO public
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Create policies for analytics_events
CREATE POLICY "Business owners can view their analytics events"
  ON analytics_events
  FOR SELECT
  TO public
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

CREATE POLICY "Business owners can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO public
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Create policies for analytics_customer_segments
CREATE POLICY "Business owners can manage their customer segments"
  ON analytics_customer_segments
  FOR ALL
  TO public
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_daily_stats_business_date 
  ON analytics_daily_stats(business_id, date);

CREATE INDEX IF NOT EXISTS idx_analytics_events_business_type 
  ON analytics_events(business_id, event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at 
  ON analytics_events(occurred_at);

-- Create function to update analytics_daily_stats
CREATE OR REPLACE FUNCTION update_analytics_daily_stats()
RETURNS trigger AS $$
BEGIN
  -- Update daily stats based on event type
  INSERT INTO analytics_daily_stats (business_id, date)
  VALUES (NEW.business_id, date_trunc('day', NEW.occurred_at)::date)
  ON CONFLICT (business_id, date) DO UPDATE
  SET 
    total_transactions = analytics_daily_stats.total_transactions + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics events
CREATE TRIGGER after_analytics_event_insert
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_daily_stats();

-- Create function to update customer segments
CREATE OR REPLACE FUNCTION update_customer_segments()
RETURNS trigger AS $$
BEGIN
  -- Update segment counts
  UPDATE analytics_customer_segments
  SET 
    customer_count = (
      SELECT count(*)
      FROM customers c
      WHERE c.business_id = NEW.business_id
      -- Add your segmentation logic here
    ),
    updated_at = now()
  WHERE business_id = NEW.business_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer changes
CREATE TRIGGER after_customer_change
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_segments();