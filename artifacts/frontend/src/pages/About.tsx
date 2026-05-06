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
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const { data: stats } = useGetSiteStats();

  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      {/* HERO with above-fold CTA */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            {t("about.hero.label", "Our Promise")}
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-6xl text-foreground leading-tight">
            {t("about.hero.title_part1", "A safe space for sisters")}
            <br />
            {t("about.hero.title_part2", "to fall in love with the Quran.")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("about.hero.subtitle", "No mixed classes. No judgment. Just qualified female teachers and a global community of sisters learning together — from your living room.")}
          </p>
          <div className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" trialMode />
          </div>
        </div>
      </section>

      {/* PAIN — Why we exist */}
      <section className="container mx-auto px-4 mt-16 mb-20 max-w-5xl">
        <div className="bg-card rounded-3xl border border-border p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <HeartCrack className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
              {t("about.pain.title", "We know how it feels.")}
            </h2>
            <p className="text-muted-foreground">
              {t("about.pain.subtitle", "Most sisters who join us were stuck in one of these places:")}
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              t("about.pain.item1", "You can recite the Quran but don't understand a word."),
              t("about.pain.item2", "Local madrasas have fixed timings that clash with work or family."),
              t("about.pain.item3", "Mixed-gender online classes feel uncomfortable and rushed."),
              t("about.pain.item4", "You started learning years ago, then life got in the way."),
            ].map((pain, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border"
              >
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="text-foreground/90 text-sm">{pain}</span>
              </li>
            ))}
          </ul>
          <p className="text-center text-foreground font-serif italic text-lg mt-8">
            {t("about.pain.footer", "Hareem Academy was built so none of that has to stop you anymore.")}
          </p>
        </div>
      </section>

      {/* TRANSFORMATION — What you get */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
            {t("about.transformation.title", "Here's what you walk away with.")}
          </h2>
          <p className="text-muted-foreground">
            {t("about.transformation.subtitle", "Not just lessons — a real change in how you connect with your deen.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: BookOpen,
              title: t("about.transformation.item1.title", "Read the Quran with understanding"),
              desc: t("about.transformation.item1.desc", "Move from sounding out words to understanding their meaning, in shaa Allah."),
            },
            {
              icon: Heart,
              title: t("about.transformation.item2.title", "Pray with khushu"),
              desc: t("about.transformation.item2.desc", "Know what you're saying in Salah and feel it deeply."),
            },
            {
              icon: Users,
              title: t("about.transformation.item3.title", "A circle of sisters"),
              desc: t("about.transformation.item3.desc", "Make friends with women who are on the same path."),
            },
            {
              icon: Award,
              title: t("about.transformation.item4.title", "Confidence to teach your children"),
              desc: t("about.transformation.item4.desc", "Pass on what you've learned to the next generation at home."),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <CTAGroup variant="hero" align="center" trialMode />
        </div>
      </section>

      {/* TRUST — Values */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
            {t("about.values.label", "What we stand for")}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
            {t("about.values.title", "Four promises — every class, every batch.")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: t("about.values.item1.title", "Privacy First"), desc: t("about.values.item1.desc", "100% sisters only.") },
            { icon: Heart, title: t("about.values.item2.title", "Modesty"), desc: t("about.values.item2.desc", "Islamic adab in every class.") },
            { icon: BookOpen, title: t("about.values.item3.title", "Quality"), desc: t("about.values.item3.desc", "Qualified, experienced female educators.") },
            { icon: Video, title: t("about.values.item4.title", "Flexibility"), desc: t("about.values.item4.desc", "Evening & weekend batches.") },
          ].map((val, i) => (
            <div
              key={i}
              className="text-center space-y-3 bg-card p-6 rounded-2xl border border-border"
            >
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg">{val.title}</h3>
              <p className="text-sm text-muted-foreground">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST — Stats */}
      <section className="container mx-auto px-4 mb-20 max-w-5xl">
        <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-14 text-center">
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-white mb-8">
            {t("about.stats.title", "A growing community of sisters worldwide.")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${stats?.totalStudents || 500}+`, label: t("about.stats.students", "Students taught") },
              { value: `${stats?.countriesReached || 12}+`, label: t("about.stats.countries", "Countries") },
              { value: `${stats?.activeBatches || 8}+`, label: t("about.stats.batches", "Active batches") },
              { value: `${(stats?.averageRating ?? 4.9).toFixed(1)}★`, label: t("about.stats.rating", "Average rating") },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-serif font-bold text-3xl md:text-5xl text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST — Teachers */}
      <section className="container mx-auto px-4 mb-16 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
            {t("about.teachers.label", "Your teachers")}
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-3">
            {t("about.teachers.title", "Sisters teaching sisters.")}
          </h2>
          <p className="text-muted-foreground">
            {t("about.teachers.subtitle", "Qualified, patient, and dedicated to your journey.")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Ustadha Fatima",
              role: "Head of Arabic",
              img: "/teacher-1.png",
              bio: "8+ years teaching Quranic Arabic to sisters worldwide.",
            },
            {
              name: "Ustadha Ayesha",
              role: "Senior Urdu Instructor",
              img: "/teacher-2.png",
              bio: "Specialist in Urdu literature and Islamic studies.",
            },
            {
              name: "Ustadha Zainab",
              role: "Arabic & Tajweed",
              img: "/teacher-3.png",
              bio: "Ijazah in Tajweed, focused on beginner sisters.",
            },
          ].map((teacher, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <img
                src={teacher.img}
                alt={teacher.name}
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-primary/10 mb-5"
              />
              <h3 className="font-serif font-bold text-xl text-foreground">{teacher.name}</h3>
              <p className="text-primary font-medium text-sm mt-1">{teacher.role}</p>
              <p className="text-sm text-muted-foreground mt-3">{teacher.bio}</p>
              <div className="flex items-center justify-center gap-1 mt-4 text-xs text-foreground/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                {t("about.teachers.verified", "Verified Female Teacher")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="bg-primary rounded-3xl p-10 md:p-14 text-center text-primary-foreground space-y-5">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
            {t("about.final.title", "Ready to take the first step?")}
          </h2>
          <p className="text-lg text-primary-foreground/85 max-w-xl mx-auto">
            {t("about.final.subtitle", "Book a free trial class. Meet your teacher. See for yourself if this is what you've been looking for.")}
          </p>
          <div className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
          <p className="text-sm text-primary-foreground/70 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            {t("home.final_cta.whatsapp", "We reply on WhatsApp within minutes.")}
          </p>
        </div>
      </section>
    </div>
  );
}
