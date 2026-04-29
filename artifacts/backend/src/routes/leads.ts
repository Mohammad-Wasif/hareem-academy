import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads", async (req, res) => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  try {
    const [row] = await db
      .insert(leadsTable)
      .values({
        fullName: parsed.data.fullName ?? null,
        whatsappNumber: parsed.data.whatsappNumber,
        email: parsed.data.email ?? null,
        source: parsed.data.source,
      })
      .returning();
    res.status(201).json({
      id: row!.id,
      fullName: row!.fullName ?? undefined,
      whatsappNumber: row!.whatsappNumber,
      email: row!.email ?? undefined,
      source: row!.source,
      createdAt: row!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create lead");
    res.status(500).json({ error: "Failed to create lead" });
  }
});

export default router;
