import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  question_ur: text("question_ur"),
  question_ar: text("question_ar"),
  answer: text("answer").notNull(),
  answer_ur: text("answer_ur"),
  answer_ar: text("answer_ar"),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Faq = typeof faqsTable.$inferSelect;
