import { Router, type IRouter } from "express";
import { db, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function serialize(c: typeof coursesTable.$inferSelect) {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    language: c.language,
    level: c.level,
    durationMonths: c.durationMonths,
    timings: c.timings,
    platform: c.platform,
    feeMonthly: c.feeMonthly,
    currency: c.currency,
    startDate: c.startDate ?? undefined,
    summary: c.summary,
    highlights: c.highlights ?? [],
    curriculum: c.curriculum ?? [],
    forWhom: c.forWhom ?? undefined,
    seatsRemaining: c.seatsRemaining ?? undefined,
    featured: c.featured,
    sortOrder: c.sortOrder,
    title_ur: c.title_ur ?? undefined,
    summary_ur: c.summary_ur ?? undefined,
    timings_ur: c.timings_ur ?? undefined,
    title_ar: c.title_ar ?? undefined,
    summary_ar: c.summary_ar ?? undefined,
    timings_ar: c.timings_ar ?? undefined,
  };
}

router.get("/courses", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(coursesTable)
      .orderBy(coursesTable.sortOrder);
    return res.json(rows.map(serialize));
  } catch (err) {
    req.log.error({ err }, "Failed to list courses");
    return res.status(500).json({ error: "Failed to list courses" });
  }
});

router.get("/courses/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const rows = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.slug, slug))
      .limit(1);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json(serialize(rows[0]!));
  } catch (err) {
    req.log.error({ err }, "Failed to get course");
    return res.status(500).json({ error: "Failed to get course" });
  }
});

export default router;
