import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  city: text("city").notNull(),
  country: text("country"),
  courseSlug: text("course_slug").notNull(),
  notes: text("notes"),
  customData: jsonb("custom_data")
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enrollment = typeof enrollmentsTable.$inferSelect;
