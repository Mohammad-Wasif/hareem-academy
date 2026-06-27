import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email"),
  source: text("source").notNull(),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
