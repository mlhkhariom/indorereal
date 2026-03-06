
-- Gallery images table
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  category text NOT NULL DEFAULT 'General',
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery images viewable by everyone" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery images" ON public.gallery_images FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can update gallery images" ON public.gallery_images FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can delete gallery images" ON public.gallery_images FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Locations table
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  image_url text,
  listing_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations viewable by everyone" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Admins can insert locations" ON public.locations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can update locations" ON public.locations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can delete locations" ON public.locations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed locations from existing data
INSERT INTO public.locations (name, description, image_url, listing_count, sort_order) VALUES
  ('Vijay Nagar', 'Premium flats & commercial spaces', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', 25, 1),
  ('Super Corridor', 'Plots & new developments', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', 18, 2),
  ('Rau', 'Villas & independent houses', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600', 12, 3),
  ('Bypass Road', 'Affordable housing options', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', 15, 4),
  ('AB Road', 'Commercial & luxury properties', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', 20, 5),
  ('MR-10', 'Growing residential area', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600', 10, 6);

-- Storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage RLS policies
CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));
CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

-- Seed gallery images
INSERT INTO public.gallery_images (title, category, image_url, sort_order) VALUES
  ('Luxury Apartment — Vijay Nagar', 'Apartments', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 1),
  ('Premium Villa — Rau', 'Villas', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 2),
  ('Modern Home — Super Corridor', 'Homes', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 3),
  ('Commercial Tower — AB Road', 'Commercial', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 4),
  ('Independent Villa — Rau', 'Villas', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 5),
  ('Residential Society — Bypass Road', 'Apartments', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 6),
  ('Interior — Modern 3BHK', 'Interiors', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 7),
  ('Luxury Living Room', 'Interiors', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 8),
  ('Independent House — MR-10', 'Homes', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 9),
  ('Office Space — Vijay Nagar', 'Commercial', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 10),
  ('Furnished Flat — Rent', 'Apartments', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 11),
  ('Premium Plot — Super Corridor', 'Plots', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 12);
