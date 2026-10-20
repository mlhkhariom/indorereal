# Project rules
- Contact details, menus and stats come from site_settings via useContact/useMenu — never hard-code phone/email/links in components.
- Editable page bodies live in site_pages and render through CmsPage, falling back to the built-in designed page when empty.
- FAQ and job openings reuse homepage_content (sections "faq", "job") instead of new tables.
- CRM lives on the enquiries table (extra columns) with lead_notes/lead_activities; activity rows are written by a DB trigger, not the client.
- Staff checks use is_staff()/has_role() security-definer functions; roles only in user_roles; team changes go through admin-only RPCs.
- Wishlist/compare are stored on the device (localStorage) — no login for visitors.
- Admin and secondary pages are lazy-loaded routes to keep the public site fast.
- Tailwind opacity modifiers must be on the default scale (5-step); off-scale values like /92 silently do nothing.
