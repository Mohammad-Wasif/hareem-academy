import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Globe,
  GraduationCap,
  HeartHandshake,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Video,
  ArrowRight,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import EnrollmentModal from "@/components/EnrollmentModal";
import staticLogo from "@assets/IMG_20260507_171922.png";
import { useSiteAssets } from "@/hooks/use-site-assets";

export default function About() {
  const { assets } = useSiteAssets();
  const logoSrc = assets?.logo || staticLogo;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hareemacademy.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://hareemacademy.com/about",
      },
    ],
  };

  const whyChooseUsPoints = [
    {
      icon: ShieldCheck,
      title: "1. A Comfortable Learning Environment",
      desc: "Our classes are exclusively for girls and women, creating a focused and comfortable space where sisters can participate, interact, and learn with confidence.",
      tag: "Sisters Only",
    },
    {
      icon: GraduationCap,
      title: "2. Qualified Female Teachers",
      desc: "Our classes are taught by female teachers who guide students patiently and clearly, helping them understand concepts and improve through regular practice.",
      tag: "Patient Guidance",
    },
    {
      icon: Layers,
      title: "3. Structured Learning",
      desc: "Our courses follow a step-by-step approach, helping students build a strong foundation before progressing to more advanced concepts.",
      tag: "Step-by-Step",
    },
    {
      icon: Video,
      title: "4. Live & Interactive Classes",
      desc: "Learning happens in real time through live online classes, allowing students to ask questions, participate in lessons, and receive guidance directly from their teachers.",
      tag: "Real-Time Interaction",
    },
    {
      icon: Globe,
      title: "5. Designed for Indian Sisters & NRI Families",
      desc: "Hareem Academy serves sisters in India as well as Indian families living abroad, making it possible to continue learning from home regardless of location.",
      tag: "India & Global NRIs",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Academic Excellence",
      desc: "We believe in clear, structured teaching that helps students build genuine understanding rather than simply memorizing information.",
      accent: "bg-[#00450d] text-white",
    },
    {
      icon: Sparkles,
      title: "Cultural Connection",
      desc: "Arabic and Urdu carry rich linguistic, literary, and cultural traditions. We encourage students to develop a meaningful connection with the languages they are learning.",
      accent: "bg-[#735c00] text-white",
    },
    {
      icon: HeartHandshake,
      title: "Supportive Learning",
      desc: "Every student begins from a different place. We aim to create an encouraging environment where sisters can ask questions, make progress, and continue learning without hesitation.",
      accent: "bg-[#007165] text-white",
    },
    {
      icon: TrendingUp,
      title: "Consistency & Growth",
      desc: "Real progress takes time and regular effort. Our courses are designed to help students develop their skills gradually through consistent learning and practice.",
      accent: "bg-[#1b5e20] text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans">
      <SEO
        title="About Us | Hareem Academy"
        description="Hareem Academy is an online learning space created for girls and women who want to learn Arabic and Urdu in a comfortable, structured, and supportive environment."
        schema={breadcrumbSchema}
      />

      <style>{`
        .bg-pattern {
          background-image: radial-gradient(rgba(0, 53, 39, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <main className="flex-grow">
        {/* 1. HERO SECTION (Adjusted spacing with navbar) */}
        <section className="relative pt-6 pb-10 md:pt-10 md:pb-14 px-4 md:px-12 overflow-hidden border-b border-gray-200/60">
          <div className="absolute inset-0 bg-pattern opacity-60 pointer-events-none -z-10" />
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10">
                About Us
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#00450d] leading-tight">
                A Dedicated Space for Sisters to Learn
              </h1>
              <p className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#00450d] leading-relaxed bg-[#00450d]/5 p-3.5 sm:p-4 rounded-xl border-l-4 border-[#cca72f]">
                Hareem Academy is an online learning space created for girls and women who want to learn Arabic and Urdu in a comfortable, structured, and supportive environment.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#41493e] leading-relaxed">
                Through live online classes taught by qualified female teachers, we aim to make language learning accessible for sisters in India and for Indian families living abroad.
              </p>
              <div className="pt-1.5 flex flex-wrap gap-3">
                <EnrollmentModal mode="trial">
                  <button className="font-sans font-bold text-xs md:text-sm bg-[#00450d] text-white px-5 sm:px-6 py-3 rounded-xl hover:bg-[#00450d]/90 transition-all shadow-md shadow-[#00450d]/10 hover:-translate-y-0.5 cursor-pointer">
                    Book a Free Trial
                  </button>
                </EnrollmentModal>
                <Link href="/courses">
                  <button className="font-sans font-bold text-xs md:text-sm bg-white text-[#00450d] border border-[#00450d]/25 px-5 sm:px-6 py-3 rounded-xl hover:bg-[#00450d]/5 transition-all shadow-xs cursor-pointer">
                    Explore Courses
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative h-[280px] sm:h-[340px] md:h-[360px] w-full rounded-2xl overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,69,13,0.12)] border border-gray-200/80">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                  alt="Sisters learning together"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3.5 left-2 sm:-left-3.5 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#00450d]/10 flex items-center justify-center text-[#00450d]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-sans font-bold text-xs text-[#191c1d]">
                    100% Female-Only
                  </div>
                  <div className="font-sans text-[10px] sm:text-[11px] text-[#41493e]">
                    Safe, private live online classes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OUR STORY SECTION */}
        <section className="py-10 md:py-14 px-4 md:px-12 bg-[#f3f4f5]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <div className="h-[300px] md:h-[360px] w-full rounded-tl-[60px] md:rounded-tl-[80px] rounded-br-[60px] md:rounded-br-[80px] overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,69,13,0.1)] border border-gray-200/60">
                  <img
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
                    alt="Traditional learning and scholarship"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#cca72f]/20 rounded-full blur-2xl pointer-events-none" />
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-3.5">
                <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 font-sans">
                  Our Story
                </span>
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#00450d] leading-snug">
                  Learning Should Feel Comfortable, Structured, and Achievable
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-[#41493e] leading-relaxed">
                  <p>
                    Hareem Academy was created with a simple idea: <strong className="text-[#00450d] font-semibold">sisters deserve a learning environment where they can learn confidently, ask questions freely, and grow at their own pace.</strong>
                  </p>
                  <p>
                    For many students, finding a suitable learning space can be difficult — especially when they want qualified female teachers, live interaction, and a comfortable environment that respects their values.
                  </p>
                  <p>
                    We built Hareem Academy to bring these elements together through <strong className="text-[#00450d] font-semibold">live online education</strong>.
                  </p>
                  <p>
                    Our classes combine structured lessons, regular practice, teacher interaction, and a supportive atmosphere so that students can build their skills step by step.
                  </p>
                  <p className="pt-1 text-[#00450d] font-medium border-t border-gray-200/80">
                    Whether you are beginning from the basics or looking to strengthen your existing knowledge, our goal is to make learning a consistent and rewarding part of your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY HAREEM ACADEMY? SECTION */}
        <section className="py-10 md:py-14 px-4 md:px-12">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-8 md:mb-10 space-y-1.5">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10">
                Why Hareem Academy?
              </span>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#00450d]">
                Created With Sisters in Mind
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {whyChooseUsPoints.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white p-5 md:p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,53,39,0.04)] border border-gray-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                      index === 4 ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#00450d]/10 text-[#00450d] flex items-center justify-center shadow-xs">
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#735c00] bg-[#cca72f]/15 px-2 py-0.5 rounded-md">
                          {point.tag}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#00450d] mb-2">
                        {point.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#41493e] leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. OUR VALUES SECTION */}
        <section className="py-10 md:py-14 px-4 md:px-12 bg-[#f3f4f5]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-8 md:mb-10 space-y-1.5">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 font-sans">
                Our Values
              </span>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#00450d]">
                What We Believe In
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#41493e] max-w-xl mx-auto">
                The principles that guide the way we teach and support our students.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {values.map((val, index) => {
                const IconComp = val.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-5 md:p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,53,39,0.04)] border border-gray-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3.5 shadow-xs ${val.accent}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#00450d] mb-1.5">
                        {val.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#41493e] leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. OUR VISION SECTION */}
        <section className="py-10 md:py-14 px-4 md:px-12">
          <div className="max-w-[1080px] mx-auto">
            <div className="bg-[#00450d] text-white rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,69,13,0.18)]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#1b5e20] rounded-full blur-3xl opacity-35 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#cca72f] rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 lg:col-span-7 space-y-3.5">
                  <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#cca72f] bg-[#cca72f]/15 px-3 py-0.5 rounded-full border border-[#cca72f]/25">
                    Our Vision
                  </span>
                  <h2 className="font-serif font-bold text-2xl md:text-3xl text-white leading-snug">
                    Making Quality Learning Accessible to More Sisters
                  </h2>
                  <div className="space-y-3 text-xs md:text-sm text-[#d0e5d8] leading-relaxed pt-1">
                    <p>
                      We envision Hareem Academy as a trusted online learning space where sisters can access quality Arabic and Urdu education without compromising on comfort, privacy, or personal values.
                    </p>
                    <p>
                      As we grow, our aim is to continue improving our courses, supporting our teachers, and helping more sisters build meaningful language skills.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center gap-3">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-64 lg:h-64 aspect-square rounded-2xl sm:rounded-3xl bg-[#0B2216] border-2 border-[#cca72f]/40 p-2 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-[1.03] transition-transform duration-300 shrink-0">
                    <img
                      src={logoSrc}
                      alt="Hareem Academy"
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                  </div>
                  <span className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#ffe088] tracking-normal text-center select-none">
                    Hareem Academy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. START YOUR LEARNING JOURNEY (CLOSING CTA - Tightened with footer) */}
        <section className="px-4 md:px-12 max-w-[1280px] mx-auto text-center pt-2 pb-6 md:pb-10">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 flex flex-col items-center max-w-3xl mx-auto shadow-[0_8px_30px_rgba(0,53,39,0.05)]">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 mb-2">
              Start Your Learning Journey
            </span>
            <h2 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#00450d] mb-1.5">
              Ready to Take the First Step?
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#41493e] mb-1 leading-relaxed">
              Experience a Hareem Academy class before you enroll.
            </p>
            <p className="font-sans font-medium text-xs md:text-sm text-[#00450d] mb-5 max-w-md leading-relaxed">
              Book your free trial and discover a comfortable, structured way to learn Arabic or Urdu.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <EnrollmentModal mode="trial">
                <button className="inline-flex items-center gap-2 bg-[#00450d] text-white font-sans font-bold text-xs md:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-[#00450d]/90 transition-all shadow-md shadow-[#00450d]/10 hover:-translate-y-0.5 cursor-pointer">
                  <span>Book a Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </EnrollmentModal>
              <Link href="/courses">
                <button className="font-sans font-bold text-xs md:text-sm bg-white text-[#00450d] border border-[#00450d]/25 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-[#00450d]/5 transition-all shadow-xs cursor-pointer">
                  Explore Courses
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
