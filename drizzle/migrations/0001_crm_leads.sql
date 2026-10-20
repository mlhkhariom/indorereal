ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS budget text,
  ADD COLUMN IF NOT EXISTS preferred_location text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS page_url text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.is_staff(_uid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role IN ('admin','editor'))
$$;

CREATE POLICY "Agents view assigned enquiries" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'agent') AND assigned_to = auth.uid());
CREATE POLICY "Agents update assigned enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'agent') AND assigned_to = auth.uid());

CREATE TABLE public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id uuid,
  author_email text,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.lead_notes TO authenticated;
GRANT ALL ON public.lead_notes TO service_role;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage notes" ON public.lead_notes FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.enquiries e WHERE e.id = enquiry_id AND e.assigned_to = auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.enquiries e WHERE e.id = enquiry_id AND e.assigned_to = auth.uid()));

CREATE TABLE public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view activities" ON public.lead_activities FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.enquiries e WHERE e.id = enquiry_id AND e.assigned_to = auth.uid()));

CREATE OR REPLACE FUNCTION public.log_enquiry_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'created', 'Lead created from ' || coalesce(NEW.source,'website'));
  ELSE
    NEW.updated_at := now();
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'status', OLD.status || ' → ' || NEW.status);
    END IF;
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'assigned', 'Lead reassigned');
    END IF;
    IF NEW.follow_up_at IS DISTINCT FROM OLD.follow_up_at THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'follow_up', 'Follow-up set: ' || coalesce(to_char(NEW.follow_up_at,'DD Mon YYYY HH24:MI'),'cleared'));
    END IF;
    IF NEW.priority IS DISTINCT FROM OLD.priority THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'priority', OLD.priority || ' → ' || NEW.priority);
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER enquiry_activity_ins AFTER INSERT ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.log_enquiry_activity();
CREATE TRIGGER enquiry_activity_upd BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.log_enquiry_activity();

CREATE OR REPLACE FUNCTION public.list_staff() RETURNS TABLE(user_id uuid, email text, role public.app_role)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.user_id, u.email::text, r.role FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id
  WHERE public.is_staff(auth.uid()) OR public.has_role(auth.uid(),'agent')
$$;
GRANT EXECUTE ON FUNCTION public.list_staff() TO authenticated;