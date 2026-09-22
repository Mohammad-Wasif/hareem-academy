import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { CreateContactMessageBody } from "@workspace/api-zod";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 messages per 15 minutes per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many contact messages from this IP. Please try again after 15 minutes or message us on WhatsApp.",
  },
});

router.post("/contact", contactLimiter, async (req, res) => {
  // Honeypot bot protection
  const hp = req.body?.hp || req.body?.website || req.body?.fax;
  if (hp) {
    return res.status(200).json({
      id: 0,
      fullName: req.body?.fullName || "Guest",
      status: "received",
    });
  }

  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  try {
    const [row] = await db
      .insert(contactMessagesTable)
      .values({
        fullName: parsed.data.fullName,
        email: parsed.data.email ?? null,
        whatsappNumber: parsed.data.whatsappNumber ?? null,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
      })
      .returning();

    return res.status(201).json({
      id: row!.id,
      fullName: row!.fullName,
      email: row!.email ?? undefined,
      whatsappNumber: row!.whatsappNumber ?? undefined,
      subject: row!.subject ?? undefined,
      message: row!.message,
      createdAt: row!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create contact message");
    return res.status(500).json({ error: "Failed to create contact message" });
  }
});

export default router;
