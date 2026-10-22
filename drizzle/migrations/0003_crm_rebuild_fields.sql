ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS property_type text,
  ADD COLUMN IF NOT EXISTS bhk text,
  ADD COLUMN IF NOT EXISTS purpose text,
  ADD COLUMN IF NOT EXISTS lost_reason text,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;

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
    IF NEW.lost_reason IS DISTINCT FROM OLD.lost_reason AND NEW.lost_reason IS NOT NULL THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'lost', 'Lost reason: ' || NEW.lost_reason);
    END IF;
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'assigned', 'Lead reassigned');
    END IF;
    IF NEW.follow_up_at IS DISTINCT FROM OLD.follow_up_at THEN
      IF NEW.follow_up_at IS NULL AND OLD.follow_up_at IS NOT NULL THEN
        INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'follow_up_done', 'Follow-up completed');
      ELSE
        INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'follow_up', 'Follow-up set: ' || to_char(NEW.follow_up_at,'DD Mon YYYY HH24:MI'));
      END IF;
    END IF;
    IF NEW.last_contacted_at IS DISTINCT FROM OLD.last_contacted_at AND NEW.last_contacted_at IS NOT NULL THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'contacted', 'Client contacted');
    END IF;
    IF NEW.priority IS DISTINCT FROM OLD.priority THEN
      INSERT INTO lead_activities(enquiry_id, actor_id, action, details) VALUES (NEW.id, auth.uid(), 'priority', OLD.priority || ' → ' || NEW.priority);
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.link_visit_to_lead() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.enquiry_id IS NULL THEN
    SELECT id INTO NEW.enquiry_id FROM enquiries
      WHERE right(regexp_replace(phone,'\D','','g'),10) = right(regexp_replace(NEW.client_phone,'\D','','g'),10)
      ORDER BY created_at DESC LIMIT 1;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS site_visit_link_lead ON public.site_visits;
CREATE TRIGGER site_visit_link_lead BEFORE INSERT ON public.site_visits FOR EACH ROW EXECUTE FUNCTION public.link_visit_to_lead();