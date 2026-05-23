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

    // 13 SEO landing page routes
    const seoRoutes = [
      "/learn-arabic-online-for-sisters",
      "/arabic-classes-for-muslim-women",
      "/beginner-arabic-course-online",
      "/quranic-arabic-classes",
      "/female-arabic-teachers-online",
      "/learn-urdu-online",
      "/urdu-course-for-beginners",
      "/urdu-reading-classes",
      "/online-urdu-classes-for-sisters",
      "/learn-quran-with-meaning",
      "/quran-reading-classes-for-sisters",
      "/online-tajweed-classes",
      "/understand-quranic-arabic",
    ];

    // 3. Construct XML with Image Sitemap Namespace
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static routes
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n`;
      if (route === "") {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${baseUrl}/premium-hero-showcase.png</image:loc>\n`;
        xml += `      <image:title>Live online Arabic and Quran classes for sisters at Hareem Academy</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    // SEO landing page routes
    for (const route of seoRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}/premium-hero-showcase.png</image:loc>\n`;
      xml += `      <image:title>${route.replace(/^\//, "").replace(/-/g, " ")}</image:title>\n`;
      xml += `    </image:image>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic routes (courses)
    for (const course of courses) {
      const isUrdu = course.slug.includes("urdu");
      const imgName = isUrdu ? "course-urdu.png" : "course-arabic.png";
      const imgTitle = isUrdu ? "Urdu Foundations Course for Sisters" : "Arabic Course for Sisters";

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}/${imgName}</image:loc>\n`;
      xml += `      <image:title>${imgTitle}</image:title>\n`;
      xml += `    </image:image>\n`;
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
