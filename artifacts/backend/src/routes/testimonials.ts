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
        bottomText: t.bottomText ?? undefined,
        featured: t.featured,
        quote_ur: t.quote_ur ?? undefined,
        quote_ar: t.quote_ar ?? undefined,
        bottomText_ur: t.bottomText_ur ?? undefined,
        bottomText_ar: t.bottomText_ar ?? undefined,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Failed to list testimonials" });
  }
});

export default router;
