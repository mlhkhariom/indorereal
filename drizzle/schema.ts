import { pgTable, uuid, text, timestamp, jsonb, pgEnum, boolean, integer, numeric, doublePrecision, unique, pgLiteral } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const appRoleEnum = pgEnum("app_role", ["admin", "editor", "agent"]);

// Tables
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  area: integer("area").notNull(),
  area_unit: text("area_unit").notNull(),
  description: text("description"),
  amenities: text("amenities").array(),
  images: text("images").array(),
  featured: boolean("featured").default(false),
  status: text("status").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  created_by: uuid("created_by"),
  view_count: integer("view_count").default(0).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message"),
  property_id: uuid("property_id").references(() => properties.id),
  property_title: text("property_title"),
  property_type: text("property_type"),
  bhk: text("bhk"),
  purpose: text("purpose"),
  status: text("status").notNull(),
  priority: text("priority").notNull().default("medium"),
  budget: text("budget"),
  preferred_location: text("preferred_location"),
  assigned_to: uuid("assigned_to"),
  source: text("source"),
  tags: text("tags").array(),
  utm_source: text("utm_source"),
  utm_campaign: text("utm_campaign"),
  page_url: text("page_url"),
  follow_up_at: timestamp("follow_up_at", { withTimezone: true }),
  last_contacted_at: timestamp("last_contacted_at", { withTimezone: true }),
  lost_reason: text("lost_reason"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blog_posts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  cover_image: text("cover_image"),
  category: text("category"),
  tags: text("tags").array(),
  author_name: text("author_name").notNull(),
  read_time: integer("read_time"),
  published: boolean("published").default(false),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  seo_keywords: text("seo_keywords"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  created_by: uuid("created_by"),
});

export const site_pages = pgTable("site_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const site_settings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  setting_key: text("setting_key").notNull().unique(),
  setting_value: text("setting_value"),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  updated_by: uuid("updated_by"),
});

export const homepage_content = pgTable("homepage_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  section: text("section").notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  icon: text("icon"),
  image: text("image"),
  sort_order: integer("sort_order"),
  extra_data: jsonb("extra_data"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const builder_pages = pgTable(
  "builder_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull().default("page"),
    slug: text("slug").notNull(),
    title: text("title").notNull().default("Untitled"),
    blocks: jsonb("blocks").notNull().default([]),
    status: text("status").notNull().default("draft"),
    seo_title: text("seo_title"),
    seo_description: text("seo_description"),
    og_image: text("og_image"),
    meta: jsonb("meta").notNull().default({}),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    ukKindSlug: unique().on(table.kind, table.slug),
  })
);

export const menus = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  menu_key: text("menu_key").notNull().unique(),
  menu_name: text("menu_name").notNull(),
  links: jsonb("links").notNull().default([]),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lead_notes = pgTable("lead_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiry_id: uuid("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  author_id: uuid("author_id"),
  author_email: text("author_email"),
  note: text("note").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lead_activities = pgTable("lead_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiry_id: uuid("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  actor_id: uuid("actor_id"),
  action: text("action").notNull(),
  details: text("details"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const site_visits = pgTable("site_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiry_id: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "set null" }),
  property_id: uuid("property_id").references(() => properties.id, { onDelete: "set null" }),
  client_name: text("client_name").notNull(),
  client_phone: text("client_phone").notNull(),
  property_title: text("property_title"),
  visit_at: timestamp("visit_at", { withTimezone: true }).notNull(),
  agent_id: uuid("agent_id"),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const property_submissions = pgTable("property_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner_name: text("owner_name").notNull(),
  owner_phone: text("owner_phone").notNull(),
  owner_email: text("owner_email"),
  title: text("title").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("Sale"),
  location: text("location").notNull(),
  price: numeric("price"),
  area: numeric("area"),
  bedrooms: integer("bedrooms").default(0),
  description: text("description"),
  images: text("images").array().default([]),
  review_status: text("review_status").notNull().default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gallery_images = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  category: text("category"),
  image_url: text("image_url").notNull(),
  sort_order: integer("sort_order"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  created_by: uuid("created_by"),
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  image_url: text("image_url"),
  sort_order: integer("sort_order"),
  active: boolean("active").default(true),
  listing_count: integer("listing_count"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const user_roles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().unique(),
  role: appRoleEnum("role").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().unique(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  enquiries: many(enquiries),
  site_visits: many(site_visits),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
  property: one(properties, { fields: [enquiries.property_id], references: [properties.id] }),
  lead_notes: many(lead_notes),
  lead_activities: many(lead_activities),
  site_visits: many(site_visits),
}));

export const lead_notesRelations = relations(lead_notes, ({ one }) => ({
  enquiry: one(enquiries, { fields: [lead_notes.enquiry_id], references: [enquiries.id] }),
}));

export const lead_activitiesRelations = relations(lead_activities, ({ one }) => ({
  enquiry: one(enquiries, { fields: [lead_activities.enquiry_id], references: [enquiries.id] }),
}));

export const site_visitsRelations = relations(site_visits, ({ one }) => ({
  enquiry: one(enquiries, { fields: [site_visits.enquiry_id], references: [enquiries.id] }),
  property: one(properties, { fields: [site_visits.property_id], references: [properties.id] }),
}));

export const builder_pagesRelations = relations(builder_pages, ({ many }) => ({}));
