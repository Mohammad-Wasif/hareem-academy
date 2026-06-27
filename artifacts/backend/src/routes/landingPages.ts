import { Router, type IRouter } from "express";
import { db, landingPagesTable, eq } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

// GET /api/landing-pages/:slug - Public page configuration fetch
router.get("/landing-pages/:slug", async (req, res) => {
  try {
    const slug = req.params.slug as string;
    const rows = await db
      .select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.slug, slug))
      .limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Landing page not found in database" });
    }

    return res.json(rows[0]);
  } catch (error) {
    req.log.error({ error, slug: req.params.slug }, "Failed to fetch public landing page");
    return res.status(500).json({ error: "Failed to fetch landing page" });
  }
});

// GET /api/admin/landing-pages - Admin check pages list
router.get("/admin/landing-pages", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(landingPagesTable);
    return res.json(rows);
  } catch (error) {
    req.log.error({ error }, "Failed to fetch admin landing pages list");
    return res.status(500).json({ error: "Failed to fetch landing pages list" });
  }
});

// POST /api/admin/landing-pages - Admin create a new page configuration
router.post("/admin/landing-pages", requireAdmin, async (req, res) => {
  try {
    const { slug, title, metaDescription, config } = req.body ?? {};
    if (!slug || !title) {
      return res.status(400).json({ error: "Missing required fields slug or title" });
    }

    const [row] = await db
      .insert(landingPagesTable)
      .values({
        slug,
        title,
        metaDescription: metaDescription || null,
        config: config || {},
      })
      .returning();

    return res.status(201).json(row);
  } catch (error) {
    req.log.error({ error }, "Failed to create landing page configuration");
    return res.status(500).json({ error: "Failed to create landing page configuration" });
  }
});

// PUT /api/admin/landing-pages/:slug - Admin update page configuration
router.put("/api/admin/landing-pages/:slug", requireAdmin, async (req, res) => {
  try {
    const slug = req.params.slug as string;
    const { title, metaDescription, config } = req.body ?? {};

    const [row] = await db
      .update(landingPagesTable)
      .set({
        title,
        metaDescription: metaDescription || null,
        config: config || {},
        updatedAt: new Date(),
      })
      .where(eq(landingPagesTable.slug, slug))
      .returning();

    if (!row) {
      return res.status(404).json({ error: "Landing page not found" });
    }

    return res.json(row);
  } catch (error) {
    req.log.error({ error, slug: req.params.slug }, "Failed to update landing page configuration");
    return res.status(500).json({ error: "Failed to update landing page configuration" });
  }
});

// DELETE /api/admin/landing-pages/:slug - Admin delete custom page configuration
router.delete("/api/admin/landing-pages/:slug", requireAdmin, async (req, res) => {
  try {
    const slug = req.params.slug as string;
    const [row] = await db
      .delete(landingPagesTable)
      .where(eq(landingPagesTable.slug, slug))
      .returning();

    if (!row) {
      return res.status(404).json({ error: "Landing page not found" });
    }

    return res.json({ ok: true, slug });
  } catch (error) {
    req.log.error({ error, slug: req.params.slug }, "Failed to delete landing page configuration");
    return res.status(500).json({ error: "Failed to delete landing page" });
  }
});

export default router;
