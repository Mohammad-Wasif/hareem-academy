import { useState, useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { adminApi } from "@/lib/adminApi";
import { seoLandingPages } from "@/data/seoLandingPages";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Video,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Star,
  MapPin,
  BookOpen,
} from "lucide-react";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useSiteAssets } from "@/hooks/use-site-assets";
import PremiumImage from "@/components/PremiumImage";
import { motion, type Variants } from "framer-motion";

interface SEOLandingPageProps {
  slug: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const splitWords = (text: string) => {
  if (!text) return null;
  return text.split(" ").map((word, idx) => (
    <span key={idx} className="inline-block overflow-hidden mr-[0.22em] pb-[0.05em] align-bottom">
      <motion.span
        className="inline-block"
        variants={{
          hidden: { y: "115%", opacity: 0 },
          show: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
          },
        }}
      >
        {word}
      </motion.span>
    </span>
  ));
};

export default function SEOLandingPage({ slug }: SEOLandingPageProps) {
  const [localPageData, setLocalPageData] = useState<any>(null);

  useEffect(() => {
    let active = true;
    adminApi.getLandingPage(slug)
      .then((data) => {
        if (!active) return;
        if (data) {
          setLocalPageData({
            slug: data.slug,
            title: data.title,
            metaDescription: data.metaDescription || "",
            ...data.config,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load landing page from database, falling back to local storage:", err);
        if (!active) return;
        const saved = localStorage.getItem("hareem_landing_pages");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed[slug]) {
              setLocalPageData(parsed[slug]);
            }
          } catch (e) {
            console.error("Error loading local page layout:", e);
          }
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const basePageData = seoLandingPages[slug];
  const pageData = localPageData || basePageData;
  const { whatsappUrl } = useWhatsApp();
  const { assets } = useSiteAssets();

  if (!pageData) {
    return <NotFound />;
  }

  // Define dynamic structured schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hareemacademy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageData.heroTitle || pageData.title,
        "item": `https://hareemacademy.com/${pageData.slug}`
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": pageData.heroTitle || pageData.title,
    "description": pageData.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "Hareem Academy",
      "sameAs": "https://hareemacademy.com"
    },
    "educationalLevel": "Beginner to Intermediate",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "instructor": {
        "@type": "Person",
        "name": "Qualified Female Educator",
        "jobTitle": "Islamic Instructor"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (pageData.faqs || []).map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Section ordering list
  const renderedSections = pageData.sections || [
    { id: "hero", visible: true },
    { id: "overview", visible: true },
    { id: "benefits", visible: true },
    { id: "moat", visible: true },
    { id: "curriculum", visible: true },
    { id: "testimonials", visible: true },
    { id: "faqs", visible: true },
    { id: "related", visible: true },
    { id: "cta", visible: true }
  ];

  // Map theme variables
  const computedFont =
    pageData.theme?.fontFamily === "sans"
      ? "font-sans"
      : pageData.theme?.fontFamily === "mono"
        ? "font-mono"
        : "font-serif";

  const sizeClass =
    pageData.theme?.baseFontSize === "lg"
      ? "text-lg"
      : pageData.theme?.baseFontSize === "sm"
        ? "text-sm"
        : "text-base";

  const primaryColor = pageData.theme?.primaryColor || "#0F4D36";
  const accentColor = pageData.theme?.accentColor || "#ECC565";
  const backgroundColor = pageData.theme?.backgroundColor || "#FDFCF7";

  return (
    <div
      style={{ backgroundColor }}
      className={`min-h-screen pb-24 pt-4 sm:pt-8 overflow-x-hidden ${computedFont} ${sizeClass}`}
    >
      <SEO
        title={pageData.title}
        description={pageData.metaDescription}
        schema={[breadcrumbSchema, courseSchema, faqSchema]}
      />

      {renderedSections.map((sec: any) => {
        if (sec.visible === false) return null;

        switch (sec.id) {
          case "hero":
            return (
              <section key="hero" className="relative overflow-hidden py-16 sm:py-24 lg:py-32 border-b border-primary/5 flex items-center min-h-[50dvh]">
                <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
                  <PremiumImage
                    assetKey="hero_bg"
                    fallback="/hero-bg.png"
                    alt=""
                    widthClass="w-full"
                    heightClass="h-full"
                    className="object-cover opacity-[0.03]"
                  />
                  <div className="absolute inset-0 hero-glow-bg" />
                  <div className="absolute inset-0 bg-arabesque-fade opacity-[0.02]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/90 to-background" />
                </div>

                <div className="container relative z-10 px-4 max-w-5xl text-center">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-6 sm:space-y-8"
                  >
                    <motion.div
                      variants={fadeUp}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-primary/[0.03] border border-primary/8 text-primary/95 font-sans font-semibold text-xs tracking-wider uppercase"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accentColor }} />
                      <span style={{ color: primaryColor }}>100% Sisters Only • Live Female Teachers</span>
                    </motion.div>

                    <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] max-w-4xl mx-auto tracking-tight" style={{ color: primaryColor }}>
                      {splitWords(pageData.heroTitle)}
                    </h1>

                    <motion.p
                      variants={fadeUp}
                      className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans"
                    >
                      {pageData.heroSubtitle}
                    </motion.p>

                    <motion.div
                      variants={fadeUp}
                      className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 sm:pt-4"
                    >
                      <EnrollmentModal mode="trial" defaultCourseSlug={pageData.targetCourseSlug}>
                        <Button className="border border-primary/10 rounded-xl h-12 px-8 font-semibold shadow-md font-sans text-sm sm:text-base cursor-pointer transition-all duration-300" style={{ backgroundColor: accentColor, color: primaryColor }}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {pageData.primaryCTA || "Start Journey"}
                        </Button>
                      </EnrollmentModal>
                      <Button
                        asChild
                        variant="outline"
                        className="border-primary/10 hover:bg-primary/[0.02] rounded-xl h-12 px-8 font-sans text-sm sm:text-base transition-all duration-300"
                        style={{ color: primaryColor }}
                      >
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                          Speak With Our Team
                        </a>
                      </Button>
                    </motion.div>

                    <motion.p
                      variants={fadeUp}
                      className="text-[10px] text-muted-foreground/60 tracking-wider font-sans uppercase font-medium"
                    >
                      {pageData.geoContext}
                    </motion.p>
                  </motion.div>
                </div>
              </section>
            );

          case "overview":
            return (
              <section key="overview" className="container px-4 max-w-4xl -mt-8 sm:-mt-12 relative z-20">
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="premium-card p-6 sm:p-8 flex flex-col md:flex-row gap-4 items-start relative overflow-hidden bg-white"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl" />
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                    <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase font-sans" style={{ color: accentColor }}>Quick Overview</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border font-sans" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, borderColor: `${primaryColor}20` }}>AI Summary</span>
                    </div>
                    <p className="font-sans text-sm sm:text-base leading-relaxed font-medium" style={{ color: primaryColor }}>
                      {pageData.aiAnswerBlock}
                    </p>
                  </div>
                </motion.div>
              </section>
            );

          case "benefits":
            return (
              <section key="benefits" className="container px-4 py-16 sm:py-24 max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase font-sans mb-2" style={{ color: accentColor }}>Core Benefits</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl" style={{ color: primaryColor }}>
                    {pageData.benefitsTitle}
                  </h2>
                  <div className="w-12 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: accentColor }} />
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {(pageData.benefits || []).map((benefit: any, i: number) => {
                    const icons = [BookOpen, Video, Award];
                    const Icon = icons[i % icons.length];
                    return (
                      <motion.div
                        variants={fadeUp}
                        key={i}
                        className="premium-card bg-white p-6 sm:p-8 space-y-4 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/5 group-hover:border-primary/20 transition-colors">
                          <Icon className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                        <h3 className="font-sans font-bold text-lg text-foreground group-hover:text-primary transition-colors text-left" style={{ color: primaryColor }}>{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed text-left">{benefit.description}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>
            );

          case "moat":
            return (
              <section key="moat" className="py-16 sm:py-24 border-y border-primary/5 bg-primary/[0.01]">
                <div className="container px-4 max-w-5xl">
                  <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-7 space-y-6 text-left">
                      <span className="text-[10px] font-bold tracking-widest uppercase font-sans" style={{ color: accentColor }}>Our Mission & Privacy Moat</span>
                      <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl leading-tight" style={{ color: primaryColor }}>
                        Built Exclusively for Sisters.
                      </h2>
                      <div className="w-12 h-[3px] rounded-full mt-2" style={{ backgroundColor: accentColor }} />
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans pt-2">
                        We believe that learning is most effective when you feel completely comfortable. Our academy is designed by sisters, for sisters, ensuring that modesty, respect, and sisterly bonding are rooted in every class.
                      </p>
                      <div className="space-y-4 pt-2">
                        {(pageData.moatPoints || []).map((point: any, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-5.5 h-5.5 rounded-full bg-primary/5 flex items-center justify-center shrink-0 mt-0.5 border border-primary/5">
                              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm font-sans" style={{ color: primaryColor }}>{point.title}</h4>
                              <p className="text-muted-foreground text-xs mt-0.5 font-sans leading-relaxed">{point.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 relative max-w-md mx-auto w-full">
                      <div className="absolute -inset-3 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl blur-2xl opacity-40" />
                      <div className="relative bg-card border border-primary/5 p-2 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden w-full aspect-[4/3] hover:border-primary/10 transition-colors duration-500">
                        <PremiumImage
                          assetKey="hero_showcase"
                          fallback="/premium-hero-showcase.png"
                          alt="Sisters learning environment showcase"
                          widthClass="w-full"
                          heightClass="h-full"
                          roundedClass="rounded-2xl"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          case "curriculum":
            return (
              <section key="curriculum" className="container px-4 py-16 sm:py-24 max-w-3xl">
                <div className="text-center mb-12 sm:mb-16">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase font-sans mb-2" style={{ color: accentColor }}>Curriculum Roadmap</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl" style={{ color: primaryColor }}>
                    {pageData.curriculumTitle}
                  </h2>
                  <div className="w-12 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: accentColor }} />
                  <p className="text-muted-foreground text-sm mt-4 font-sans">
                    Step-by-step roadmap tailored for adult learners to build retention and depth.
                  </p>
                </div>

                <div className="relative border-l border-primary/10 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10 py-2 text-left">
                  <div className="absolute left-[-1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-accent/30 to-transparent" />

                  {(pageData.curriculum || []).map((module: any, i: number) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-card font-serif font-bold text-xs flex items-center justify-center border shadow-sm transition-all duration-300" style={{ color: primaryColor, borderColor: accentColor }}>
                        {i + 1}
                      </div>
                      <h3 className="font-sans font-bold text-base sm:text-lg transition-colors" style={{ color: primaryColor }}>{module.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed font-sans">{module.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "testimonials":
            if ((pageData.testimonials || []).length === 0) return null;
            return (
              <section key="testimonials" className="py-16 sm:py-24 border-y border-primary/5 bg-primary/[0.01]">
                <div className="container px-4 max-w-4xl">
                  <div className="text-center mb-12 sm:mb-16">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-sans" style={{ color: accentColor }}>Reviews</span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl mt-2" style={{ color: primaryColor }}>
                      What Our Students Say
                    </h2>
                    <div className="w-12 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: accentColor }} />
                  </div>

                  <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {(pageData.testimonials || []).map((testimonial: any, i: number) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        className="premium-card bg-white p-6 sm:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 text-left"
                      >
                        <div className="space-y-4">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-accent text-accent" style={{ fill: accentColor, color: accentColor }} />
                            ))}
                          </div>
                          <p className="font-serif italic text-sm sm:text-base leading-relaxed" style={{ color: primaryColor }}>
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-primary/5">
                          <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                          <div>
                            <h4 className="font-bold text-xs font-sans text-foreground">{testimonial.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-sans">{testimonial.location}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>
            );

          case "faqs":
            if ((pageData.faqs || []).length === 0) return null;
            return (
              <section key="faqs" className="container px-4 py-16 sm:py-24 max-w-3xl">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans" style={{ color: accentColor }}>Answers</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl mt-2" style={{ color: primaryColor }}>
                    Frequently Asked Questions
                  </h2>
                  <div className="w-12 h-[3px] mx-auto rounded-full mt-4" style={{ backgroundColor: accentColor }} />
                  <p className="text-muted-foreground text-sm mt-4 font-sans">Have a question? We have answers.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3 text-left">
                  {(pageData.faqs || []).map((faq: any, index: number) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="bg-white border border-primary/5 rounded-xl px-6 hover:border-primary/10 transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline font-bold text-left py-4 text-sm sm:text-base font-sans" style={{ color: primaryColor }}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed text-sm font-sans">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            );

          case "related":
            if ((pageData.internalLinks || []).length === 0) return null;
            return (
              <section key="related" className="border-t border-primary/5 py-12 sm:py-16">
                <div className="container px-4 max-w-4xl text-center space-y-6">
                  <HelpCircle className="w-8 h-8 mx-auto" style={{ color: accentColor }} />
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground" style={{ color: primaryColor }}>Related Programs & Paths</h3>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
                    {(pageData.internalLinks || []).map((link: any, idx: number) => (
                      <Button
                        key={idx}
                        asChild
                        variant="outline"
                        className="rounded-full border-primary/10 hover:bg-primary/[0.02] text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-5 font-sans transition-all duration-300"
                        style={{ color: primaryColor }}
                      >
                        <Link href={link.href}>
                          {link.label}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "cta":
            return (
              <section key="cta" className="container px-4 mt-8 max-w-4xl">
                <div className="rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-6 border border-white/10 shadow-xl relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] w-full h-full">
                    <PremiumImage
                      assetKey="hero_bg"
                      fallback="/hero-bg.png"
                      alt=""
                      widthClass="w-full"
                      heightClass="h-full"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(236,197,101,0.06), transparent)" />
                  <Sparkles className="w-8 h-8 mx-auto animate-pulse" style={{ color: accentColor }} />
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white">
                    Begin Learning With Confidence
                  </h2>
                  <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
                    Attend a free trial class with our patient teacher. Try a real session in a completely private cohort before deciding. No payment or cards required to start.
                  </p>
                  <div className="flex justify-center pt-2">
                    <EnrollmentModal mode="trial" defaultCourseSlug={pageData.targetCourseSlug}>
                      <Button className="rounded-xl h-12 px-8 font-semibold shadow-md font-sans text-sm sm:text-base cursor-pointer transition-all duration-300" style={{ backgroundColor: accentColor, color: primaryColor }}>
                        {pageData.primaryCTA || "Start Free Trial"}
                      </Button>
                    </EnrollmentModal>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
