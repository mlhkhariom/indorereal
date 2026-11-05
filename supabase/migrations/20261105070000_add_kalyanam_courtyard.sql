-- Migration to add Kalyanam Courtyard to builder_pages
INSERT INTO public.builder_pages (
  slug,
  kind,
  title,
  status,
  seo_title,
  seo_description,
  og_image,
  meta,
  blocks
)
VALUES (
  'kalyanam-courtyard',
  'project',
  'Kalyanam Courtyard – Rau Circle, Indore',
  'published',
  'Kalyanam Courtyard Indore | 3.5 BHK Luxury Triplex Mansions at Rau Circle',
  'Kalyanam Courtyard by Kalyanam Associate & Developers at Rau Circle, Indore. 3.5 BHK smart triplex row houses (2,229 sq.ft) with clubhouse, swimming pool & IOT automation.',
  '/projects/kalyanam-courtyard/entrance-render.jpg',
  '{
    "cover": "/projects/kalyanam-courtyard/entrance-render.jpg",
    "config": "3.5 BHK Luxury Triplex Mansions · 2,229 sq.ft",
    "status": "New Launch",
    "builder": "Kalyanam Associate & Developers Pvt. Ltd.",
    "tagline": "Elevate Life in an Elite Way. 3.5 BHK Smart Mansions with Clubhouse, Pool & 1-Acre Gated Township at Rau Circle.",
    "keywords": "Kalyanam Courtyard, Kalyanam Courtyard Indore, Kalyanam Courtyard Rau, 3.5 BHK row houses Indore, luxury villas in Rau Indore, triplex in Indore, Kalyanam Associate Developers, Priyank Gagrani, Pladeco Consultants, smart home Indore",
    "location": "Rau Circle, AB Road, Indore",
    "highlights": [
      "250 Mtr from Rau Circle",
      "3.5 BHK Triplex (2,229 Sq.Ft)",
      "Alexa IOT Smart Automation",
      "Clubhouse with Gym & Swimming Pool",
      "1,000 Sq.Ft Plot (20×50)",
      "9-Meter Wide Internal RCC Roads"
    ],
    "price_from": "Price on Request",
    "project_type": "villas"
  }'::jsonb,
  '[
    {
      "id": "kc-hero",
      "bg": "dark",
      "type": "hero",
      "hidden": false,
      "data": {
        "eyebrow": "3.5 BHK Ultra-Luxury Triplex Mansions · Rau Circle, Indore",
        "heading": "Kalyanam Courtyard",
        "subheading": "Elevate Life in an Elite Way. A boutique 1-acre gated township featuring spacious 3.5 BHK smart triplex mansions (2,229 sq.ft built-up), grand clubhouse, swimming pool & Alexa IOT automation — just 250 meters from Rau Circle.",
        "image": "/projects/kalyanam-courtyard/entrance-render.jpg",
        "btn1": "Enquire Now",
        "btn1Link": "#enquiry",
        "btn2": "Download Brochure",
        "btn2Link": "#brochure",
        "height": "tall",
        "align": "left",
        "overlay": "50"
      }
    },
    {
      "id": "kc-facts",
      "bg": "muted",
      "type": "facts",
      "hidden": false,
      "data": {
        "items": [
          {"label": "Location", "value": "Rau Circle (250m)"},
          {"label": "Configuration", "value": "3.5 BHK Triplex"},
          {"label": "Plot Size", "value": "20 x 50 (1000 sq.ft)"},
          {"label": "Built-up Area", "value": "2,229 Sq.Ft"},
          {"label": "Township Area", "value": "1 Acre Gated Campus"},
          {"label": "Internal Roads", "value": "9M Wide RCC"}
        ]
      }
    },
    {
      "id": "kc-about",
      "bg": "light",
      "type": "text",
      "hidden": false,
      "data": {
        "heading": "Elevate Life in an Elite Way — Boutique Villa Living",
        "html": "<p><strong>Kalyanam Courtyard</strong> by <strong>Kalyanam Associate & Developers Pvt. Ltd.</strong> is Indore newest independent triplex township, spread over 1 acre of prime land with an ease-of-living approach.</p><p>Developed at one of the most flourishing and superbly connected locations in Indore — <strong>just 250 meters from Rau Circle</strong> — this elite community comprises spacious 3.5 BHK premium mansions with high-end architecture designed by <strong>Pladeco Consultants</strong>.</p><p>Each home is planned with an internal courtyard and soothing water fountain, double-height ceiling cutouts, expansive private terraces, and seamless Alexa smart home automation. Experience an exclusive closely-knit villa lifestyle with resort-style clubhouse amenities under a reasonable pricing range.</p>",
        "align": "left"
      }
    },
    {
      "id": "kc-overview",
      "bg": "light",
      "type": "overview",
      "hidden": false,
      "data": {
        "heading": "Project Overview & Sanction Details",
        "builder": "Kalyanam Associate & Developers Pvt. Ltd.",
        "rera": "Applied / Registered",
        "possession": "New Launch / Booking Open",
        "units": "Approx. 21 Exclusive Mansions & Commercial Plaza",
        "land": "1 Acre Gated Community",
        "area": "2,229 sq.ft Super Built-up",
        "config": "3.5 BHK Triplex Mansions + Commercial Plaza",
        "status": "New Launch"
      }
    },
    {
      "id": "kc-highlights",
      "bg": "muted",
      "type": "highlights",
      "hidden": false,
      "data": {
        "heading": "Project Highlights & Key Features",
        "items": [
          {"value": "Prime Location — Just 250 meters from Rau Circle & 1 km from Rau Railway Station"},
          {"value": "3.5 BHK Independent Triplex Mansions with 2,229 sq.ft super built-up space"},
          {"value": "Alexa-Enabled Smart Homes with Video Door Phone & automated controls"},
          {"value": "Exclusive 2-Storey Clubhouse with Gymnasium & Swimming Pool"},
          {"value": "Grand Roman Entrance Arch Gate with Security Guard Cabin & CCTV Campus"},
          {"value": "9-Meter (approx 30 ft) Wide RCC Internal Roads & 18M main approach road"},
          {"value": "100% Concealed Underground Electrical Cabling & Designer Street Lights"},
          {"value": "Lush Landscaped Central Gardens with Gazebos, Sitting Sit-outs & Water Fountain"},
          {"value": "100% Vastu-Compliant East-Facing architectural layouts"},
          {"value": "Bank Finance Available from all leading approved financial institutions"}
        ]
      }
    },
    {
      "id": "kc-prices",
      "bg": "light",
      "type": "prices",
      "hidden": false,
      "data": {
        "heading": "Configurations & Unit Sizes",
        "note": "*Prices exclude registry, stamp duty & government taxes. Bank finance available up to 75-80% from approved banks.",
        "items": [
          {
            "type": "3.5 BHK Triplex Mansion (Plots 3-16)",
            "size": "Plot: 20 x 50 (1,000 sq.ft) | Built-up: 2,229 sq.ft",
            "price": "Price on Request"
          },
          {
            "type": "Compact Villa Format (Plots 17-21)",
            "size": "Plot: 23 x 33.8 (780 sq.ft Avg) | Triplex Format",
            "price": "Price on Request"
          },
          {
            "type": "Front Commercial Plaza (Plots 1 & 2)",
            "size": "Plot: 27 x 62.6 (1,687 sq.ft Avg) | Shops & Offices",
            "price": "Price on Request"
          }
        ]
      }
    },
    {
      "id": "kc-floorplans",
      "bg": "muted",
      "type": "floorplans",
      "hidden": false,
      "data": {
        "heading": "Architectural Layout & Floor Plans",
        "items": [
          {
            "name": "Ground Floor Plan (1,013 Sq.Ft)",
            "size": "Porch (7x14), Drawing (14x14.8), Mandir, Fountain (5.10x5), Dining, Kitchen, Store, Wash, Bedroom (12x11) & Toilets",
            "image": "/projects/kalyanam-courtyard/floorplan-1.jpg"
          },
          {
            "name": "1st Floor Plan (1,013 Sq.Ft)",
            "size": "Master Bed (19.4x11) with Balcony (16.5x3), Bed 2 (14x10) with Balcony, Double Height Cutout (10x7.2) & Toilets",
            "image": "/projects/kalyanam-courtyard/floorplan-1.jpg"
          },
          {
            "name": "2nd Floor / Terrace Plan (203 Sq.Ft)",
            "size": "Bedroom / Study (10.8x10) with Attached Toilet & Front Open Terrace (19.4x25.6) + Rear Terrace (19.4x10)",
            "image": "/projects/kalyanam-courtyard/floorplan-1.jpg"
          },
          {
            "name": "Colony Master Layout Plan",
            "size": "1-Acre Gated Campus with 9-Meter Wide Internal RCC Roads, Central Green Garden & Commercial Front Plaza",
            "image": "/projects/kalyanam-courtyard/page-10.jpg"
          }
        ]
      }
    },
    {
      "id": "kc-gallery",
      "bg": "light",
      "type": "gallery",
      "hidden": false,
      "data": {
        "heading": "Project Gallery & 3D Architectural Perspectives",
        "images": [
          "/projects/kalyanam-courtyard/entrance-render.jpg",
          "/projects/kalyanam-courtyard/bird-eye-render.jpg",
          "/projects/kalyanam-courtyard/township-render.jpg",
          "/projects/kalyanam-courtyard/page-08.jpg",
          "/projects/kalyanam-courtyard/page-09.jpg",
          "/projects/kalyanam-courtyard/page-11.jpg",
          "/projects/kalyanam-courtyard/page-12.jpg",
          "/projects/kalyanam-courtyard/page-13.jpg"
        ]
      }
    },
    {
      "id": "kc-amenities",
      "bg": "muted",
      "type": "amenities",
      "hidden": false,
      "data": {
        "heading": "World-Class Amenities & Features",
        "items": [
          {"name": "Alexa IOT Smart Automation"},
          {"name": "Video Door Phone & Security Intercom"},
          {"name": "Grand Roman Entrance Arch Gate"},
          {"name": "2-Storey Exclusive Clubhouse"},
          {"name": "Swimming Pool"},
          {"name": "State-of-the-Art Gymnasium"},
          {"name": "24x7 CCTV Surveillance Campus"},
          {"name": "9-Meter Wide Internal RCC Roads"},
          {"name": "Concealed Underground Electric Cabling"},
          {"name": "Lush Landscaped Central Gardens"},
          {"name": "Charming Sitting Gazebos & Sit-outs"},
          {"name": "Internal Fountain Courtyards"},
          {"name": "Adequate Water Supply & Drainage"},
          {"name": "Vastu-Compliant East-Facing Design"},
          {"name": "Front Commercial Shops & Offices"},
          {"name": "Up to 80% Bank Loan Support"}
        ]
      }
    },
    {
      "id": "kc-location",
      "bg": "light",
      "type": "location",
      "hidden": false,
      "data": {
        "heading": "Strategic Location & Nearby Landmarks",
        "address": "Rau Circle, AB Road / Bypass Junction, Indore",
        "lat": "22.6335",
        "lng": "75.8080",
        "items": [
          {"name": "Rau Circle", "distance": "0.25 Km (Walking Distance)"},
          {"name": "Rau Railway Station", "distance": "1.0 Km"},
          {"name": "Hotel Enrise by Sayaji", "distance": "1.8 Km"},
          {"name": "Medi-Caps University", "distance": "1.8 Km"},
          {"name": "Silicon City & Emerald Heights", "distance": "3.0 Km"},
          {"name": "Pithampur Industrial Corridor", "distance": "15 Mins Drive"},
          {"name": "Choithram Hospital & Square", "distance": "8.0 Km"}
        ]
      }
    },
    {
      "id": "kc-brochure",
      "bg": "muted",
      "type": "brochure",
      "hidden": false,
      "data": {
        "heading": "Download Official Kalyanam Courtyard Brochure",
        "text": "Get the complete 14-page brochure with layout map, 3D architectural renders, floor plans and specifications.",
        "file": "/projects/kalyanam-courtyard/kalyanam-courtyard-brochure.pdf",
        "cover": "/projects/kalyanam-courtyard/entrance-render.jpg"
      }
    },
    {
      "id": "kc-developer",
      "bg": "light",
      "type": "developer",
      "hidden": false,
      "data": {
        "name": "Kalyanam Associate & Developers Pvt. Ltd.",
        "logo": "/projects/kalyanam-courtyard/page-01.jpg",
        "about": "Kalyanam Associate & Developers Pvt. Ltd. (Director: Priyank Gagrani) is dedicated to crafting premium residential communities in Indore. Collaborating with top architectural firm Pladeco Consultants to bring refined villa and triplex townships to life.",
        "years": "10+",
        "projects": "5+"
      }
    },
    {
      "id": "kc-emi",
      "bg": "muted",
      "type": "emi",
      "hidden": false,
      "data": {
        "heading": "Calculate Your Monthly Home Loan EMI",
        "amount": 6000000
      }
    },
    {
      "id": "kc-faq",
      "bg": "light",
      "type": "faq",
      "hidden": false,
      "data": {
        "heading": "Frequently Asked Questions (FAQ)",
        "items": [
          {
            "q": "Where is Kalyanam Courtyard located?",
            "a": "Kalyanam Courtyard is located right at Rau Circle (just 250 meters from the circle) along the AB Road and Bypass corridor in Indore."
          },
          {
            "q": "What configurations and sizes are available in Kalyanam Courtyard?",
            "a": "The township features 3.5 BHK independent triplex mansions on 20 x 50 (1,000 sq.ft) plots with 2,229 sq.ft super built-up area, compact villas on 780 sq.ft plots, and front commercial plaza units."
          },
          {
            "q": "What smart home features are included?",
            "a": "Every mansion comes equipped with Alexa-enabled smart home devices, video door phone, smart lighting controls, and structured internal data cabling."
          },
          {
            "q": "What amenities are available in the township?",
            "a": "Amenities include a 2-storey Clubhouse, Swimming Pool, Gym, Lush Landscaped Gardens with Gazebos, 9-meter wide concrete internal roads, underground electrical cabling, and 24x7 security."
          },
          {
            "q": "Is bank loan finance available for Kalyanam Courtyard?",
            "a": "Yes, bank finance is available up to 75-80% from leading approved financial institutions."
          }
        ]
      }
    },
    {
      "id": "kc-enquiry",
      "bg": "dark",
      "type": "enquiry",
      "hidden": false,
      "data": {
        "heading": "Book a Site Visit at Kalyanam Courtyard",
        "text": "Connect with our property experts to view floor plans, receive the latest price sheets, and book an exclusive guided site tour.",
        "button": "Request Call Back & Site Tour"
      }
    }
  ]'::jsonb
)
ON CONFLICT (kind, slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  og_image = EXCLUDED.og_image,
  meta = EXCLUDED.meta,
  blocks = EXCLUDED.blocks,
  updated_at = now();
