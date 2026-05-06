import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  location: text("location"),
  course: text("course"),
  rating: integer("rating").notNull(),
  quote: text("quote").notNull(),
  featured: boolean("featured").notNull().default(false),
  quote_ur: text("quote_ur"),
  quote_ar: text("quote_ar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Testimonial = typeof testimonialsTable.$inferSelect;
