/*
  # Add business settings and customization options

  1. Changes
    - Add new columns to businesses table for customization
    - Add business hours and locations support
    - Add business verification status

  2. Security
    - Add policies for managing business settings
*/

-- Add new columns to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS business_type text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS business_hours jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS theme_settings jsonb DEFAULT '{
  "primary_color": "#3B82F6",
  "secondary_color": "#1D4ED8",
  "font_family": "Inter",
  "logo_position": "left"
}'::jsonb,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS verification_approved_at timestamptz;

-- Create business_locations table
CREATE TABLE IF NOT EXISTS business_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text,
  country text NOT NULL,
  postal_code text,
  phone text,
  is_primary boolean DEFAULT false,
  coordinates point,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE business_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for business_locations
CREATE POLICY "Users can manage their business locations"
  ON business_locations
  FOR ALL
  TO public
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for business_locations
CREATE TRIGGER update_business_locations_updated_at
  BEFORE UPDATE ON business_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_business_locations_business_id ON business_locations(business_id);
CREATE INDEX IF NOT EXISTS idx_business_locations_coordinates ON business_locations USING gist(coordinates);