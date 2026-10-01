import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const giftCodes = pgTable("gift_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  tier: text("tier").notNull().default("pro"), // 'pro' | 'platinum'
  durationDays: integer("duration_days").notNull().default(30), // 15, 30, 90, or 9999 for permanent
  durationLabel: text("duration_label").notNull().default("1 mes (30 días)"),
  createdBy: text("created_by").notNull(),
  redeemedBy: text("redeemed_by"),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
