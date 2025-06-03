/*
  # Business Settings Update

  1. New Fields
    - Add theme_settings to businesses table
    - Add social_links to businesses table
    - Add business_type to businesses table
    - Add description to businesses table
    - Add website to businesses table
    - Add business_hours to businesses table

  2. Changes
    - Set default values for new JSON fields
    - Add verification fields for business status
*/

-- Add new columns to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS theme_settings jsonb DEFAULT '{"font_family": "Inter", "logo_position": "left", "primary_color": "#3B82F6", "secondary_color": "#1D4ED8"}'::jsonb,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS business_type text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS business_hours jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS verification_approved_at timestamptz;