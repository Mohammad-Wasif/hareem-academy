import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  whatsappNumber: text("whatsapp_number"),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ContactMessage = typeof contactMessagesTable.$inferSelect;
