import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { seoLandingPages } from "@/data/seoLandingPages";
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
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  BookOpen,
  HelpCircle,
  Star,
  MapPin,
} from "lucide-react";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { motion } from "framer-motion";

interface SEOLandingPageProps {
  slug: string;
}

export default function SEOLandingPage({ slug }: SEOLandingPageProps) {
  const pageData = seoLandingPages[slug];
  const { whatsappUrl } = useWhatsApp();
  const { assets } = useSiteAssets();

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center py-20">
          <h1 className="font-serif font-bold text-3xl text-primary mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested SEO landing page could not be found.</p>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
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
        "name": pageData.heroTitle,
        "item": `https://hareemacademy.com/${pageData.slug}`
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": pageData.heroTitle,
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
    "mainEntity": pageData.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Reusable animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-16 sm:pt-20">
      <SEO
        title={pageData.title}
        description={pageData.metaDescription}
        schema={[breadcrumbSchema, courseSchema, faqSchema]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0F4D36] text-white py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-[#ECC565]/20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={assets["hero_bg"] || "/hero-bg.png"}
            alt=""
            className="w-full h-full object-cover opacity-[0.03]"
          />
          <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(236,197,101,0.05), transparent)" />
        </div>

        <div className="container relative z-10 px-4 max-w-5xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ECC565] font-sans font-semibold text-xs tracking-wider uppercase"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>100% Sisters Only • Female Teachers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight max-w-4xl mx-auto text-[#ECC565]"
          >
            {pageData.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {pageData.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4"
          >
            <EnrollmentModal mode="trial" defaultCourseSlug={pageData.targetCourseSlug}>
              <Button className="bg-[#ECC565] text-[#0F4D36] hover:bg-[#ECC565]/90 rounded-xl h-11 px-6 font-semibold shadow-md shadow-black/10 font-sans text-sm sm:text-base cursor-pointer">
                <Sparkles className="w-4 h-4 mr-2" />
                {pageData.primaryCTA}
              </Button>
            </EnrollmentModal>
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 rounded-xl h-11 px-6 font-sans text-sm sm:text-base"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Speak With Our Team
              </a>
            </Button>
          </motion.div>
          
          <p className="text-[10px] text-white/50 tracking-wider font-sans uppercase">
            {pageData.geoContext}
          </p>
        </div>
      </section>

      {/* 2. AI QUICK ANSWER BLOCK (Optimized for Perplexity, Gemini, ChatGPT) */}
      <section className="container px-4 max-w-4xl -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-card border border-[#ECC565]/20 rounded-2xl p-5 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl" />
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-sans">Quick Overview</span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-100 font-sans">AI Summary</span>
            </div>
            <p className="text-foreground/90 font-sans text-sm sm:text-base leading-relaxed font-medium">
              {pageData.aiAnswerBlock}
            </p>
          </div>
        </div>
      </section>

      {/* 3. KEY BENEFITS */}
      <section className="container px-4 py-16 sm:py-24 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
            {pageData.benefitsTitle}
          </h2>
          <div className="w-12 h-1 bg-[#ECC565] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pageData.benefits.map((benefit, i) => {
            const icons = [BookOpen, Video, Award];
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="bg-card border border-border hover:border-primary/20 transition-all p-6 rounded-2xl shadow-sm space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. THE MOAT (Privacy, Sisters-Only) */}
      <section className="bg-primary/5 py-16 sm:py-20 border-y border-border">
        <div className="container px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#ECC565] uppercase">Our Moat</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-primary leading-tight">
                Built Exclusively for Sisters.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We believe that learning is most effective when you feel completely comfortable. Our academy is designed by sisters, for sisters, ensuring that modesty, respect, and sisterly bonding are rooted in every class.
              </p>
              <div className="space-y-4">
                {pageData.moatPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{point.title}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 to-[#ECC565]/5 rounded-3xl blur-2xl opacity-40" />
              <div className="relative bg-card border border-border p-2 rounded-3xl shadow-lg">
                <img
                  src={assets["hero_showcase"] || "/premium-hero-showcase.png"}
                  alt="Sisters learning environment showcase"
                  className="w-full h-auto rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURRICULUM SYLLABUS */}
      <section className="container px-4 py-16 sm:py-24 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
            {pageData.curriculumTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            Step-by-step roadmap tailored for adult learners to build retention and depth.
          </p>
        </div>

        <div className="relative border-l-2 border-primary/10 ml-4 pl-6 space-y-10">
          {pageData.curriculum.map((module, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-10 top-0.5 w-7 h-7 rounded-full bg-[#0F4D36] text-[#ECC565] font-serif font-bold text-xs flex items-center justify-center border-4 border-background">
                {i + 1}
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground">{module.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      {pageData.testimonials.length > 0 && (
        <section className="bg-primary/5 py-16 sm:py-24 border-y border-border">
          <div className="container px-4 max-w-4xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-[#ECC565] uppercase">Reviews</span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary mt-2">
                What Our Students Say
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pageData.testimonials.map((testimonial, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-foreground/90 font-serif italic text-sm leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{testimonial.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQS */}
      <section className="container px-4 py-16 sm:py-24 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-primary mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">Have a question? We have answers.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {pageData.faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="bg-card border border-border rounded-xl px-6"
            >
              <AccordionTrigger className="hover:no-underline font-bold text-left py-4 text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 8. INTERNAL LINKING ENGINE (Crawlability & Related Paths) */}
      <section className="bg-card border-t border-border py-12 sm:py-16">
        <div className="container px-4 max-w-4xl text-center space-y-6">
          <HelpCircle className="w-8 h-8 text-accent mx-auto" />
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-primary">Related Programs & Paths</h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
            {pageData.internalLinks.map((link, idx) => (
              <Button key={idx} asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 text-xs sm:text-sm">
                <Link href={link.href}>
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA CLOSING BAND */}
      <section className="container px-4 mt-12 max-w-4xl">
        <div className="bg-[#0F4D36] text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-6 border border-[#ECC565]/20 shadow-xl shadow-black/15 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <img src={assets["hero_bg"] || "/hero-bg.png"} alt="" className="w-full h-full object-cover" />
          </div>
          <Sparkles className="w-8 h-8 text-accent mx-auto" />
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white">
            Begin Learning With Confidence
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Attend a free trial class with our patient teacher. Try a real session in a completely private cohort before deciding. No payment or cards required to start.
          </p>
          <div className="flex justify-center pt-2">
            <EnrollmentModal mode="trial" defaultCourseSlug={pageData.targetCourseSlug}>
              <Button className="bg-[#ECC565] text-[#0F4D36] hover:bg-[#ECC565]/90 rounded-xl h-11 px-8 font-semibold shadow-md shadow-black/10 font-sans text-sm sm:text-base cursor-pointer">
                {pageData.primaryCTA}
              </Button>
            </EnrollmentModal>
          </div>
        </div>
      </section>
    </div>
  );
}
