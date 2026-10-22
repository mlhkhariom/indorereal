# CRM Rebuild — Real-estate focused, mobile + desktop

Goal: rebuild every CRM screen (Leads pipeline, Lead detail, Follow-ups, Site Visits, Dashboard tie-ins) so it feels like a professional real-estate sales tool on both phone and desktop.

## Current problems found
- Pipeline board: fixed 288px columns, side-scroll only — hard to use on phones.
- Lead cards show little real-estate info (no budget, area, property type, last contact).
- Lead detail sheet: one long scroll, buttons misaligned (WhatsApp button uses `w-full` inside a flex row), no tabs, no quick status actions.
- Follow-ups tab only shows overdue/today; no "upcoming", no one-tap "Done / Snooze".
- List view is a plain table that overflows on mobile; no sorting or bulk actions.
- No "Add lead manually" (walk-in / phone call leads).
- Site visits are separate from the lead they belong to.

## What will be built

### 1. CRM header and KPIs
- Sticky top bar: search, stage filter, priority filter, assigned-to filter ("My leads" for agents), source filter, "Add Lead" button, Export.
- KPI strip (scrollable chips on phone): Total, New today, Follow-ups due, Site visits this week, Won this month, Conversion %.

### 2. Pipeline (Kanban)
- Desktop: columns with stage colour accent, count and total budget value per column.
- Phone: stage tabs (swipeable chips) showing one stage at a time as a card list; "Move to" menu on each card instead of dragging.
- Richer lead card: name, phone, interested property, budget, preferred area, priority dot, source badge, assigned agent avatar initials, follow-up chip (red overdue / amber today), "x days since created".
- Quick actions on card: Call, WhatsApp.

### 3. List view
- Desktop: sortable table (name, stage, priority, budget, area, assigned, follow-up, created), row checkboxes for bulk assign / bulk stage change / bulk delete (admin).
- Phone: compact stacked cards instead of a table.

### 4. Follow-ups (today's work)
- Grouped sections: Overdue, Today, Next 7 days.
- One-tap actions: Call, WhatsApp, Mark done (clears follow-up and logs activity), Snooze (+1 day / +3 days / next week).

### 5. Lead detail (full rebuild)
- Desktop: wide side panel; Phone: full-screen sheet with sticky action bar at bottom (Call / WhatsApp / Email / Book visit).
- Header: name, stage stepper (New → Contacted → Site Visit → Negotiation → Won/Lost) clickable, priority, source.
- Tabs: Overview (contact, requirement: budget, area, property type, BHK, purpose buy/rent, interested property link) · Notes · Activity timeline (icons per action) · Site visits (list + "Schedule visit" for this lead).
- Quick note templates ("Called, no answer", "Interested, send options", "Visit done").
- "Lost reason" picker when moved to Lost.

### 6. Add / edit lead manually
- Dialog form (react-hook-form + zod): name, phone (Indian 10-digit validation), email, source (walk-in, phone, referral, 99acres, MagicBricks, Facebook, website), requirement fields, assign, follow-up.

### 7. Site visits link
- Visits booked from a property page are linked to the matching lead (by phone) and appear in that lead's Visits tab; visit calendar gets a mobile agenda view.

## Data changes (small)
- Add to enquiries: `property_type`, `bhk`, `purpose` (buy/rent/sell), `lost_reason`, `last_contacted_at`.
- Add `enquiry_id` (optional) to site_visits.
- Trigger already writing activities extended to log follow-up done / lost reason.

## Technical details
- Split `AdminCRM.tsx` into `crm/CrmToolbar`, `crm/KpiStrip`, `crm/PipelineBoard` (desktop dnd-kit) + `crm/PipelineMobile`, `crm/LeadList`, `crm/FollowUps`, `crm/LeadCard`, `crm/LeadForm`, and `LeadDetailSheet` with tabs.
- Use `useIsMobile` to switch layouts; data via React Query with optimistic updates.
- Stage colours as semantic tokens in index.css (no hard-coded colours).
- Extend `src/lib/crm.ts` (snooze dates, conversion %, follow-up "upcoming" bucket, phone validation) with tests in `src/test/crm.test.ts`.
- Verify with Playwright at 375px and 1280px, signed in as staff.
