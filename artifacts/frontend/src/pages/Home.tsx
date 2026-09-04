import { useState, useEffect, Suspense, lazy } from "react";
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

const EnrollmentModal = lazy(() => import("@/components/EnrollmentModal"));

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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hareem Academy",
    "url": "https://hareemacademy.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hareemacademy.com/courses?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hareem Academy",
    "image": assets["hero_showcase"] || "https://hareemacademy.com/premium-hero-showcase.png",
    "telephone": "+91-9315118289",
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
          "text": "Hareem Academy is exclusively for girls and women — sisters only. We welcome learners from different ages and backgrounds, whether you're starting from the basics or looking to strengthen your existing skills."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need any prior knowledge of Arabic or Urdu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Urdu course is beginner-friendly and starts from the basics. For Arabic courses, students should be comfortable reading basic Urdu, as lessons and explanations are supported in Urdu to make learning Arabic easier and more effective."
        }
      },
      {
        "@type": "Question",
        "name": "Are the courses available for Indian sisters living abroad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Hareem Academy is designed to serve sisters in India as well as Indian families living abroad. Join our live online classes from the UAE, UK, or wherever you are, and learn comfortably with teachers familiar with the language and cultural background of Indian students."
        }
      },
      {
        "@type": "Question",
        "name": "How are the classes conducted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Classes are held live online through Google Meet. You can interact with your teacher in real time, ask questions, practice during the lesson, and receive guidance throughout the class."
        }
      },
      {
        "@type": "Question",
        "name": "What are the class timings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each course has its own schedule. For example, Arabic Foundations currently runs Monday to Friday from 8:00 PM to 9:00 PM IST. Please check the individual course page for the latest timings and batch availability."
        }
      },
      {
        "@type": "Question",
        "name": "What if I miss a class?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We understand that sometimes you may not be able to attend a class. If you miss a lesson, you can connect with your teacher or our team to understand what was covered and stay on track with the course."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free trial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every course offers a free trial class, allowing you to experience the teaching style and classroom environment before enrolling. Simply click 'Book Your Free Trial' on the relevant course page to get started."
        }
      },
      {
        "@type": "Question",
        "name": "How much do the courses cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fees vary depending on the course and level. You can find the latest pricing and course details on each individual course page."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enroll?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose the course you're interested in and click 'Book Your Free Trial' or 'Enroll Now.' Submit your details, and our team will contact you on WhatsApp to guide you through the next steps and confirm your place."
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
        title={homeConfig?.title || "Online Quran & Arabic Classes for Sisters"}
        description={homeConfig?.metaDescription || "Live, female-only online Quran and Arabic classes. Learn Tajweed and meaning in a comfortable, judgment-free environment."}
        keywords={[
          "learn arabic online",
          "arabic classes for sisters",
          "online quran classes for sisters",
          "learn urdu online",
          "female arabic teachers",
          "online tajweed classes",
          "urdu course for beginners",
          "quran reading classes for sisters",
          "hareem academy"
        ]}
        schema={[organizationSchema, localBusinessSchema, websiteSchema, faqSchema]}
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
              {/* Eyebrow */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#00450d]/5 border border-[#00450d]/15 text-[#00450d] font-sans font-bold text-[10px] sm:text-xs tracking-wider uppercase max-w-full"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#735c00] shrink-0" />
                <span className="truncate sm:whitespace-normal">LIVE ONLINE CLASSES • EXCLUSIVELY FOR SISTERS</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-[#00450d] leading-[1.15] tracking-tight">
                {splitWords("Learn Arabic & Urdu with Confidence.")}
              </h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm sm:text-base text-[#41493e] max-w-xl leading-relaxed font-sans"
              >
                Structured, live online classes taught by qualified female teachers — designed exclusively for sisters, from complete beginners to intermediate learners.
              </motion.p>

              {/* Action Buttons: [Book Your Free Trial] & [Explore Courses] */}
              <motion.div 
                variants={fadeUp} 
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col gap-3.5"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-1">
                  <Suspense
                    fallback={
                      <Button className="h-11 px-6 rounded-full bg-[#00450d] text-white hover:bg-[#00350d] font-sans font-bold text-sm shadow-md cursor-pointer justify-center">
                        Book Your Free Trial
                      </Button>
                    }
                  >
                    <EnrollmentModal mode="trial">
                      <Button className="h-11 px-6 rounded-full bg-[#00450d] text-white hover:bg-[#00350d] font-sans font-bold text-sm shadow-md cursor-pointer justify-center w-full sm:w-auto">
                        Book Your Free Trial
                      </Button>
                    </EnrollmentModal>
                  </Suspense>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 px-6 rounded-full border-2 border-[#00450d] text-[#00450d] hover:bg-[#00450d] hover:text-white font-sans font-bold text-sm transition-all cursor-pointer justify-center"
                  >
                    <Link href="/courses">
                      Explore Courses
                    </Link>
                  </Button>
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
      <div className="bg-primary text-primary-foreground py-3.5 sm:py-4 border-y border-primary/20 overflow-hidden relative select-none [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
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

      {/* 2. INTRODUCTION */}
      <section className="pt-12 sm:pt-14 lg:pt-16 pb-8 sm:pb-10 lg:pb-12 bg-background border-t border-gray-100">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-5"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#00450d] uppercase bg-[#00450d]/5 px-3.5 py-1 rounded-full border border-[#00450d]/10 font-sans">
              INTRODUCTION
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#00450d] leading-[1.25] max-w-4xl mx-auto">
              <span className="block sm:whitespace-nowrap">Learning should feel</span>
              <span className="block sm:whitespace-nowrap">comfortable, structured, and achievable.</span>
            </h2>
            <div className="h-[2px] w-12 bg-[#735c00] mx-auto rounded-full" />
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#00450d]/15 shadow-[0_4px_20px_-4px_rgba(0,53,39,0.06)] text-left space-y-4 max-w-3xl mx-auto">
              <p className="text-sm sm:text-base text-[#41493e] font-sans leading-relaxed">
                Learning a new language can feel overwhelming when you don't know where to begin. Hareem Academy provides a clear learning path, supportive female teachers, and a comfortable sisters-only environment where you can learn, ask questions, and grow with confidence.
              </p>
              <p className="font-semibold text-sm sm:text-base text-[#00450d] font-sans leading-relaxed pt-2 border-t border-gray-100 text-center">
                Whether you're starting from the alphabet or strengthening your existing Arabic skills, we'll help you take the next step.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IS IT FOR? */}
      <section className="pt-10 sm:pt-12 lg:pt-14 pb-14 sm:pb-16 lg:pb-20 bg-[#003527] text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffe088] opacity-5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#86d881] opacity-5 rounded-full blur-3xl pointer-events-none" />

        <div className="container px-4 max-w-6xl mx-auto relative z-10 space-y-12">
          <motion.div
            className="text-center max-w-2xl mx-auto space-y-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#ffe088] uppercase bg-white/10 px-3.5 py-1 rounded-full border border-white/20 font-sans">
              WHO IS IT FOR?
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white">
              Start where you are.
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              You don't need to be an expert to begin. Our courses are designed for sisters at different stages of their learning journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                emoji: "🌱",
                title: "Complete Beginners",
                desc: "Never studied Arabic or Urdu before? Start from the basics with step-by-step lessons and patient guidance.",
              },
              {
                emoji: "📖",
                title: "Arabic Readers",
                desc: "Can read Arabic but want to understand it better? Build your vocabulary, grammar, comprehension, and confidence.",
              },
              {
                emoji: "✍️",
                title: "Urdu Learners",
                desc: "Want to read and write Urdu properly? Develop your Urdu skills through structured lessons and regular practice.",
              },
              {
                emoji: "🌍",
                title: "Sisters Worldwide",
                desc: "Join live online classes from wherever you are and learn alongside sisters in a comfortable environment.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gradient-to-t from-white/20 via-white/[0.07] to-white/[0.01] border border-white/15 rounded-2xl p-6 sm:p-7 text-center items-center flex flex-col space-y-4 hover:from-white/25 hover:border-white/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="text-3xl p-2.5 rounded-xl bg-white/10 border border-white/20 w-fit mx-auto shadow-sm">
                  {item.emoji}
                </div>
                <div className="space-y-2 text-center w-full">
                  <h3 className="font-serif font-bold text-xl text-[#ffe088] leading-snug text-center">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed text-center">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* 3. HOW IT WORKS - Horizontal Scroll Showcase */}
      <section className="py-16 sm:py-20 lg:py-24 bg-card relative overflow-hidden border-y border-gray-200/80">
        <div className="container px-4 max-w-6xl mx-auto space-y-10">
          <motion.div
            className="text-center max-w-2xl mx-auto space-y-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#00450d]">
              How It Works?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              Your journey starts with a simple step.
            </p>
          </motion.div>

          {/* Horizontal Scroll Card Track */}
          <div className="relative group">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-2 -mx-2">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Choose Your Course",
                  desc: "Browse Arabic & Urdu programs and select your preferred level and batch.",
                  color: "bg-[#00450d] text-[#ffe088]",
                },
                {
                  step: "02",
                  icon: MessageSquare,
                  title: "Connect With Our Team",
                  desc: "Get personal guidance about timings, course structure, and your customized learning path.",
                  color: "bg-[#00450d] text-[#ffe088]",
                },
                {
                  step: "03",
                  icon: Video,
                  title: "Attend a Trial Class",
                  desc: "Experience the live classroom environment with certified female teachers before commitment.",
                  color: "bg-[#00450d] text-[#ffe088]",
                },
                {
                  step: "04",
                  icon: GraduationCap,
                  title: "Begin Your Journey",
                  desc: "Start your structured online learning and achieve fluency with ongoing support.",
                  color: "bg-[#00450d] text-[#ffe088]",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="snap-center shrink-0 w-[290px] sm:w-[340px] bg-white rounded-2xl p-7 border border-gray-200/80 shadow-[0_8px_24px_-5px_rgba(0,53,39,0.08)] flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300 relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold ${item.color} shadow-sm`}>
                        {item.step}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[#00450d]/5 flex items-center justify-center text-[#00450d]">
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#191c1d]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm text-[#41493e] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 font-sans text-xs font-bold text-[#00450d]">
                    <span>Step {idx + 1} of 4</span>
                    <ArrowRight className="w-4 h-4 text-[#735c00]" />
                  </div>
                </motion.div>
              ))}
            </div>
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {courses.slice(0, 3).map((course) => (
              <motion.div key={course.id || course.slug} variants={fadeUp} transition={{ duration: 0.4 }} className="h-full">
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. WHY HAREEM ACADEMY */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#003527] text-white relative overflow-hidden">
        <div className="container px-4 max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#ffe088] uppercase bg-white/10 px-3.5 py-1 rounded-full border border-white/20 font-sans">
              WHY HAREEM ACADEMY
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white">
              Built around the needs of sisters.
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: ShieldCheck,
                title: "100% Sisters-Only Environment",
                desc: "Learn in a comfortable female-only classroom where you can participate freely.",
              },
              {
                icon: Award,
                title: "Qualified Female Teachers",
                desc: "Learn from dedicated teachers who provide patient, clear, and supportive instruction.",
              },
              {
                icon: BookOpen,
                title: "Structured Curriculum",
                desc: "Follow a step-by-step learning path designed to make progress easier to understand and achieve.",
              },
              {
                icon: Video,
                title: "Live & Interactive Classes",
                desc: "Don't just watch recordings. Learn directly with your teacher and participate in every lesson.",
              },
              {
                icon: Clock,
                title: "Flexible Learning",
                desc: "Choose from available batches designed to fit around your daily responsibilities.",
              },
              {
                icon: GraduationCap,
                title: "Students Worldwide",
                desc: "Join Hareem Academy from anywhere and become part of a growing community of sisters who are learning together.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/15 rounded-2xl p-7 text-left flex flex-col space-y-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ffe088] flex items-center justify-center text-[#003527] shrink-0 shadow-md">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-xl text-white leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm font-sans leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#f7f9fb]">
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
              <span className="inline-block text-xs font-bold tracking-widest text-[#003527] uppercase mb-2">
                Real stories
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#003527]">
                Sisters who started where you are.
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-[#003527]/20 text-[#003527] hover:bg-[#003527]/5"
              asChild
            >
              <Link href="/testimonials">
                Read all stories →
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-full items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.slice(0, 3).map((t, idx) => (
              <motion.div 
                key={t.id} 
                variants={fadeUp} 
                transition={{ duration: 0.4 }}
                className="w-full min-w-0 max-w-full h-full"
              >
                <TestimonialCard testimonial={t as any} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#003527] text-center px-4 relative overflow-hidden">
        <motion.div
          className="container relative z-10 max-w-2xl mx-auto space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="font-serif font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-snug tracking-tight"
          >
            Your free trial is one click away.
          </motion.h2>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="flex justify-center pt-1">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </motion.div>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-xs sm:text-sm text-white/80 inline-flex items-center gap-1.5 font-sans"
          >
            <ArrowRight className="w-3.5 h-3.5 text-[#ffe088]" />
            We reply on WhatsApp within minutes.
          </motion.p>
        </motion.div>
      </section>

      {/* 8. Experience the beauty of the language (Directly before footer) */}
      <section className="py-8 lg:py-10 border-t border-border bg-card">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground">
              Experience the beauty of the language.
            </h2>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
