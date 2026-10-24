# Page Builder + Real Estate Project Pages

## What you get
1. **Page Builder (Admin → Page Builder)** — create any new page (e.g. /p/diwali-offer, /p/nri-investment) by dragging blocks into place, with a live preview next to the editor (phone / tablet / desktop toggle).
2. **Projects (Admin → Projects)** — builder projects like "XYZ Heights" with their own page at /projects/xyz-heights, built with the same drag-drop editor plus ready-made real estate blocks. A public /projects list page with filters (area, status: Upcoming / Under Construction / Ready to Move).

## Blocks available
- General: Banner (image/video, heading, buttons), Text (rich text), Image, Photo Gallery (slider + full screen), Two-column (image + text), Stats counters, Call-to-action strip, FAQ, Testimonials, Spacer/Divider, YouTube video, Enquiry form (goes straight into CRM).
- Real estate: Project Overview (builder, RERA no., possession date, units, area range), Price List table (unit type, size, price, "Get price" button), Floor Plans (tabs per BHK, click to enlarge), Amenities grid (icons), Location & Nearby (map + schools/hospitals/malls with distance), Brochure download (asks name + phone first, saves lead), Construction progress timeline, Properties list (pick by area/type or hand-pick), EMI calculator, Builder/Developer info.

## Editor functions
- Drag to reorder, duplicate, hide/show, delete blocks; undo/redo.
- Each block has its settings panel (text, images via drag-drop upload, colours from the site theme, background light/dark/gold).
- Draft vs Published, Save draft, Preview link, Publish, Unpublish.
- Page settings: URL, SEO title/description, share image, show in menu option.
- Templates to start from: Blank, Landing Page, Project Launch, Area Guide.
- Pages list with search, status, duplicate page, last edited.
- Works on phone and desktop (on phone the preview opens as a tab).

## Leads
Enquiry and brochure forms on any built page create CRM leads tagged with the page/project name.

## Technical details
- New table `builder_pages` (slug, kind 'page'|'project', title, blocks jsonb, status draft/published, seo fields, project meta jsonb: builder, rera, possession, status, location, price_from, cover). GRANT + RLS: public read published, staff (is_staff) write.
- Block registry: one typed component per block + settings schema; renderer shared by preview and public page.
- dnd-kit (already used in CRM) for sorting; Tiptap for text; existing ImageUploader; Leaflet map reused.
- Routes: /p/:slug, /projects, /projects/:slug (lazy); admin /admin/builder, /admin/builder/:id, /admin/projects.
- Sanitize rich text with DOMPurify; JSON-LD (Residence/Product + FAQPage) on project pages; add pages to sitemap list.
- Tests for block data validation and slug rules.
