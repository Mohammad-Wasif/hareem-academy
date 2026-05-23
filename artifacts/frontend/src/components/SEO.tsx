import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  imageUrl?: string;
  url?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title,
  description,
  name = "Hareem Academy",
  type = "website",
  imageUrl,
  url,
  schema,
}: SEOProps) {
  const fullTitle = `${title} | ${name}`;
  // Ensure we safely resolve and normalize URL on client side to prevent search engines from indexing render domain
  const getCanonicalUrl = () => {
    if (url) {
      return url.replace("https://hareem-academy.onrender.com", "https://hareemacademy.com");
    }
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      return `https://hareemacademy.com${path}`;
    }
    return "https://hareemacademy.com";
  };
  const currentUrl = getCanonicalUrl();
  const defaultImage = "https://hareemacademy.com/premium-hero-showcase.png";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* OpenGraph tags (for Facebook, LinkedIn, WhatsApp, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl || defaultImage} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || defaultImage} />

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
