import { Router, type IRouter } from "express";
import { db, enrollmentsTable } from "@workspace/db";
import { CreateEnrollmentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/enrollments", async (req, res) => {
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  try {
    const customData =
      req.body &&
      typeof req.body === "object" &&
      req.body.customData &&
      typeof req.body.customData === "object" &&
      !Array.isArray(req.body.customData)
        ? Object.fromEntries(
            Object.entries(req.body.customData as Record<string, unknown>).map(
              ([k, v]) => [k, String(v ?? "")],
            ),
          )
        : {};
    const [row] = await db
      .insert(enrollmentsTable)
      .values({
        fullName: parsed.data.fullName,
        age: parsed.data.age,
        whatsappNumber: parsed.data.whatsappNumber,
        city: parsed.data.city,
        country: parsed.data.country ?? null,
        courseSlug: parsed.data.courseSlug,
        notes: parsed.data.notes ?? null,
        customData,
      })
      .returning();
    return res.status(201).json({
      id: row!.id,
      fullName: row!.fullName,
      age: row!.age,
      whatsappNumber: row!.whatsappNumber,
      city: row!.city,
      country: row!.country ?? undefined,
      courseSlug: row!.courseSlug,
      notes: row!.notes ?? undefined,
      createdAt: row!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create enrollment");
    return res.status(500).json({ error: "Failed to create enrollment" });
  }
});

export default router;
