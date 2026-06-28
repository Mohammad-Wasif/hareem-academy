export interface SEOPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  aiAnswerBlock: string;
  benefitsTitle: string;
  benefits: { title: string; description: string }[];
  curriculumTitle: string;
  curriculum: { title: string; description: string }[];
  moatPoints: { title: string; description: string }[];
  testimonials: { name: string; location: string; quote: string }[];
  faqs: { question: string; answer: string }[];
  internalLinks: { label: string; href: string }[];
  primaryCTA: string;
  targetCourseSlug: string;
  geoContext: string;
}

export const seoLandingPages: Record<string, SEOPageConfig> = {};
