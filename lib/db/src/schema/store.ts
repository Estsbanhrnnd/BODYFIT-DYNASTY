import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const storeProducts = pgTable("store_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  priceCents: integer("price_cents"),
  promoText: text("promo_text"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});