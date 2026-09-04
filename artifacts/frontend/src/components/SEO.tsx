import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  imageUrl?: string;
  url?: string;
  keywords?: string | string[];
  noindex?: boolean;
  schema?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title,
  description,
  name = "Hareem Academy",
  type = "website",
  imageUrl,
  url,
  keywords,
  noindex = false,
  schema,
}: SEOProps) {
  // Prevent duplicate brand name suffix (e.g. "About Us | Hareem Academy | Hareem Academy")
  const cleanTitle = title?.trim() || name;
  const fullTitle = cleanTitle.toLowerCase().includes(name.toLowerCase())
    ? cleanTitle
    : `${cleanTitle} | ${name}`;

  // Ensure safely resolved and normalized absolute URL
  const getCanonicalUrl = () => {
    if (url) {
      return url
        .replace("https://hareem-academy.onrender.com", "https://hareemacademy.com")
        .replace("http://localhost:5173", "https://hareemacademy.com");
    }
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      return `https://hareemacademy.com${path === "/" ? "" : path}`;
    }
    return "https://hareemacademy.com";
  };

  const currentUrl = getCanonicalUrl();
  const defaultImage = "https://hareemacademy.com/premium-hero-showcase.png";
  const resolvedImage = imageUrl || defaultImage;
  const keywordsString = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  const robotsDirective = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <meta name="robots" content={robotsDirective} />
      <meta name="googlebot" content={robotsDirective} />
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph tags (Facebook, WhatsApp, LinkedIn, Discord) */}
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hareemacademy" />
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
