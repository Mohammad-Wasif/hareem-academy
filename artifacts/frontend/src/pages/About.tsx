import {
  ShieldCheck,
  Video,
  Heart,
  BookOpen,
  HeartCrack,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  Award,
} from "lucide-react";
import CTAGroup from "@/components/CTAGroup";
import { useGetSiteStats } from "@workspace/api-client-react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import PremiumImage from "@/components/PremiumImage";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

/* ── Reusable animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function About() {
  const { data: stats } = useGetSiteStats();
  const { assets } = useSiteAssets();

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
        "name": "About Us",
        "item": "https://hareemacademy.com/about"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <SEO
        title="About Us"
        description="Learn about Hareem Academy's mission to provide a private, comfortable, live online learning environment for sisters to study Arabic, Urdu, and Quran."
        schema={breadcrumbSchema}
      />
      {/* HERO with above-fold CTA */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-widest text-primary uppercase"
          >
            Our Promise
          </motion.span>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="font-serif font-bold text-4xl md:text-6xl text-foreground leading-tight"
          >
            A safe space for sisters
            <br />
            to fall in love with the Quran.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            No mixed classes. No judgment. Just qualified female teachers and a
            global community of sisters learning together — from your living room.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" trialMode />
          </motion.div>
        </motion.div>
      </section>

      {/* PAIN — Why we exist */}
      <section className="container mx-auto px-4 mt-16 mb-20 max-w-5xl">
        <motion.div
          className="bg-card rounded-3xl border border-border p-8 md:p-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="text-center max-w-2xl mx-auto mb-10">
            <HeartCrack className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
              We know how it feels.
            </h2>
            <p className="text-muted-foreground">
              Most sisters who join us were stuck in one of these places:
            </p>
          </motion.div>
          <motion.ul
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
          >
            {[
              "You can recite the Quran but don't understand a word.",
              "Local madrasas have fixed timings that clash with work or family.",
              "Mixed-gender online classes feel uncomfortable and rushed.",
              "You started learning years ago, then life got in the way.",
            ].map((pain, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border"
              >
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="text-foreground/90 text-sm">{pain}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-center text-foreground font-serif italic text-lg mt-8"
          >
            Hareem Academy was built so none of that has to stop you anymore.
          </motion.p>
        </motion.div>
      </section>

      {/* TRANSFORMATION — What you get */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
        >
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
            Here's what you walk away with.
          </h2>
          <p className="text-muted-foreground">
            Not just lessons — a real change in how you connect with your deen.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              icon: BookOpen,
              title: "Read the Quran with understanding",
              desc: "Move from sounding out words to understanding their meaning, in shaa Allah.",
            },
            {
              icon: Heart,
              title: "Pray with khushu",
              desc: "Know what you're saying in Salah and feel it deeply.",
            },
            {
              icon: Users,
              title: "A circle of sisters",
              desc: "Make friends with women who are  on the same path.",
            },
            {
              icon: Award,
              title: "Confidence to teach your children",
              desc: "Pass on what you've learned to the next generation at home.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          className="flex justify-center mt-10"
        >
          <CTAGroup variant="hero" align="center" trialMode />
        </motion.div>
      </section>

      {/* TRUST — Values */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
            What we stand for
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
            Four promises — every class, every batch.
          </h2>
        </motion.div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { icon: ShieldCheck, title: "Privacy First", desc: "100% sisters only." },
            { icon: Heart, title: "Modesty", desc: "Islamic adab in every class." },
            { icon: BookOpen, title: "Quality", desc: "Qualified, experienced female educators." },
            { icon: Video, title: "Flexibility", desc: "Evening & weekend batches." },
          ].map((val, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="text-center space-y-3 bg-card p-6 rounded-2xl border border-border"
            >
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">{val.title}</h3>
              <p className="text-sm text-muted-foreground">{val.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TRUST — Stats */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <motion.div
          className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-14 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        >
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-white mb-8">
            A growing community of sisters worldwide.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${stats?.totalStudents || 500}+`, label: "Students taught" },
              { value: `${stats?.countriesReached || 12}+`, label: "Countries" },
              { value: `${stats?.activeBatches || 8}+`, label: "Active batches" },
              { value: `${(stats?.averageRating ?? 4.9).toFixed(1)}★`, label: "Average rating" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-serif font-bold text-2xl sm:text-3xl md:text-5xl text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TRUST — Teachers */}
      <section className="container mx-auto px-4 mb-16 max-w-5xl">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
            Your teachers
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
            Sisters teaching sisters.
          </h2>
          <p className="text-muted-foreground">
            Qualified, patient, and dedicated to your journey.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              name: "Ustadha Fatima",
              role: "Head of Arabic",
              assetKey: "teacher_1",
              fallback: "/teacher-1.png",
              bio: "8+ years teaching Quranic Arabic to sisters worldwide.",
            },
            {
              name: "Ustadha Ayesha",
              role: "Senior Urdu Instructor",
              assetKey: "teacher_2",
              fallback: "/teacher-2.png",
              bio: "Specialist in Urdu literature and Islamic studies.",
            },
            {
              name: "Ustadha Zainab",
              role: "Arabic & Tajweed",
              assetKey: "teacher_3",
              fallback: "/teacher-3.png",
              bio: "Ijazah in Tajweed, focused on beginner sisters.",
            },
          ].map((teacher, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
              className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 hover:shadow-lg transition-colors cursor-default"
            >
              <div className="w-28 h-28 mx-auto mb-5">
                <PremiumImage
                  assetKey={teacher.assetKey}
                  fallback={teacher.fallback}
                  alt={teacher.name}
                  width={112}
                  roundedClass="rounded-full"
                  widthClass="w-full"
                  heightClass="h-full"
                  aspectRatio="aspect-square"
                  className="object-cover border-4 border-primary/10"
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">{teacher.name}</h3>
              <p className="text-primary font-medium text-sm mt-1">{teacher.role}</p>
              <p className="text-sm text-muted-foreground mt-3">{teacher.bio}</p>
              <div className="flex items-center justify-center gap-1 mt-4 text-xs text-foreground/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Verified Female Teacher
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="bg-primary rounded-3xl p-10 md:p-14 text-center text-primary-foreground space-y-5"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
            Ready to take the first step?
          </h2>
          <p className="text-lg text-primary-foreground/85 max-w-xl mx-auto">
            Book a free trial class. Meet your teacher. See for yourself if this is
            what you've been looking for.
          </p>
          <div className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
          <p className="text-sm text-primary-foreground/70 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            We reply on WhatsApp within minutes.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
