import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the target directory exists
const publicDir = path.resolve(__dirname, "../../../frontend/public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, "sitemap.xml");

// Base URL for the frontend
const baseUrl = process.env.VITE_APP_URL || "https://hareemacademy.com";

async function generateSitemap() {
  console.log("Generating sitemap...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // 1. Fetch dynamic data (e.g., courses)
    const result = await pool.query("SELECT slug FROM courses");
    const courses = result.rows;

    // 2. Define static routes
    const staticRoutes = [
      "",
      "/courses",
      "/about",
      "/contact",
      "/faqs",
      "/testimonials",
    ];

    // 3. Construct XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static routes
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic routes (courses)
    for (const course of courses) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    // 4. Write to public directory
    fs.writeFileSync(sitemapPath, xml, "utf8");
    console.log(`✅ Sitemap successfully generated at: ${sitemapPath}`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

generateSitemap();
