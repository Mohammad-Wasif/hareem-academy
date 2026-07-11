import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ShieldCheck,
  Video,
  Heart,
  BookOpen,
  Star,
  Clock,
  HeartCrack,
  Sparkles,
  CheckCircle2,
  Award,
  ArrowRight,
  Search,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import CTAGroup from "@/components/CTAGroup";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { useListCourses, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";
import { adminApi } from "@/lib/adminApi";

import { SEO } from "@/components/SEO";
import { useSiteAssets } from "@/hooks/use-site-assets";
import PremiumImage from "@/components/PremiumImage";

/* ── Reusable animation variants ── */
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

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <>{count}</>;
}

export default function Home() {
  const { assets } = useSiteAssets();
  const { data: courses = [] } = useListCourses();
  const { data: testimonials = [] } = useListTestimonials();
  const { data: stats } = useGetSiteStats();
  const [homeConfig, setHomeConfig] = useState<any>(null);

  useEffect(() => {
    adminApi.getLandingPage("home")
      .then((data) => {
        if (data && data.config) {
          setHomeConfig(data.config);
        }
      })
      .catch((err) => {
        console.warn("Could not load homepage config overrides:", err);
      });
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hareem Academy",
    "url": "https://hareemacademy.com",
    "logo": assets["logo"] || "https://hareemacademy.com/assets/IMG_20260507_171922.png",
    "sameAs": [
      "https://www.facebook.com/hareemacademy",
      "https://www.instagram.com/hareemacademy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9315118289",
      "contactType": "admissions",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "Urdu", "Arabic"]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hareem Academy",
    "image": assets["hero_showcase"] || "https://hareemacademy.com/premium-hero-showcase.png",
    "telePhone": "+91-9315118289",
    "url": "https://hareemacademy.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110025",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.56,
      "longitude": 77.29
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who can join Hareem Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hareem Academy is exclusively for girls and women (sisters only). We welcome learners of all ages and backgrounds — whether you are a beginner or want to deepen your existing knowledge."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need any prior knowledge of Arabic or Urdu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not at all! Our Beginner courses start from the very basics — the alphabet, pronunciation, and simple words. You will be guided step by step."
        }
      },
      {
        "@type": "Question",
        "name": "How are classes conducted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All classes are held live on Zoom. You get real-time interaction with your teacher, can ask questions, and practice during class."
        }
      }
    ]
  };

  const computedFont =
    homeConfig?.theme?.fontFamily === "sans"
      ? "font-sans"
      : homeConfig?.theme?.fontFamily === "mono"
      ? "font-mono"
      : "font-serif";

  const sizeClass =
    homeConfig?.theme?.baseFontSize === "lg"
      ? "text-lg"
      : homeConfig?.theme?.baseFontSize === "sm"
      ? "text-sm"
      : "text-base";

  const primaryColor = homeConfig?.theme?.primaryColor;
  const accentColor = homeConfig?.theme?.accentColor;
  const backgroundColor = homeConfig?.theme?.backgroundColor;

  return (
    <div 
      className={`flex flex-col min-h-screen w-full overflow-x-hidden ${computedFont} ${sizeClass}`}
      style={homeConfig?.theme ? { backgroundColor } as React.CSSProperties : undefined}
    >
      <SEO
        title={homeConfig?.title || "Online Quran Classes for Sisters"}
        description={homeConfig?.metaDescription || "Live, female-only online Quran and Arabic classes. Learn Tajweed and meaning in a comfortable, judgment-free environment."}
        schema={[organizationSchema, localBusinessSchema, faqSchema]}
      />

      {/* 1. HERO */}
      <section className="relative bg-background overflow-hidden pt-2 pb-3 sm:pt-4 sm:pb-4 flex items-center min-h-[auto] sm:min-h-[60vh] lg:min-h-[65vh]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full opacity-[0.03]">
            <PremiumImage
              assetKey="hero_bg"
              fallback="/hero-bg.png"
              alt=""
              className="w-full h-full object-cover"
              widthClass="w-full"
              heightClass="h-full"
              fetchPriority="low"
            />
          </div>
          {/* Subtle radial glow and vertical cream gradient */}
          <div className="absolute inset-0 hero-glow-bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/90 to-background" />
        </div>

        <div className="container relative z-10 px-4 py-2 sm:py-4 lg:py-6">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <motion.div
              className="lg:col-span-7 space-y-2.5 sm:space-y-4 text-left"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-[3px] sm:px-3 sm:py-1 rounded-full bg-primary/[0.03] border border-primary/8 text-primary/95 font-sans font-semibold text-[10px] sm:text-xs tracking-wide capitalize"
              >
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: accentColor || "#D6B25E" }} />
                <span style={{ color: primaryColor }}>{homeConfig?.geoContext || "Women-Only • Live Online Arabic & Urdu Classes"}</span>
              </motion.div>

              <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-foreground leading-[1.15] sm:leading-[1.12] tracking-[-0.02em] sm:tracking-tight" style={{ color: primaryColor }}>
                {homeConfig?.heroTitle ? (
                  splitWords(homeConfig.heroTitle)
                ) : (
                  <>
                    {splitWords("Structured Arabic & Urdu")}{" "}
                    <br className="hidden sm:inline" />
                    <span className="text-primary relative inline-block overflow-hidden vertical-align-bottom">
                      <motion.span
                        className="inline-block relative"
                        variants={{
                          hidden: { y: "115%", opacity: 0 },
                          show: {
                            y: 0,
                            opacity: 1,
                            transition: {
                              duration: 0.9,
                              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                            },
                          },
                        }}
                      >
                        Learning for Sisters
                        <span className="absolute bottom-1 left-0 w-full h-[3px] bg-accent/40 rounded-full" />
                      </motion.span>
                    </span>
                  </>
                )}
              </h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[0.8125rem] sm:text-base text-muted-foreground max-w-[92%] sm:max-w-xl leading-[1.6] sm:leading-relaxed font-sans"
              >
                {homeConfig?.heroSubtitle || "Live online Arabic and Urdu classes taught by qualified female teachers through structured, beginner-friendly lessons designed for sisters worldwide."}
              </motion.p>

              <motion.div 
                variants={fadeUp} 
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col gap-2.5 sm:gap-3.5"
              >
                <CTAGroup variant="hero" trialMode primaryLabel={homeConfig?.primaryCTA || "Explore Courses"} primaryHref="/courses" />
                
                {/* Trust rating & Student Avatars directly under CTAs */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary/5 border border-accent/40 text-primary font-serif text-[10px] font-bold flex items-center justify-center backdrop-blur shadow-sm select-none">H</div>
                    <div className="w-7 h-7 rounded-full bg-primary/5 border border-accent/40 text-primary font-serif text-[10px] font-bold flex items-center justify-center backdrop-blur shadow-sm select-none">A</div>
                    <div className="w-7 h-7 rounded-full bg-primary/5 border border-accent/40 text-primary font-serif text-[10px] font-bold flex items-center justify-center backdrop-blur shadow-sm select-none">S</div>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex gap-0.5 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-accent text-accent" />
                      ))}
                      <span className="text-[10px] sm:text-[11px] font-bold text-foreground ml-1">4.9/5</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">Loved by 100+ sisters</span>
                  </div>
                </div>
              </motion.div>

              {/* Redesigned Structured Stats Box */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-3 gap-1.5 sm:gap-4 px-3 py-3 sm:p-4 rounded-xl bg-card border border-primary/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mt-3 sm:mt-4"
              >
                <div className="text-center sm:text-left border-r border-primary/10 last:border-r-0 pr-2">
                  <p className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-foreground tracking-tight">
                    <AnimatedCounter target={Number(stats?.totalStudents || 50)} />+
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    Sisters Learning
                  </p>
                </div>
                <div className="text-center sm:text-left border-r border-primary/10 last:border-r-0 px-1 sm:px-4">
                  <p className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-foreground tracking-tight">
                    <AnimatedCounter target={Number(stats?.countriesReached || 2)} />+
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    Countries Reached
                  </p>
                </div>
                <div className="text-center sm:text-left pl-1 sm:pl-4">
                  <p className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-foreground tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>Live</span>
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    Interactive Classes
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Mobile-only: Compact illustration below stats */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="block lg:hidden mt-2"
            >
              <div className="relative w-full max-w-[280px] mx-auto">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary/3 to-accent/3 rounded-xl blur-xl opacity-20" />
                <div className="relative bg-card border border-primary/5 rounded-xl p-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <PremiumImage
                    assetKey="hero_showcase"
                    fallback="/premium-hero-showcase.png"
                    alt="Live online Arabic and Quran classes for sisters at Hareem Academy"
                    className="rounded-lg object-cover"
                    aspectRatio="aspect-[1.12/1]"
                    widthClass="w-full max-w-[280px]"
                    heightClass="h-auto"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium Hero Visual/Illustration */}
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 hidden lg:block relative"
            >
              <div className="relative w-full max-w-[420px] mx-auto">
                {/* Decorative glow/gradient background behind the image */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/3 to-accent/3 rounded-2xl blur-2xl opacity-25" />
                
                {/* Visual card frame */}
                <div className="relative bg-card border border-primary/5 rounded-2xl p-1.5 shadow-[0_8px_30px_rgba(19,94,70,0.02)] hover:border-primary/10 transition-all duration-500">
                  <PremiumImage
                    assetKey="hero_showcase"
                    fallback="/premium-hero-showcase.png"
                    alt="Live online Arabic and Quran classes for sisters at Hareem Academy"
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    aspectRatio="aspect-[1.12/1]"
                    widthClass="w-full max-w-[420px]"
                    heightClass="h-auto"
                    fetchPriority="high"
                  />
                  
                  {/* Floating badge 1: sisters-only */}
                  <div className="absolute -bottom-3 -left-4 bg-background border border-primary/5 shadow-sm rounded-xl p-2 flex items-center gap-2 hover:-translate-y-0.5 transition-transform duration-300">
                    <div className="w-6.5 h-6.5 rounded-full bg-primary/[0.03] border border-primary/8 flex items-center justify-center text-primary">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground font-sans leading-none">Sisters Only</p>
                      <p className="text-[8px] text-muted-foreground font-sans leading-none mt-0.5">100% Private Classes</p>
                    </div>
                  </div>
 
                  {/* Floating badge 2: Stars/Rating */}
                  <div className="absolute -top-3 -right-4 bg-background border border-primary/5 shadow-sm rounded-xl p-2 flex items-center gap-1.5 hover:translate-y-0.5 transition-transform duration-300">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-2.5 h-2.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-[8.5px] font-bold text-foreground font-sans">Qualified Teachers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Ticker (Infinite Scrolling Marquee) */}
      <div className="bg-primary text-primary-foreground py-4 border-y border-primary/20 overflow-hidden relative select-none">
        <div className="flex w-max animate-marquee">
          {/* First set of badges */}
          <div className="flex items-center gap-10 md:gap-20 px-5 md:px-10 shrink-0">
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Female Teachers Only
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Full Privacy
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Live Online Classes
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Flexible Timings
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Beginner Friendly
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Small Interactive Batches
            </span>
          </div>
          {/* Second set of badges for looping */}
          <div className="flex items-center gap-10 md:gap-20 px-5 md:px-10 shrink-0">
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Female Teachers Only
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Full Privacy
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Live Online Classes
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Flexible Timings
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Beginner Friendly
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              Small Interactive Batches
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAIN */}
      <section className="py-12 sm:py-14 lg:py-16 bg-background">
        <div className="container px-4 max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Sticky Pane */}
            <motion.div
              className="w-full lg:w-[38%] lg:sticky lg:top-28 space-y-5 text-left"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase font-display">
                We get it
              </span>
              <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.15]">
                Learning Quran shouldn't feel impossible.
              </h2>
              <div className="h-[2px] w-12 bg-accent/60 rounded-full" />
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Traditional classes are often structured around rigid, outdated schedules and mixed-gender environments that make adult learners feel uncomfortable. We built a private, flexible, and interactive system designed specifically for sisters.
              </p>
            </motion.div>

            {/* Right Staggered Pane */}
            <motion.div
              className="w-full lg:w-[62%] space-y-6 pt-0 lg:pt-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: HeartCrack,
                  title: "Mixed-gender classes feel uncomfortable",
                  desc: "You hesitate to turn on your camera or ask questions.",
                  bgColor: "bg-rose-500/5",
                  borderColor: "border-rose-500/10",
                  iconColor: "text-rose-600"
                },
                {
                  icon: Clock,
                  title: "Local madrasas don't fit your schedule",
                  desc: "Between work, kids, and household — fixed timings just don't work.",
                  bgColor: "bg-amber-500/5",
                  borderColor: "border-amber-500/10",
                  iconColor: "text-amber-600"
                },
                {
                  icon: BookOpen,
                  title: "You can read Arabic but don't understand it",
                  desc: "Reading without meaning leaves you spiritually disconnected.",
                  bgColor: "bg-emerald-500/5",
                  borderColor: "border-emerald-500/10",
                  iconColor: "text-emerald-600"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                  whileHover={{ x: 4, transition: { type: "spring", stiffness: 300 } }}
                  className={`premium-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 border ${item.borderColor}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${item.bgColor} ${item.iconColor}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-serif font-bold text-foreground text-lg sm:text-xl leading-snug">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>


      {/* 3. HOW ENROLLMENT WORKS */}
      <section className="py-16 sm:py-20 lg:py-24 bg-card bg-arabesque-fade">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#ECC565] uppercase font-display mb-3">
              Steps
            </span>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-foreground">
              How Enrollment Works
            </h2>
            <div className="h-[2px] w-12 bg-accent/60 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="relative border-l border-accent/25 ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12">
            
            <motion.div
              className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent via-accent/30 to-accent/0"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {[
              {
                step: "01",
                icon: Search,
                title: "Choose Your Course",
                desc: "Browse Arabic & Urdu programs and select your preferred level and batch.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Connect With Our Team",
                desc: "Get guidance about timings, course structure, and learning path.",
              },
              {
                step: "03",
                icon: Video,
                title: "Attend a Trial Class",
                desc: "Experience the classroom environment before enrollment.",
              },
              {
                step: "04",
                icon: GraduationCap,
                title: "Begin Your Learning Journey",
                desc: "Start structured online learning with qualified female teachers.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group text-left"
              >
                {/* Node Dot / Circle Indicator */}
                <div className="absolute -left-[48px] sm:-left-[64px] top-0 w-8 h-8 rounded-full bg-background border-2 border-accent text-accent font-serif text-xs font-bold flex items-center justify-center shadow-sm group-hover:bg-accent group-hover:text-background group-hover:scale-110 transition-all duration-500 z-10 select-none">
                  {item.step}
                </div>

                <div className="premium-card p-6 sm:p-8 border border-accent/5 hover:border-accent/30 transition-custom relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-accent shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-8 py-5 font-sans font-medium transition-all duration-300 shadow-sm"
              asChild
            >
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* 4. COURSES */}
      <section className="py-10 sm:py-12 lg:py-14 bg-background relative overflow-hidden">

        <div className="container px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Programs
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                Pick what fits your level.
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary hover-elevate active-elevate-2"
              asChild
            >
              <Link href="/courses">View all courses →</Link>
            </Button>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {courses.slice(0, 3).map((course) => (
              <motion.div key={course.id} variants={fadeUp} transition={{ duration: 0.4 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. TRUST — Why us */}
      <section className="py-10 sm:py-12 lg:py-14 bg-primary text-primary-foreground relative overflow-hidden">

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest text-accent uppercase mb-3">
              Why us
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
              Built for sisters, by sisters.
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: ShieldCheck,
                title: "100% Privacy",
                desc: "Sisters-only classroom. Camera-on freely without a niqab.",
              },
              {
                icon: Clock,
                title: "Flexible Timings",
                desc: "Evening & weekend batches that work around your life.",
              },
              {
                icon: BookOpen,
                title: "Real Curriculum",
                desc: "Step-by-step from alphabet to fluency, with weekly checks.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 sm:p-9 text-center flex flex-col justify-start min-h-[290px] sm:min-h-[310px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-accent rounded-2xl flex items-center justify-center text-primary mb-5 shrink-0">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-1.5 text-white leading-snug">{feature.title}</h3>
                <p className="text-primary-foreground/80 text-sm sm:text-base font-sans leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>


        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-10 sm:py-12 lg:py-14 bg-background">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Real stories
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                Sisters who started where you are.
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
              asChild
            >
              <Link href="/testimonials">
                Read all stories →
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-full overflow-hidden"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.slice(0, 3).map((t) => (
              <motion.div 
                key={t.id} 
                variants={fadeUp} 
                transition={{ duration: 0.4 }}
                className="w-full min-w-0 max-w-full overflow-hidden"
              >
                <TestimonialCard testimonial={t as any} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. RTL Preview */}
      <section className="py-8 lg:py-10 border-t border-border bg-card">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif font-bold text-2xl md:text-3xl">
              Experience the beauty of the language.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-14 sm:py-16 lg:py-20 bg-primary text-center px-4 relative overflow-hidden">
        <motion.div
          className="container relative z-10 max-w-3xl mx-auto space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <Sparkles className="w-10 h-10 text-accent mx-auto" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="font-serif font-bold text-2xl sm:text-3xl md:text-5xl text-white leading-tight"
          >
            Your free trial is one click away.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-lg text-primary-foreground/85"
          >
            Try a real class with our teacher. No payment, no commitment — see if it's right for you.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </motion.div>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-sm text-primary-foreground/70 inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            We reply on WhatsApp within minutes.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
