import { date, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type DailyProgressValues = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  steps: number;
  burned: number;
};

export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  routineName: text("routine_name").notNull(),
  location: text("location").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dailyProgress = pgTable(
  "daily_progress",
  {
    userId: text("user_id").notNull(),
    day: date("day").notNull(),
    stats: jsonb("stats").$type<DailyProgressValues>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);