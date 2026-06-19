-- Create the singleton app_config table
CREATE TABLE public.app_config (
  id integer PRIMARY KEY CHECK (id = 1),
  
  -- Company Identity
  company_name text NOT NULL,
  registered_address text,
  gstin text,
  pan text,
  cin text,
  tan text,
  support_email text,
  support_phone text,
  
  -- Branding
  logo_url text,
  font_regular_url text,
  font_bold_url text,
  
  -- Extensible Application Settings
  settings jsonb NOT NULL DEFAULT '{
    "max_quote_items": 150,
    "max_quote_pdf_mb": 5,
    "max_concurrent_pdfs": 2,
    "site_url": "https://www.tecbunny.com",
    "review_url": "https://g.page/r/tecbunny/review"
  }'::jsonb,
  
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Seed data from legacy company-info.json
INSERT INTO public.app_config (
  id, 
  company_name, 
  registered_address, 
  pan, 
  tan, 
  cin, 
  gstin, 
  support_phone, 
  support_email, 
  logo_url
) VALUES (
  1, 
  'TECBUNNY SOLUTIONS PRIVATE LIMITED', 
  'H NO 11 NHAYGINWADA, PARSE, Parxem, Pernem, North Goa- 403512, Goa',
  'AAMCT1608G', 
  'BLRT25863F', 
  'U80200GA2025PTC017488', 
  '30AAMCT1608G1ZO',
  '+91 96041 36010', 
  'support@tecbunny.com',
  'https://fbcsagupcxheyiusjfak.supabase.co/storage/v1/object/public/TecBunny%20Solution/TECBUNNY_SOLUTIONS_PVT_LTD-removebg-preview.png'
);

-- Row Level Security
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read app config" 
ON public.app_config FOR SELECT 
USING (true);

CREATE POLICY "Admins can update app config" 
ON public.app_config FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'superadmin')
  )
);
