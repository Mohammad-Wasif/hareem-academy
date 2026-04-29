import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(testimonialsTable)
      .orderBy(desc(testimonialsTable.featured), desc(testimonialsTable.id));
    res.json(
      rows.map((t) => ({
        id: t.id,
        studentName: t.studentName,
        location: t.location ?? undefined,
        course: t.course ?? undefined,
        rating: t.rating,
        quote: t.quote,
        featured: t.featured,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Failed to list testimonials" });
  }
});

export default router;
