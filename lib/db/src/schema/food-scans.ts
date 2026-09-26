import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type FoodScanItem = {
  nombre: string;
  gramos_estimados: number;
  calorias: number;
  proteina: number;
  carbohidratos: number;
  grasas: number;
  fibra: number;
  nivel_de_confianza: number;
};

export const foodScans = pgTable("food_scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  imageSha256: text("image_sha256").notNull(),
  imageMimeType: text("image_mime_type").notNull(),
  model: text("model").notNull(),
  foods: jsonb("foods").$type<FoodScanItem[]>().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const foodScanCorrections = pgTable("food_scan_corrections", {
  id: uuid("id").defaultRandom().primaryKey(),
  scanId: uuid("scan_id")
    .notNull()
    .references(() => foodScans.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  foodIndex: integer("food_index").notNull(),
  beforeFood: jsonb("before_food").$type<FoodScanItem>().notNull(),
  afterFood: jsonb("after_food").$type<FoodScanItem>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});