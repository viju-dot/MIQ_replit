import { jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type PrototypeVersionData = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  rendererKey: "v3" | "v4" | "v5" | "dashboard" | "dooh";
  status: "active" | "archived";
  metadata?: { createdFrom?: string };
  snapshot?: {
    description: string;
    status: "Live" | "Draft" | "Archived";
    notes?: string;
  };
};

export const prototypeVersionsTable = pgTable(
  "prototype_versions",
  {
    prototypeId: text("prototype_id").notNull(),
    id: text("id").notNull(),
    data: jsonb("data").$type<PrototypeVersionData>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.prototypeId, table.id] })],
);

export const insertPrototypeVersionSchema = createInsertSchema(
  prototypeVersionsTable,
).omit({ createdAt: true, updatedAt: true });
export type InsertPrototypeVersion = z.infer<typeof insertPrototypeVersionSchema>;
export type PrototypeVersionRecord = typeof prototypeVersionsTable.$inferSelect;
