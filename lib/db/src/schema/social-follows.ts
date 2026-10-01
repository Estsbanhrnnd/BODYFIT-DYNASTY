import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const socialFollows = pgTable(
  "social_follows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    followerId: text("follower_id").notNull(),
    followingId: text("following_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("social_follows_follower_following_unique").on(table.followerId, table.followingId),
  ],
);
