import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const dashboardTasksTable = pgTable("dashboard_tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DashboardTask = typeof dashboardTasksTable.$inferSelect;
export type NewDashboardTask = typeof dashboardTasksTable.$inferInsert;
