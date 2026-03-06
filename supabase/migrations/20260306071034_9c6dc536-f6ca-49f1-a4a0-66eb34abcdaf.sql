
-- The enquiries INSERT WITH CHECK (true) is intentional for public contact forms.
-- Adding a rate-limiting note but keeping the policy as-is since website visitors need to submit enquiries without auth.
-- Fix: add a more descriptive policy name to clarify intent
DROP POLICY "Anyone can submit enquiry" ON public.enquiries;
CREATE POLICY "Public enquiry submission (anonymous allowed)" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
