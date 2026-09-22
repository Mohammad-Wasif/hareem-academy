import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody } from "@workspace/api-zod";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const leadsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 lead submissions per 15 minutes per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again after 15 minutes.",
  },
});

router.post("/leads", leadsLimiter, async (req, res) => {
  // Honeypot bot protection
  const hp = req.body?.hp || req.body?.website || req.body?.fax;
  if (hp) {
    return res.status(200).json({
      id: 0,
      fullName: req.body?.fullName || "Guest",
      status: "received",
    });
  }

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

    return res.status(201).json({
      id: row!.id,
      fullName: row!.fullName ?? undefined,
      whatsappNumber: row!.whatsappNumber,
      email: row!.email ?? undefined,
      source: row!.source,
      createdAt: row!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create lead");
    return res.status(500).json({ error: "Failed to create lead" });
  }
});

export default router;
