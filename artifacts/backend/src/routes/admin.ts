import { Router, type IRouter } from "express";
import {
  db,
  coursesTable,
  testimonialsTable,
  faqsTable,
  enrollmentsTable,
  contactMessagesTable,
  leadsTable,
  formFieldsTable,
} from "@workspace/db";
import { desc, asc, eq, and } from "drizzle-orm";
import { requireAdmin } from "../lib/adminAuth";
import {
  ensureBuiltInEnrollmentFields,
  ALWAYS_REQUIRED_BUILTINS,
} from "../lib/formFieldsSeed";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body ?? {};
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) {
    return res.status(500).json({ error: "Admin password not configured" });
  }
  if (username !== "admin" || password !== expected) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  req.session.isAdmin = true;
  req.session.save((err) => {
    if (err) {
      req.log.error({ err }, "Session save failed");
      return res.status(500).json({ error: "Login failed" });
    }
    res.json({ ok: true });
  });
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("hareem.sid");
    res.json({ ok: true });
  });
});

router.get("/admin/me", (req, res) => {
  res.json({ isAdmin: !!req.session?.isAdmin });
});

router.get("/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const [c, e, m, l, t, f] = await Promise.all([
      db.select().from(coursesTable),
      db.select().from(enrollmentsTable),
      db.select().from(contactMessagesTable),
      db.select().from(leadsTable),
      db.select().from(testimonialsTable),
      db.select().from(faqsTable),
    ]);
    res.json({
      counts: {
        courses: c.length,
        enrollments: e.length,
        contacts: m.length,
        leads: l.length,
        testimonials: t.length,
        faqs: f.length,
      },
      recentEnrollments: e
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map((r) => ({
          id: r.id,
          fullName: r.fullName,
          courseSlug: r.courseSlug,
          city: r.city,
          createdAt: r.createdAt.toISOString(),
        })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load dashboard");
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

router.get("/admin/enrollments", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(enrollmentsTable)
      .orderBy(desc(enrollmentsTable.createdAt));
    res.json(
      rows.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        age: r.age,
        whatsappNumber: r.whatsappNumber,
        city: r.city,
        country: r.country ?? null,
        courseSlug: r.courseSlug,
        notes: r.notes ?? null,
        customData: r.customData ?? {},
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list enrollments");
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/admin/enrollments/:id", requireAdmin, async (req, res) => {
  try {
    await db
      .delete(enrollmentsTable)
      .where(eq(enrollmentsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete enrollment");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/admin/contacts", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));
    res.json(
      rows.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email ?? null,
        whatsappNumber: r.whatsappNumber ?? null,
        subject: r.subject ?? null,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list contacts");
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  try {
    await db
      .delete(contactMessagesTable)
      .where(eq(contactMessagesTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/admin/leads", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt));
    res.json(
      rows.map((r) => ({
        id: r.id,
        fullName: r.fullName ?? null,
        whatsappNumber: r.whatsappNumber,
        email: r.email ?? null,
        source: r.source,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list leads");
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/admin/leads/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(leadsTable).where(eq(leadsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

function serializeCourse(c: typeof coursesTable.$inferSelect) {
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
    startDate: c.startDate ?? null,
    summary: c.summary,
    highlights: c.highlights ?? [],
    curriculum: c.curriculum ?? [],
    forWhom: c.forWhom ?? null,
    seatsRemaining: c.seatsRemaining ?? null,
    featured: c.featured,
  };
}

router.get("/admin/courses", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(coursesTable)
      .orderBy(desc(coursesTable.featured), asc(coursesTable.id));
    res.json(rows.map(serializeCourse));
  } catch (err) {
    req.log.error({ err }, "Failed to list courses");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/admin/courses/:id", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, Number(req.params.id)))
      .limit(1);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(serializeCourse(rows[0]!));
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.post("/admin/courses", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .insert(coursesTable)
      .values({
        slug: b.slug,
        title: b.title,
        language: b.language,
        level: b.level,
        durationMonths: Number(b.durationMonths),
        timings: b.timings,
        platform: b.platform,
        feeMonthly: Number(b.feeMonthly),
        currency: b.currency || "INR",
        startDate: b.startDate || null,
        summary: b.summary,
        highlights: Array.isArray(b.highlights) ? b.highlights : [],
        curriculum: Array.isArray(b.curriculum) ? b.curriculum : [],
        forWhom: b.forWhom || null,
        seatsRemaining:
          b.seatsRemaining === null || b.seatsRemaining === undefined
            ? null
            : Number(b.seatsRemaining),
        featured: !!b.featured,
      })
      .returning();
    res.status(201).json(serializeCourse(row!));
  } catch (err) {
    req.log.error({ err }, "Failed to create course");
    res.status(500).json({ error: "Failed to create course" });
  }
});

router.put("/admin/courses/:id", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .update(coursesTable)
      .set({
        slug: b.slug,
        title: b.title,
        language: b.language,
        level: b.level,
        durationMonths: Number(b.durationMonths),
        timings: b.timings,
        platform: b.platform,
        feeMonthly: Number(b.feeMonthly),
        currency: b.currency || "INR",
        startDate: b.startDate || null,
        summary: b.summary,
        highlights: Array.isArray(b.highlights) ? b.highlights : [],
        curriculum: Array.isArray(b.curriculum) ? b.curriculum : [],
        forWhom: b.forWhom || null,
        seatsRemaining:
          b.seatsRemaining === null || b.seatsRemaining === undefined
            ? null
            : Number(b.seatsRemaining),
        featured: !!b.featured,
      })
      .where(eq(coursesTable.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(serializeCourse(row));
  } catch (err) {
    req.log.error({ err }, "Failed to update course");
    res.status(500).json({ error: "Failed to update course" });
  }
});

router.delete("/admin/courses/:id", requireAdmin, async (req, res) => {
  try {
    await db
      .delete(coursesTable)
      .where(eq(coursesTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(testimonialsTable)
      .orderBy(desc(testimonialsTable.featured), desc(testimonialsTable.id));
    res.json(
      rows.map((t) => ({
        id: t.id,
        studentName: t.studentName,
        location: t.location ?? null,
        course: t.course ?? null,
        rating: t.rating,
        quote: t.quote,
        featured: t.featured,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.post("/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .insert(testimonialsTable)
      .values({
        studentName: b.studentName,
        location: b.location || null,
        course: b.course || null,
        rating: Number(b.rating),
        quote: b.quote,
        featured: !!b.featured,
      })
      .returning();
    res.status(201).json({
      id: row!.id,
      studentName: row!.studentName,
      location: row!.location ?? null,
      course: row!.course ?? null,
      rating: row!.rating,
      quote: row!.quote,
      featured: row!.featured,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Failed" });
  }
});

router.put("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .update(testimonialsTable)
      .set({
        studentName: b.studentName,
        location: b.location || null,
        course: b.course || null,
        rating: Number(b.rating),
        quote: b.quote,
        featured: !!b.featured,
      })
      .where(eq(testimonialsTable.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({
      id: row.id,
      studentName: row.studentName,
      location: row.location ?? null,
      course: row.course ?? null,
      rating: row.rating,
      quote: row.quote,
      featured: row.featured,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    await db
      .delete(testimonialsTable)
      .where(eq(testimonialsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/admin/faqs", requireAdmin, async (req, res) => {
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
        category: f.category ?? null,
        sortOrder: f.sortOrder,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.post("/admin/faqs", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .insert(faqsTable)
      .values({
        question: b.question,
        answer: b.answer,
        category: b.category || null,
        sortOrder: Number(b.sortOrder ?? 0),
      })
      .returning();
    res.status(201).json({
      id: row!.id,
      question: row!.question,
      answer: row!.answer,
      category: row!.category ?? null,
      sortOrder: row!.sortOrder,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.put("/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const [row] = await db
      .update(faqsTable)
      .set({
        question: b.question,
        answer: b.answer,
        category: b.category || null,
        sortOrder: Number(b.sortOrder ?? 0),
      })
      .where(eq(faqsTable.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category ?? null,
      sortOrder: row.sortOrder,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(faqsTable).where(eq(faqsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

const ALLOWED_FIELD_TYPES = new Set([
  "text",
  "email",
  "tel",
  "number",
  "textarea",
  "select",
]);

function serializeField(f: typeof formFieldsTable.$inferSelect) {
  return {
    id: f.id,
    formKey: f.formKey,
    fieldKey: f.fieldKey,
    label: f.label,
    fieldType: f.fieldType,
    placeholder: f.placeholder ?? null,
    helpText: f.helpText ?? null,
    required: f.required,
    options: f.options ?? [],
    sortOrder: f.sortOrder,
    enabled: f.enabled,
    isBuiltIn: f.isBuiltIn,
  };
}

router.get("/admin/form-fields", requireAdmin, async (req, res) => {
  try {
    await ensureBuiltInEnrollmentFields();
    const rows = await db
      .select()
      .from(formFieldsTable)
      .orderBy(asc(formFieldsTable.formKey), asc(formFieldsTable.sortOrder));
    res.json(rows.map(serializeField));
  } catch (err) {
    req.log.error({ err }, "Failed to list form fields");
    res.status(500).json({ error: "Failed" });
  }
});

router.post("/admin/form-fields", requireAdmin, async (req, res) => {
  try {
    const b = req.body ?? {};
    const fieldType = ALLOWED_FIELD_TYPES.has(b.fieldType)
      ? b.fieldType
      : "text";
    const [row] = await db
      .insert(formFieldsTable)
      .values({
        formKey: b.formKey || "enrollment",
        fieldKey: b.fieldKey,
        label: b.label,
        fieldType,
        placeholder: b.placeholder || null,
        helpText: b.helpText || null,
        required: !!b.required,
        options: Array.isArray(b.options) ? b.options : [],
        sortOrder: Number(b.sortOrder ?? 0),
        enabled: b.enabled === undefined ? true : !!b.enabled,
      })
      .returning();
    res.status(201).json(serializeField(row!));
  } catch (err) {
    req.log.error({ err }, "Failed to create form field");
    res.status(500).json({ error: "Failed to create form field" });
  }
});

router.put("/admin/form-fields/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [existing] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id));
    if (!existing) return res.status(404).json({ error: "Not found" });
    const b = req.body ?? {};
    const fieldType = existing.isBuiltIn
      ? existing.fieldType
      : ALLOWED_FIELD_TYPES.has(b.fieldType)
        ? b.fieldType
        : "text";
    const fieldKey = existing.isBuiltIn ? existing.fieldKey : b.fieldKey;
    const formKey = existing.isBuiltIn ? existing.formKey : (b.formKey || "enrollment");
    const required = ALWAYS_REQUIRED_BUILTINS.has(existing.fieldKey)
      ? true
      : !!b.required;
    const enabled = ALWAYS_REQUIRED_BUILTINS.has(existing.fieldKey)
      ? true
      : b.enabled === undefined
        ? true
        : !!b.enabled;
    const [row] = await db
      .update(formFieldsTable)
      .set({
        formKey,
        fieldKey,
        label: b.label,
        fieldType,
        placeholder: b.placeholder || null,
        helpText: b.helpText || null,
        required,
        options: Array.isArray(b.options) ? b.options : [],
        sortOrder: Number(b.sortOrder ?? existing.sortOrder),
        enabled,
      })
      .where(eq(formFieldsTable.id, id))
      .returning();
    res.json(serializeField(row!));
  } catch (err) {
    req.log.error({ err }, "Failed to update form field");
    res.status(500).json({ error: "Failed to update form field" });
  }
});

router.delete("/admin/form-fields/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [existing] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id));
    if (existing?.isBuiltIn) {
      return res.status(400).json({
        error: "Built-in fields cannot be deleted. You can hide optional ones instead.",
      });
    }
    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
