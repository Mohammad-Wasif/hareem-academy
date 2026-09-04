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
const baseUrl = process.env.VITE_SITE_URL || process.env.VITE_APP_URL || "https://hareemacademy.com";

async function generateSitemap() {
  console.log("Generating sitemap...");

  let courses = [
    { slug: "arabic-foundations-level-1" },
    { slug: "intermediate-arabic-level-2" },
    { slug: "urdu-essentials-basic" }
  ];

  if (process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const result = await pool.query("SELECT slug FROM courses");
      if (result.rows && result.rows.length > 0) {
        courses = result.rows;
      }
      await pool.end();
    } catch (dbErr) {
      console.warn("⚠️ Warning: Could not connect to database to fetch courses, using default course slugs:", dbErr.message);
    }
  } else {
    console.log("ℹ️ No DATABASE_URL provided, using default course slugs.");
  }

  try {
    // 2. Define static routes
    const staticRoutes = [
      { path: "", priority: "1.0", freq: "weekly" },
      { path: "/courses", priority: "0.9", freq: "weekly" },
      { path: "/about", priority: "0.8", freq: "monthly" },
      { path: "/contact", priority: "0.8", freq: "monthly" },
      { path: "/faqs", priority: "0.8", freq: "monthly" },
      { path: "/testimonials", priority: "0.8", freq: "weekly" },
      { path: "/privacy", priority: "0.5", freq: "monthly" },
      { path: "/terms", priority: "0.5", freq: "monthly" },
      { path: "/refund", priority: "0.5", freq: "monthly" },
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

    const toTitleCase = (str) =>
      str
        .replace(/^\//, "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    // 3. Construct XML with Image Sitemap Namespace
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static routes
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
      xml += `    <changefreq>${route.freq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      if (route.path === "") {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${baseUrl}/premium-hero-showcase.png</image:loc>\n`;
        xml += `      <image:title>Live online Arabic and Quran classes for sisters at Hareem Academy</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    // Dynamic routes (courses)
    for (const course of courses) {
      const isUrdu = course.slug.includes("urdu");
      const imgName = isUrdu ? "course-urdu.png" : "course-arabic.png";
      const imgTitle = isUrdu ? "Urdu Foundations Course for Sisters" : "Arabic Course for Sisters";

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}/${imgName}</image:loc>\n`;
      xml += `      <image:title>${imgTitle}</image:title>\n`;
      xml += `    </image:image>\n`;
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
      xml += `      <image:title>${toTitleCase(route)} - Hareem Academy</image:title>\n`;
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
  }
}

generateSitemap();
