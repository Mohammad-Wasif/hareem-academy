import { Router, type IRouter } from "express";
import {
  db,
  enrollmentsTable,
  testimonialsTable,
  coursesTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  try {
    const [enrollmentCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(enrollmentsTable);
    const [courseCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(coursesTable);
    const [ratingRow] = await db
      .select({
        avg: sql<number>`coalesce(avg(${testimonialsTable.rating})::float, 0)`,
        countries: sql<number>`count(distinct ${testimonialsTable.location})::int`,
      })
      .from(testimonialsTable);

    const baseStudents = 50;
    const baseBatches = 6;
    const baseCountries = 2;

    res.json({
      totalStudents: baseStudents + (enrollmentCount?.count ?? 0),
      activeBatches: Math.max(baseBatches, courseCount?.count ?? 0),
      countriesReached: Math.max(baseCountries, ratingRow?.countries ?? 0),
      averageRating: Number(((ratingRow?.avg ?? 0) || 4.9).toFixed(2)),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
