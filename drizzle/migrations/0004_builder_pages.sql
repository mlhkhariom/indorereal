CREATE TABLE public.builder_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  kind text NOT NULL DEFAULT 'page',
  title text NOT NULL DEFAULT 'Untitled',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  seo_title text,
  seo_description text,
  og_image text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
GRANT SELECT ON public.builder_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builder_pages TO authenticated;
GRANT ALL ON public.builder_pages TO service_role;
ALTER TABLE public.builder_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published builder pages public" ON public.builder_pages FOR SELECT USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage builder pages" ON public.builder_pages FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER builder_pages_updated BEFORE UPDATE ON public.builder_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();