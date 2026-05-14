import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  imageUrl?: string;
  url?: string;
}

export function SEO({
  title,
  description,
  name = "Hareem Academy",
  type = "website",
  imageUrl,
  url,
}: SEOProps) {
  const fullTitle = `${title} | ${name}`;
  const currentUrl = url || window.location.href;
  const defaultImage = "https://yourdomain.com/default-og-image.jpg"; // Replace with actual default OG image later

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
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
    </Helmet>
  );
}
