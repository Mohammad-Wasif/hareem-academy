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
import calligraphyYellowStatic from "@assets/Asset_1@4x_1777409230830.png";
import calligraphyGreenStatic from "@assets/Asset_8@4x_1777409251771.png";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { useSiteAssets } from "@/hooks/use-site-assets";

/* ── Reusable animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
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

  const calligraphyYellow = assets["calligraphy_yellow"] || calligraphyYellowStatic;
  const calligraphyGreen = assets["calligraphy_green"] || calligraphyGreenStatic;

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={t("home.seo.title", "Online Quran Classes for Sisters")}
        description={t(
          "home.seo.description",
          "Live, female-only online Quran and Arabic classes. Learn Tajweed and meaning in a comfortable, judgment-free environment."
        )}
      />

      {/* 1. HERO */}
      <section className="relative bg-background overflow-hidden min-h-[88vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={assets["hero_bg"] || "/hero-bg.png"}
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="container relative z-10 px-4 py-16 lg:py-24">
          <motion.div
            className="max-w-3xl space-y-7"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-sm tracking-wide"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              {t("home.hero.privacy", "100% Female-Only • Live on Zoom")}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight md:leading-[1.1]"
            >
              {t("home.hero.title_part1", "Read the Quran with ")}{" "}
              <span className="text-primary relative inline-block">
                {t("home.hero.title_part2", "meaning")}
                <img
                  src={calligraphyGreen}
                  alt=""
                  className="absolute -bottom-5 right-0 h-12 opacity-20 pointer-events-none"
                />
              </span>
              <br />
              {t("home.hero.title_part3", "— from your living room.")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              {t(
                "home.hero.subtitle",
                "Live Arabic & Urdu classes for sisters, taught by qualified female teachers. Flexible timings, no judgment, your camera on a safe space."
              )}
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <CTAGroup variant="hero" trialMode />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-6 border-t border-border/50"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">
                  {stats?.totalStudents || 500}+{" "}
                  {t("home.hero.sisters_learning", "sisters learning")}
                </p>
                <p className="text-muted-foreground">
                  {t("home.hero.across", "across")} {stats?.countriesReached || 12}+{" "}
                  {t("home.hero.countries", "countries")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <motion.div
        className="bg-primary text-primary-foreground py-5 border-y border-primary/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-12 text-sm"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { icon: ShieldCheck, label: t("home.trust.teachers", "Female teachers only") },
              { icon: Heart, label: t("home.trust.age", "No age limit") },
              { icon: Video, label: t("home.trust.zoom", "Live on Zoom") },
              { icon: Award, label: t("home.trust.trial", "Free trial class") },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="font-medium">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* 2. PAIN */}
      <section className="py-12 lg:py-20 bg-background">
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
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. TRANSFORMATION */}
      <section className="py-12 lg:py-20 bg-card">
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
      <section className="py-12 lg:py-20 bg-background relative overflow-hidden">
        <img
          src={calligraphyGreen}
          alt=""
          className="absolute top-0 right-0 h-64 opacity-[0.03] pointer-events-none"
        />
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
      <section className="py-12 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src={calligraphyYellow}
          alt=""
          className="absolute -left-20 bottom-0 h-96 opacity-10 pointer-events-none"
        />
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
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-7 text-center"
              >
                <div className="w-14 h-14 mx-auto bg-accent rounded-2xl flex items-center justify-center text-primary mb-5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-white">{feature.title}</h3>
                <p className="text-primary-foreground/80 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-10">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-12 lg:py-20 bg-background">
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
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.slice(0, 3).map((t) => (
              <motion.div key={t.id} variants={fadeUp} transition={{ duration: 0.4 }}>
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
            <div className="bg-background p-8 rounded-2xl border border-primary/10 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {t("home.rtl_preview.label", "Arabic Script")}
              </div>
              <p className="font-arabic text-3xl md:text-4xl leading-relaxed text-foreground" dir="rtl">
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
      <section className="py-12 lg:py-20 bg-primary text-center px-4 relative overflow-hidden">
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
