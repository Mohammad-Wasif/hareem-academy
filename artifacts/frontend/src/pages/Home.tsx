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
} from "lucide-react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import CTAGroup from "@/components/CTAGroup";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { useListCourses, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";

import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { useSiteAssets } from "@/hooks/use-site-assets";

/* ── Reusable animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const { assets } = useSiteAssets();
  const lang = i18n.language;
  const { data: courses = [] } = useListCourses();
  const { data: testimonials = [] } = useListTestimonials();
  const { data: stats } = useGetSiteStats();



  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <SEO
        title={t("home.seo.title", "Online Quran Classes for Sisters")}
        description={t(
          "home.seo.description",
          "Live, female-only online Quran and Arabic classes. Learn Tajweed and meaning in a comfortable, judgment-free environment."
        )}
      />

      {/* 1. HERO */}
      <section className="relative bg-background overflow-hidden pt-2 pb-3 sm:pt-4 sm:pb-4 flex items-center min-h-[auto] sm:min-h-[60vh] lg:min-h-[65vh]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={assets["hero_bg"] || "/hero-bg.png"}
            alt=""
            className="w-full h-full object-cover opacity-[0.03]"
          />
          {/* Subtle radial glow and vertical cream gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(19,94,70,0.03),transparent_50%),radial-gradient(circle_at_25%_80%,rgba(212,163,89,0.015),transparent_50%)]" />
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
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
                <span>{t("home.hero.privacy", "Women-Only • Live Online Arabic & Urdu Classes")}</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-foreground leading-[1.15] sm:leading-[1.12] tracking-[-0.02em] sm:tracking-tight"
              >
                {t("home.hero.title_prefix", "Structured Arabic & Urdu")}{" "}
                <br className="hidden sm:inline" />
                <span className="text-primary relative inline-block">
                  {t("home.hero.title_highlight", "Learning for Sisters")}
                  <span className="absolute bottom-1 left-0 w-full h-[3px] bg-accent/40 rounded-full" />
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[0.8125rem] sm:text-base text-muted-foreground max-w-[92%] sm:max-w-xl leading-[1.6] sm:leading-relaxed font-sans"
              >
                {t(
                  "home.hero.subtitle",
                  "Live online Arabic and Urdu classes taught by qualified female teachers through structured, beginner-friendly lessons designed for sisters worldwide."
                )}
              </motion.p>

              <motion.div 
                variants={fadeUp} 
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col gap-2.5 sm:gap-3.5"
              >
                <CTAGroup variant="hero" trialMode />
                
                {/* Trust rating & Student Avatars directly under CTAs */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 border-2 border-background text-emerald-800 font-sans text-[9px] sm:text-[10px] font-bold flex items-center justify-center">A</div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 border-2 border-background text-amber-800 font-sans text-[9px] sm:text-[10px] font-bold flex items-center justify-center">S</div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-100 border-2 border-background text-rose-800 font-sans text-[9px] sm:text-[10px] font-bold flex items-center justify-center">M</div>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex gap-0.5 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-accent text-accent" />
                      ))}
                      <span className="text-[10px] sm:text-[11px] font-bold text-foreground ml-1">4.9/5</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">{t("home.hero.trust_note", "Loved by 500+ sisters worldwide")}</span>
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
                    {stats?.totalStudents || "480"}+
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    {t("home.hero.stats.students", "Sisters Learning")}
                  </p>
                </div>
                <div className="text-center sm:text-left border-r border-primary/10 last:border-r-0 px-1 sm:px-4">
                  <p className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-foreground tracking-tight">
                    {stats?.countriesReached || "12"}+
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    {t("home.hero.stats.countries", "Countries Reached")}
                  </p>
                </div>
                <div className="text-center sm:text-left pl-1 sm:pl-4">
                  <p className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-foreground tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{t("home.hero.stats.live_label", "Live")}</span>
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 font-sans font-medium leading-tight">
                    {t("home.hero.stats.classes", "Interactive Classes")}
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
                  <img
                    src="/premium-hero-showcase.png"
                    alt={t("home.hero.showcase_alt", "Online learning showcase")}
                    className="w-full max-w-full h-auto rounded-lg object-cover"
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
                  <img
                    src="/premium-hero-showcase.png"
                    alt={t("home.hero.showcase_alt", "Online learning showcase")}
                    className="w-full max-w-full h-auto rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
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
              {t("home.trust.teachers", "Female Teachers Only")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.privacy", "Full Privacy")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.live_classes", "Live Online Classes")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.flexible_timings", "Flexible Timings")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.beginner_friendly", "Beginner Friendly")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.small_batches", "Small Interactive Batches")}
            </span>
          </div>
          {/* Second set of badges for looping */}
          <div className="flex items-center gap-10 md:gap-20 px-5 md:px-10 shrink-0">
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.teachers", "Female Teachers Only")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.privacy", "Full Privacy")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.live_classes", "Live Online Classes")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.flexible_timings", "Flexible Timings")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.beginner_friendly", "Beginner Friendly")}
            </span>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium font-sans">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
              {t("home.trust.small_batches", "Small Interactive Batches")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PAIN */}
      <section className="py-14 sm:py-16 lg:py-20 bg-background">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
              {t("home.pain.label", "We get it")}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
              {t("home.pain.title", "Learning Quran shouldn't feel impossible.")}
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
                icon: HeartCrack,
                title: t("home.pain.item1.title", "Mixed-gender classes feel uncomfortable"),
                desc: t("home.pain.item1.desc", "You hesitate to turn on your camera or ask questions."),
              },
              {
                icon: Clock,
                title: t("home.pain.item2.title", "Local madrasas don't fit your schedule"),
                desc: t("home.pain.item2.desc", "Between work, kids, and household — fixed timings just don't work."),
              },
              {
                icon: BookOpen,
                title: t("home.pain.item3.title", "You can read Arabic but don't understand it"),
                desc: t("home.pain.item3.desc", "Reading without meaning leaves you spiritually disconnected."),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                className="bg-card border border-border rounded-2xl p-8 sm:p-9 text-center flex flex-col justify-start min-h-[290px] sm:min-h-[310px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-rose-100/60 text-rose-600 rounded-full flex items-center justify-center mb-5 shrink-0">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-serif font-bold text-foreground text-lg sm:text-xl mb-1.5 leading-snug">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. TRANSFORMATION */}
      <section className="py-14 sm:py-16 lg:py-20 bg-card">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
              {t("home.transformation.label", "Imagine")}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
              {t("home.transformation.title", "Six months from now, in shaa Allah…")}
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              t("home.transformation.item1", "Reading the Quran with proper Tajweed, not just pronunciation"),
              t("home.transformation.item2", "Understanding what you're reciting in Salah"),
              t("home.transformation.item3", "Teaching basic Arabic to your children at home"),
              t("home.transformation.item4", "A community of sisters from 12+ countries by your side"),
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 bg-background p-5 rounded-xl border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-10">
            <CTAGroup variant="hero" align="center" trialMode />
          </div>
        </div>
      </section>

      {/* 4. COURSES */}
      <section className="py-14 sm:py-16 lg:py-20 bg-background relative overflow-hidden">

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
                {t("home.programs.label", "Programs")}
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                {t("home.programs.title", "Pick what fits your level.")}
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary hover-elevate active-elevate-2"
              asChild
            >
              <Link href="/courses">{t("home.programs.view_all", "View all courses →")}</Link>
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
      <section className="py-14 sm:py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">

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
              {t("home.why_us.label", "Why us")}
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
              {t("home.why_us.title", "Built for sisters, by sisters.")}
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
                title: t("home.why_us.item1.title", "100% Privacy"),
                desc: t("home.why_us.item1.desc", "Sisters-only classroom. Camera-on freely without a niqab."),
              },
              {
                icon: Clock,
                title: t("home.why_us.item2.title", "Flexible Timings"),
                desc: t("home.why_us.item2.desc", "Evening & weekend batches that work around your life."),
              },
              {
                icon: BookOpen,
                title: t("home.why_us.item3.title", "Real Curriculum"),
                desc: t("home.why_us.item3.desc", "Step-by-step from alphabet to fluency, with weekly checks."),
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

          <div className="flex justify-center mt-10">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-14 sm:py-16 lg:py-20 bg-background">
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
                {t("home.testimonials.label", "Real stories")}
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                {t("home.testimonials.title", "Sisters who started where you are.")}
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
              asChild
            >
              <Link href="/testimonials">
                {t("home.testimonials.view_all", "Read all stories →")}
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
      <section className="py-10 lg:py-16 border-t border-border bg-card">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif font-bold text-2xl md:text-3xl mb-6">
              {t("home.rtl_preview.title", "Experience the beauty of the language.")}
            </h2>
            <div className="bg-background p-5 sm:p-8 rounded-2xl border border-primary/10 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {t("home.rtl_preview.label", "Arabic Script")}
              </div>
              <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-relaxed text-foreground" dir="rtl">
                {t("home.rtl_preview.bismillah", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {t("home.rtl_preview.translation", "In the name of Allah, the Entirely Merciful, the Especially Merciful.")}
              </p>
            </div>
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
            {t("home.final_cta.title", "Your free trial is one click away.")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-lg text-primary-foreground/85"
          >
            {t(
              "home.final_cta.subtitle",
              "Try a real class with our teacher. No payment, no commitment — see if it's right for you."
            )}
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
            {t("home.final_cta.whatsapp", "We reply on WhatsApp within minutes.")}
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
