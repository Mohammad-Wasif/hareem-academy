import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Faq = typeof faqsTable.$inferSelect;
