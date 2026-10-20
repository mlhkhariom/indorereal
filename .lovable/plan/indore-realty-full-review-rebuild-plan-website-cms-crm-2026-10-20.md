# Indore Realty — Full Review + Rebuild Plan (Website + CMS + CRM)

## Review: what exists today
- Public pages: Home, Properties, Property Detail, About, Services, Contact, Blog, Blog Detail, FAQ, Gallery, Careers, EMI Calculator, Privacy, Terms, 404.
- Admin: Dashboard, Properties, Locations, Gallery, Blog, Enquiries, Homepage, SEO.
- Database: properties, locations, blog_posts, gallery_images, homepage_content, enquiries, site_settings, profiles, user_roles.

## Problems found
- Phone number, WhatsApp, address, email are hard-coded in 16 files (header, footer, bottom bar, forms, contact, SEO) — not editable from admin.
- About, Services, FAQ, Careers, Privacy, Terms content is fixed text — not editable.
- Header menu and footer links are fixed — not editable.
- Enquiries is only a simple list (status new/contacted/closed) — no CRM: no assignment, follow-ups, notes, history, pipeline.
- Admin panel looks basic: no charts, no search/filter/pagination tables, no rich text editor, no image upload in all forms.
- Mobile layout overflows in places; desktop spacing inconsistent; admin tables break on mobile.
- Favicon/app icons incomplete (no apple-touch icon / manifest).
- Property detail lacks map, image gallery slider, similar properties, share, brochure.

## Phase 1 — Everything dynamic (CMS)
- Site Settings page in admin: phone, WhatsApp, email, address, map link, social links, logo, favicon, business hours, stats numbers. Used everywhere via one shared settings hook.
- Menu Manager: header + footer menus editable (add/reorder/hide).
- Pages Manager: About, Services, FAQ, Careers (job openings), Privacy, Terms, Testimonials, Team — all edited from admin with a rich text editor.
- Per-page SEO (title, description, image) from admin for every page.

## Phase 2 — CRM Portal
- Leads: every form (contact, property, callback, careers) becomes a lead with source, property, budget, location.
- Pipeline (Kanban drag-drop): New → Contacted → Site Visit → Negotiation → Won / Lost.
- Lead detail: notes timeline, activity history (who changed what, when), follow-up date + reminders list ("Today's follow-ups"), assigned agent, call/WhatsApp buttons.
- Site visit scheduling with calendar view.
- Filters, search, CSV export, tags.
- Tracking: lead source (page, UTM, property), property view counts.
- Roles: Admin (everything, user management), Editor (content), Agent (only own assigned leads). User management screen to invite/assign roles.

## Phase 3 — Admin UI redesign
- New dashboard: KPI cards, leads-over-time chart, pipeline funnel, top properties, recent activity.
- Proper data tables everywhere: search, sort, filter, pagination, bulk actions, responsive card view on mobile.
- Collapsible sidebar grouped: CRM / Listings / Content / Settings. Dark/light mode.
- Image uploader with drag-drop, multiple images, reorder.

## Phase 4 — Public website features + UI polish
- Property detail: image slider + lightbox, Google map, amenities, similar properties, share, schedule-visit form, brochure download, EMI widget.
- Properties: grid/list toggle, sort, saved filters in URL, compare up to 3 properties, wishlist (saved on device).
- New pages: Compare, Wishlist, Post Your Property (owner submission → goes to admin for approval), Location detail pages (properties per area).
- Full mobile + desktop pass on every page: no sideways scroll, consistent spacing, better bottom bar.
- Favicon set: favicon, apple-touch icon, web manifest generated from the logo.

## Technical details
- Libraries (all free/open): shadcn/ui + Radix (UI framework, already in use), TanStack Table (data tables), dnd-kit (Kanban/reorder), Tiptap (rich text CMS editor), Recharts (charts), react-hook-form + zod (forms), yet-another-react-lightbox, embla (sliders), Leaflet/OpenStreetMap (maps, no key needed).
- New tables: site_pages, menus, testimonials, team_members, job_openings, leads (extend enquiries via new columns, no breaking changes), lead_notes, lead_activities, site_visits, property_views, property_submissions. All with GRANTs + RLS using has_role; add `agent` role to app_role enum.
- Public form inserts stay open (insert-only); reads restricted to staff.
- Contact info centralized in a settings provider; remove all hard-coded numbers.
- Tests for role rules (agent sees only own leads) and pipeline status values.

## Delivery order
Phase 1 → 2 → 3 → 4, each verified on mobile and desktop before moving on. This is large; it will be built across several messages.
