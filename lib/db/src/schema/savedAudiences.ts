import { sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type AudiencePoint = {
  lat: number;
  lng: number;
  postcode?: string;
  city?: string;
};

export type GeoPlannerFilters = {
  market: "UK" | "EU" | "US";
  mode: "Brand" | "Product" | "Category";
  brand: string;
  category: string;
  intelligenceTab: "Audience" | "Commerce" | "TV" | "POI";
  intelligenceFilters: {
    category: string;
    feature: string;
    value: string;
    logic: string;
  };
  topIndexing: "10%" | "15%" | "20%";
};

export type AudienceData = {
  name: string;
  createdBy: string;
  geoType: "points" | "polygon" | "radius";
  geoDefinition: {
    points: AudiencePoint[];
    radius?: number;
    polygon?: Array<{ lat: number; lng: number }>;
    coverage?: string;
  };
  coverage: string;
  accountId: string;
  linkedBrief?: string;
  description?: string;
  plannerVersion?: "v2";
  plannerFilters?: GeoPlannerFilters;
  usageCount: number;
  isActive: boolean;
};

export const savedAudiencesTable = pgTable(
  "saved_audiences",
  {
    id: text("id").primaryKey(),
    data: jsonb("data").$type<AudienceData>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("saved_audiences_name_ci_unique").on(
      sql`lower(${table.data}->>'name')`,
    ),
  ],
);

export const insertSavedAudienceSchema = createInsertSchema(
  savedAudiencesTable,
).omit({ createdAt: true, updatedAt: true });
export type InsertSavedAudience = z.infer<typeof insertSavedAudienceSchema>;
export type SavedAudience = typeof savedAudiencesTable.$inferSelect;