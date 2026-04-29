import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select";

export const formFieldsTable = pgTable("form_fields", {
  id: serial("id").primaryKey(),
  formKey: text("form_key").notNull(),
  fieldKey: text("field_key").notNull(),
  label: text("label").notNull(),
  fieldType: text("field_type").notNull().default("text"),
  placeholder: text("placeholder"),
  helpText: text("help_text"),
  required: boolean("required").notNull().default(false),
  options: jsonb("options").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  isBuiltIn: boolean("is_built_in").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type FormField = typeof formFieldsTable.$inferSelect;
