import { Router, type IRouter } from "express";
import { db, siteAssetsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import multer from "multer";
import { cloudinary } from "../lib/cloudinary";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/site-assets
router.get("/site-assets", async (req, res) => {
  try {
    const assets = await db.select().from(siteAssetsTable);
    return res.json(assets);
  } catch (error) {
    req.log.error({ error }, "Failed to fetch site assets");
    return res.status(500).json({ error: "Failed to fetch site assets" });
  }
});

// POST /api/admin/site-assets
router.post(
  "/admin/site-assets",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      const { key } = req.body ?? {};
      const file = req.file;

      if (!key) {
        return res.status(400).json({ error: "Missing asset key" });
      }

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check if there is an existing asset with this key
      const existing = await db
        .select()
        .from(siteAssetsTable)
        .where(eq(siteAssetsTable.key, key))
        .limit(1);

      // If exists, delete the old file from Cloudinary first to prevent orphaned assets
      if (existing.length > 0) {
        const oldPublicId = existing[0].publicId;
        req.log.info({ oldPublicId }, "Deleting old asset from Cloudinary");
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (destroyError) {
          req.log.error({ destroyError }, "Failed to delete old asset from Cloudinary");
        }
      }

      // Stream upload to Cloudinary
      req.log.info({ key, originalname: file.originalname }, "Uploading image to Cloudinary");
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hareem-academy",
          resource_type: "image",
        },
        async (error, result) => {
          if (error || !result) {
            req.log.error({ error }, "Cloudinary upload failed");
            return res.status(500).json({ error: "Cloudinary upload failed" });
          }

          // Apply automatic optimization parameters to URL
          const optimizedUrl = result.secure_url.replace(
            "/upload/",
            "/upload/f_auto,q_auto/"
          );

          // Upsert to Database
          await db
            .insert(siteAssetsTable)
            .values({
              key,
              url: optimizedUrl,
              publicId: result.public_id,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: siteAssetsTable.key,
              set: {
                url: optimizedUrl,
                publicId: result.public_id,
                updatedAt: new Date(),
              },
            });

          req.log.info({ key, optimizedUrl }, "Asset successfully updated");
          return res.json({
            key,
            url: optimizedUrl,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(file.buffer);
    } catch (error) {
      req.log.error({ error }, "Site asset upload failed");
      return res.status(500).json({ error: "Failed to upload asset" });
    }
  }
);

export default router;
