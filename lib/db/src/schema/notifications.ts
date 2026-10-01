import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: text("recipient_id").notNull(),
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  actorUsername: text("actor_username"),
  avatarUrl: text("avatar_url"),
  type: text("type").notNull(), // 'like' | 'comment' | 'follow' | 'gift_code' | 'award'
  actionText: text("action_text").notNull(),
  detailText: text("detail_text"),
  targetId: text("target_id"),
  targetPreview: text("target_preview"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
