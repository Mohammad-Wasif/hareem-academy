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
      rows.map((f: any) => ({
        id: f.id,
        question: f.question,
        question_ur: f.question_ur ?? undefined,
        question_ar: f.question_ar ?? undefined,
        answer: f.answer,
        answer_ur: f.answer_ur ?? undefined,
        answer_ar: f.answer_ar ?? undefined,
        category: f.category ?? undefined,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list faqs");
    res.status(500).json({ error: "Failed to list faqs" });
  }
});

export default router;
