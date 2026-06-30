-- Migration to implement Indian GST Tax Architecture details on products
-- Adds is_service, sac_code, and mutual exclusivity constraint

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sac_code VARCHAR(20) DEFAULT NULL;

-- Add check constraint ensuring an item cannot contain both an HSN and a SAC code simultaneously.
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS check_hsn_sac_mutually_exclusive;

ALTER TABLE public.products
ADD CONSTRAINT check_hsn_sac_mutually_exclusive
CHECK (NOT (hsn_code IS NOT NULL AND sac_code IS NOT NULL));

-- Ensure default rate is 18.00 if not specified
ALTER TABLE public.products
ALTER COLUMN gst_rate SET DEFAULT 18.00;
