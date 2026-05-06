import { Router, type IRouter } from "express";
import { db, siteContentTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/site-content", async (req, res) => {
  try {
    const allContent = await db.select().from(siteContentTable);
    return res.json(allContent);
  } catch (error) {
    req.log.error({ error }, "Failed to fetch site content");
    return res.status(500).json({ error: "Failed to fetch site content" });
  }
});

export default router;
