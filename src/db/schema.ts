import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  texture: varchar("texture", { length: 40 }).notNull(), // straight | curly | wavy
  description: text("description").notNull().default(""),
  details: text("details").notNull().default(""),
  careNotes: text("care_notes").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  basePriceCents: integer("base_price_cents").notNull().default(0),
  published: boolean("published").notNull().default(false),
  isPlaceholder: boolean("is_placeholder").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  length: varchar("length", { length: 20 }).notNull(), // e.g. "18\""
  sku: varchar("sku", { length: 80 }),
  priceCents: integer("price_cents").notNull(),
  inventory: integer("inventory").notNull().default(0),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  source: varchar("source", { length: 60 }).default("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  subject: varchar("subject", { length: 160 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 40 }).notNull(), // stripe
  providerSessionId: varchar("provider_session_id", { length: 200 }),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  email: varchar("email", { length: 254 }),
  items: jsonb("items")
    .$type<
      {
        variantId: number;
        productName: string;
        texture: string;
        length: string;
        quantity: number;
        priceCents: number;
      }[]
    >()
    .notNull()
    .default([]),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
