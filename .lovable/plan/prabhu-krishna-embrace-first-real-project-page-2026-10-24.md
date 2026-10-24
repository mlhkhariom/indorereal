# Prabhu Krishna Embrace — first real project page

## What I understood
- Apartment project: G+6 floors, 8 flats per floor, 48 flats total.
- 2 BHK: 1360 sq.ft. 3 BHK: 1813 / 1896 / 1899 / 1918 sq.ft.
- 13 amenities: Gym, Terrace Garden, 2 Servant Quarters, CCTV, Power Backup (common areas + lifts), 24x7 Security, EPBX Intercom, Narmada water line, Fire safety on every floor, Allotted parking per flat, Avantika gas line, Solar panels (common areas), AC piping in hall and rooms.
- Photos: a rooftop clubhouse plan (pool, gym, club lounge, changing rooms, 61.8 m²) and a 3D view of it.

## Things to check (they don't match the project)
- The PDF is a plan for a 20x50 independent house (3 floors, 2229 sq.ft, client "Mr. Rahul Nairji"), not an apartment flat plan. I will not use it on this page unless you confirm.
- The rooftop plan shows a swimming pool, but the pool is not in your amenity list. I'll show it as "Rooftop Clubhouse" and only mention the pool if you confirm.
- I can't watch the video myself. I'll take still frames from it to check what's in it, and add the video to the page as a player.

## Step 1 — clean up
- Delete all demo projects so the Projects page shows only real ones. Demo properties and blogs stay unless you say so.

## Step 2 — the project page (/projects/prabhu-krishna-embrace)
Built with the Page Builder, so you can edit it later. Sections in order:
1. **Banner** — project name, "2 & 3 BHK Apartments, Indore", key facts (48 flats, G+6, 1360–1918 sq.ft), buttons "Get Price List" and "Book Site Visit".
2. **Quick facts strip** — icons: Floors G+6, Flats 48, 8 per floor, Configurations, Sizes.
3. **About the project** — short write-up based only on the facts above.
4. **Video tour** — your video.
5. **Flat types** — 2 BHK card and 3 BHK cards with sizes; "Get price" opens the enquiry form (no prices shown until you give them).
6. **Amenities** — all 13 with matching icons in a gold-and-navy grid.
7. **Rooftop Clubhouse** — your 3D view and plan, click to enlarge, with gym / lounge / changing room areas.
8. **Gallery** — your photos plus video frames.
9. **Brochure download** — asks name + phone (lead goes to CRM). Waits for your brochure file.
10. **Location** — map + nearby places once you give the address.
11. **FAQ** — e.g. how many flats, sizes, parking, water supply, gas line.
12. **Enquiry form** — goes to CRM tagged "Prabhu Krishna Embrace".

## Design
- Richer project-page look: large banner image, gold icon badges, alternating light/navy sections, sticky "Enquire / Call / WhatsApp" bar on phone.
- New block types added to the builder: Quick Facts strip, Video (uploaded file, not just YouTube), Flat Types cards.
- Fast loading: compressed photos, video loads only when played.

## Needed from you later (placeholders until then)
Location/address, builder name, RERA number, possession date, prices, real flat floor plans, brochure PDF, building exterior photos.

## Technical details
- Delete demo rows from `builder_pages` where kind = 'project' (data change, no schema change).
- Upload photos/video via lovable-assets; extract video frames with ffmpeg for review and gallery.
- Add `facts`, `video`, `units` block types to `src/lib/builder.ts` + `BlockRenderer`, with tests for defaults.
- Insert one published `builder_pages` row with blocks and meta (status, config "2 & 3 BHK", location).
- Verify at 375px and 1280px with Playwright.
