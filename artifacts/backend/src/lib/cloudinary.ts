import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.warn("Cloudinary environment variables are missing! Media uploading will not work correctly.");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info("Cloudinary successfully configured.");
}

export { cloudinary };
