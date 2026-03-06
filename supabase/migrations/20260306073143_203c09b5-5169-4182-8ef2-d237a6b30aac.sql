
CREATE TABLE public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text,
  subtitle text,
  description text,
  image text,
  icon text,
  sort_order integer DEFAULT 0,
  extra_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homepage content viewable by everyone" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert homepage content" ON public.homepage_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can update homepage content" ON public.homepage_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins can delete homepage content" ON public.homepage_content FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
