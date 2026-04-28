import { Router, type IRouter } from "express";
import { db, faqsTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/faqs", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(faqsTable)
      .orderBy(asc(faqsTable.sortOrder), asc(faqsTable.id));
    res.json(
      rows.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category ?? undefined,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list faqs");
    res.status(500).json({ error: "Failed to list faqs" });
  }
});

export default router;
