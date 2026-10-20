-- Editable pages
CREATE TABLE public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  seo_title text,
  seo_description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pages public read" ON public.site_pages FOR SELECT USING (true);
CREATE POLICY "Staff write pages" ON public.site_pages FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Property extras
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

CREATE OR REPLACE FUNCTION public.track_property_view(_property_id uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.properties SET view_count = view_count + 1 WHERE id = _property_id
$$;
GRANT EXECUTE ON FUNCTION public.track_property_view(uuid) TO anon, authenticated;

-- Site visits
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE SET NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  property_title text,
  visit_at timestamptz NOT NULL,
  agent_id uuid,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_visits TO authenticated;
GRANT INSERT ON public.site_visits TO anon;
GRANT ALL ON public.site_visits TO service_role;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can request visit" ON public.site_visits FOR INSERT TO anon, authenticated WITH CHECK (status = 'scheduled');
CREATE POLICY "Staff manage visits" ON public.site_visits FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Agents see own visits" ON public.site_visits FOR SELECT TO authenticated USING (agent_id = auth.uid());
CREATE POLICY "Agents update own visits" ON public.site_visits FOR UPDATE TO authenticated USING (agent_id = auth.uid());

-- Owner submissions
CREATE TABLE public.property_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  owner_phone text NOT NULL,
  owner_email text,
  title text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'Sale',
  location text NOT NULL,
  price numeric,
  area numeric,
  bedrooms integer DEFAULT 0,
  description text,
  images text[] DEFAULT '{}',
  review_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.property_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.property_submissions TO authenticated;
GRANT ALL ON public.property_submissions TO service_role;
ALTER TABLE public.property_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit property" ON public.property_submissions FOR INSERT TO anon, authenticated WITH CHECK (review_status = 'pending');
CREATE POLICY "Staff review submissions" ON public.property_submissions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Team management (admin only)
CREATE OR REPLACE FUNCTION public.assign_role_by_email(_email text, _role public.app_role) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can manage the team'; END IF;
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(trim(_email));
  IF _uid IS NULL THEN RAISE EXCEPTION 'No account found for %. Ask them to sign up at /admin/login first.', _email; END IF;
  DELETE FROM public.user_roles WHERE user_id = _uid;
  INSERT INTO public.user_roles(user_id, role) VALUES (_uid, _role);
  RETURN 'ok';
END $$;
GRANT EXECUTE ON FUNCTION public.assign_role_by_email(text, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_team_member(_user_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can manage the team'; END IF;
  IF _user_id = auth.uid() THEN RAISE EXCEPTION 'You cannot remove yourself'; END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id;
END $$;
GRANT EXECUTE ON FUNCTION public.remove_team_member(uuid) TO authenticated;