import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { useParams, Link } from "wouter";
import { useGetCourse, useListTestimonials } from "@workspace/api-client-react";
import { getGetCourseQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EnrollmentModal from "@/components/EnrollmentModal";
import CTAGroup from "@/components/CTAGroup";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import NotFound from "./not-found";
import {
  Clock,
  GraduationCap,
  Video,
  Users,
  CheckCircle2,
  Calendar,
  Flame,
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  BookOpen,
  Mic,
  Headphones,
  MessageSquare,
  Download,
  ChevronRight,
  Quote,
  Lock,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import TestimonialCard from "@/components/TestimonialCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const { whatsappUrl } = useWhatsApp();

  const { data: course, isLoading, isError } = useGetCourse(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetCourseQueryKey(slug),
    },
  });
  const { data: testimonials = [] } = useListTestimonials();

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-32 space-y-8 max-w-5xl">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );

  if (isError || !course) return <NotFound />;

  // Select fields
  const isUrdu =
    course.language?.toLowerCase() === "urdu" ||
    course.slug?.toLowerCase().includes("urdu");

  const isIntermediate =
    course.slug?.toLowerCase().includes("intermediate");

  const title = course.title;
  const summary = course.summary;
  const courseLevel = course.level;
  const timings = course.timings;

  const lowSeats =
    typeof course.seatsRemaining === "number" &&
    course.seatsRemaining > 0 &&
    course.seatsRemaining <= 8;

  // Course-related testimonials, fallback to all
  const courseTestimonials = testimonials
    .filter(
      (t) =>
        t.course && t.course.toLowerCase().includes(course.title.toLowerCase().split(" ")[0]!),
    )
    .slice(0, 3);
  const showTestimonials =
    courseTestimonials.length > 0 ? courseTestimonials : testimonials.slice(0, 3);

  // Generic transformations based on language
  const isArabic = course.language?.toLowerCase() === "arabic";
  const transformations = isArabic
    ? [
      { icon: Heart, text: "Pray Salah understanding every word" },
      { icon: Sparkles, text: "Read the Quran with Tajweed and meaning" },
      { icon: Award, text: "Build a daily Arabic study habit" },
      { icon: Users, text: "Join a global circle of sisters on the same path" },
    ]
    : [
      { icon: Heart, text: "Read Urdu fluently and confidently" },
      { icon: Sparkles, text: "Connect with Islamic literature and poetry" },
      { icon: Award, text: "Speak and write Urdu in everyday life" },
      { icon: Users, text: "Join a sisterhood that celebrates the language" },
    ];

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
        "name": "Courses",
        "item": "https://hareemacademy.com/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://hareemacademy.com/courses/${course.slug}`
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": summary,
    "provider": {
      "@type": "Organization",
      "name": "Hareem Academy",
      "sameAs": "https://hareemacademy.com"
    },
    "educationalLevel": course.level,
    "timeRequired": `P${course.durationMonths}M`,
    "offers": {
      "@type": "Offer",
      "price": (course as any).feeAmount || "0",
      "priceCurrency": (course as any).feeCurrency || "INR",
      "category": "Education",
      "availability": (course as any).enrollmentStatus === "closed" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "url": `https://hareemacademy.com/courses/${course.slug}`
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": course.timings,
      "instructor": {
        "@type": "Person",
        "name": "Qualified Female Educator",
        "jobTitle": "Islamic Instructor"
      }
    }
  };

  const courseKeywords = isArabic
    ? [
        course.title,
        "learn arabic online",
        "arabic classes for sisters",
        "female arabic tutor online",
        "quranic arabic classes",
        "tajweed for women",
        "hareem academy"
      ]
    : [
        course.title,
        "learn urdu online",
        "urdu reading classes for sisters",
        "urdu course for beginners",
        "female urdu teacher online",
        "urdu foundations",
        "hareem academy"
      ];

  const courseImage = `https://hareemacademy.com/${isUrdu ? "course-urdu.png" : "course-arabic.png"}`;

  if (isUrdu) {
    return (
      <UrduCourseDetailView
        course={course}
        testimonials={showTestimonials}
        whatsappUrl={whatsappUrl}
        breadcrumbSchema={breadcrumbSchema}
        courseSchema={courseSchema}
        courseKeywords={courseKeywords}
        courseImage={courseImage}
      />
    );
  }

  return (
    <ArabicCourseDetailView
      course={course}
      testimonials={showTestimonials}
      whatsappUrl={whatsappUrl}
      breadcrumbSchema={breadcrumbSchema}
      courseSchema={courseSchema}
      courseKeywords={courseKeywords}
      courseImage={courseImage}
    />
  );
}
function ArabicCourseDetailView({
  course,
  testimonials,
  whatsappUrl,
  breadcrumbSchema,
  courseSchema,
  courseKeywords,
  courseImage,
}: {
  course: any;
  testimonials: any[];
  whatsappUrl: string;
  breadcrumbSchema: any;
  courseSchema: any;
  courseKeywords: string[];
  courseImage: string;
}) {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const isIntermediate = course.slug?.toLowerCase().includes("intermediate");
  const feeMonthly = course.feeMonthly || (isIntermediate ? 1200 : 1000);
  const currency = course.currency === "INR" || !course.currency ? "₹" : course.currency;
  const timings = course.timings || (isIntermediate ? "Tue & Thu — 8:00 PM – 9:30 PM IST" : "Monday to Friday — 8:00 PM – 9:30 PM IST");

  const titlePrefix = isIntermediate ? "Quranic Arabic Intermediate" : "Basic Arabic Essentials";
  const titleSub = isIntermediate
    ? "Deepen Your Understanding of the Divine Words"
    : "Build Your Quranic & Everyday Arabic From the Basics";

  const heroDesc = isIntermediate
    ? "A transformative 6-month live Arabic program for sisters ready to go beyond basic reading into grammatical analysis (Nahw), morphology (Sarf), Quranic eloquence (Balagha), and direct translation."
    : "A comprehensive 6-month live Arabic program designed to take you from the fundamentals of the Arabic alphabet and Makharij to confident reading, vocabulary, grammar, and Quranic comprehension.";

  const arabicQuote = isIntermediate
    ? "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ"
    : "إِنَّا أَنْزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ";

  const pillars = isIntermediate
    ? [
        { icon: "📖", title: "Grammar Analysis (I'rab)", desc: "Deconstruct complex Quranic sentences, cases, and sentence architecture with clarity." },
        { icon: "✍️", title: "Morphology (Sarf)", desc: "Master root patterns, the ten derived verb scales, and nuanced semantic variations." },
        { icon: "🗣️", title: "Quranic Eloquence (Balagha)", desc: "Discover the rhetorical subtleties, metaphors, and literary marvels of the Divine text." },
        { icon: "📚", title: "Direct Translation", desc: "Translate verses independently and comprehend classical Tafsir without constant English reliance." },
      ]
    : [
        { icon: "📖", title: "Reading & Makharij", desc: "Master Arabic letter articulation, vowels (Harakaat), and fluent Quranic reading." },
        { icon: "✍️", title: "Writing & Script", desc: "Learn to write Arabic letters in all positions and compose accurate words and sentences." },
        { icon: "🗣️", title: "Vocabulary & Speaking", desc: "Build a rich foundation of 500+ high-frequency Quranic and everyday conversational words." },
        { icon: "📚", title: "Grammar & Meaning", desc: "Grasp essential Arabic sentence structures, nouns, verbs, and gender rules step by step." },
      ];

  const outcomes = isIntermediate
    ? [
        { icon: "menu_book", color: "text-[#003527]", title: "Grammatical Parsing (I'rab)", desc: "Analyze the grammatical role and inflection of every word in selected Surahs." },
        { icon: "psychology", color: "text-[#735c00]", title: "Morphological Mastery (Sarf)", desc: "Identify root letters and unlock the meanings of derived verb forms effortlessly." },
        { icon: "auto_stories", color: "text-[#006b5f]", title: "Quranic Eloquence (Balagha)", desc: "Appreciate rhetorical devices, emphasis, and subtle literary beauty in the Quran." },
        { icon: "translate", color: "text-[#006b5f]", title: "Independent Translation", desc: "Translate Quranic passages with direct comprehension of classical vocabulary." },
        { icon: "visibility", color: "text-[#735c00]", title: "Thematic Exegesis", desc: "Trace linguistic and spiritual motifs across different Surahs and themes." },
        { icon: "history_edu", color: "text-[#003527]", title: "Access Classical Tafsir", desc: "Engage with traditional commentaries and lexicons in their original Arabic." },
      ]
    : [
        { icon: "visibility", color: "text-[#006b5f]", title: "Read With Confidence", desc: "Recite the Quran with proper Makharij, correct Harakaat, and natural fluency." },
        { icon: "psychology", color: "text-[#735c00]", title: "Understand Your Salah", desc: "Experience deep presence in prayer knowing the exact meaning of Surahs and Adhkar." },
        { icon: "menu_book", color: "text-[#003527]", title: "Master Essential Grammar", desc: "Identify nouns, verbs, particles, gender, and plurality in Quranic sentences." },
        { icon: "forum", color: "text-[#006b5f]", title: "500+ Quranic Words", desc: "Recognize hundreds of the most frequently occurring words in the Holy Mushaf." },
        { icon: "edit_note", color: "text-[#735c00]", title: "Write in Arabic", desc: "Gain confidence in Arabic spelling, word connections, and written composition." },
        { icon: "history_edu", color: "text-[#003527]", title: "Connect Directly With Quran", desc: "Read directly from the Mushaf with profound linguistic appreciation and serenity." },
      ];

  const topics = isIntermediate
    ? [
        {
          icon: "account_tree",
          title: "Advanced Syntax (Nahw)",
          color: "text-[#003527]",
          bullets: [
            "Complete case endings (Marfu', Mansub, Majrur)",
            "Conditional sentences (Shart & Jawab)",
            "Relative clauses and conjunctive particles",
            "Irregular sentence structures in the Quran",
          ],
        },
        {
          icon: "draw",
          title: "Morphological Systems (Sarf)",
          color: "text-[#006b5f]",
          bullets: [
            "Root letters (Awzan) and derivation rules",
            "The 10 enhanced verb scales (Abwab)",
            "Active and passive participles (Ism Fa'il/Maf'ul)",
            "Verbal nouns (Masadir) and irregular roots",
          ],
        },
        {
          icon: "spellcheck",
          title: "Quranic Parsing Labs",
          color: "text-[#735c00]",
          bullets: [
            "Sentence diagramming of selected Surahs",
            "Tracing hidden pronouns and antecedents",
            "Identifying ellipsis (Hadhaf) in verses",
            "Syntactic subtleties in classical exegesis",
          ],
        },
        {
          icon: "record_voice_over",
          title: "Eloquence & Rhetoric (Balagha)",
          color: "text-[#064e3b]",
          bullets: [
            "Word order and emphasis (Taqdim & Ta'khir)",
            "Metaphors (Isti'arah) & similes (Tashbih)",
            "Divine brevity (I'jaz) vs elaboration",
            "Rhythmic cadence of Quranic rhyme",
          ],
        },
        {
          icon: "import_contacts",
          title: "Thematic Quranic Studies",
          color: "text-[#006b5f]",
          bullets: [
            "Linguistic motifs in Surah Maryam & Yusuf",
            "Legal verse linguistics vs narrative styles",
            "Classical Arabic synonyms and distinctions",
            "Contextual vocabulary extraction",
          ],
        },
        {
          icon: "auto_stories",
          title: "Exegesis & Translation",
          color: "text-[#735c00]",
          bullets: [
            "Using classical lexicons (Hans Wehr, Lisan al-Arab)",
            "Cross-referencing classical commentaries",
            "Live student translation seminars",
            "Capstone translation & annotation project",
          ],
        },
      ]
    : [
        {
          icon: "spellcheck",
          title: "Arabic Script & Phonetics",
          color: "text-[#003527]",
          bullets: [
            "Arabic alphabet and letter forms",
            "Makharij (articulation points of letters)",
            "Short and long vowels (Harakaat & Madd)",
            "Joining letters and word formation",
          ],
        },
        {
          icon: "draw",
          title: "Writing & Dictation",
          color: "text-[#006b5f]",
          bullets: [
            "Letter shapes (initial, medial, final, isolated)",
            "Sun and Moon letters (Al-Huruf Ash-Shamsiyyah)",
            "Word and simple sentence writing",
            "Guided dictation practice",
          ],
        },
        {
          icon: "account_tree",
          title: "Foundational Grammar",
          color: "text-[#735c00]",
          bullets: [
            "Nouns (Ism), verbs (Fi'l), and particles (Harf)",
            "Definite vs indefinite nouns",
            "Gender (masculine & feminine)",
            "Singular, dual, and plural forms",
          ],
        },
        {
          icon: "record_voice_over",
          title: "Quranic & Daily Vocabulary",
          color: "text-[#064e3b]",
          bullets: [
            "500+ high-frequency Quranic words",
            "Common daily expressions & greetings",
            "Essential family, home, and nature terms",
            "Everyday Adhkar and supplications",
          ],
        },
        {
          icon: "import_contacts",
          title: "Sentence Construction",
          color: "text-[#006b5f]",
          bullets: [
            "Nominal sentences (Mubtada' & Khabar)",
            "Possessive construction (Idafah)",
            "Demonstrative pronouns (Asma al-Isharah)",
            "Prepositions and their grammatical effects",
          ],
        },
        {
          icon: "auto_stories",
          title: "Quran & Salah Comprehension",
          color: "text-[#735c00]",
          bullets: [
            "Word-by-word meaning of Surah Al-Fatihah",
            "Comprehension of short Surahs in Juz Amma",
            "Understanding all Salah phrases and Duas",
            "Reading connected Quranic passages",
          ],
        },
      ];

  const roadMap = isIntermediate
    ? [
        { month: "Month 1", num: "01", title: "Advanced Verb Forms", desc: "The ten derived scales, their meanings, and morphological paradigms.", status: "Verbal Paradigms" },
        { month: "Month 2", num: "02", title: "Complex Sentences", desc: "Conditional statements, relative clauses, and subjunctive particles.", status: "Syntactic Mastery" },
        { month: "Month 3", num: "03", title: "Grammatical Analysis", desc: "Detailed parsing (I'rab) of selected Surahs with structural precision.", status: "Grammatical Parsing" },
        { month: "Month 4", num: "04", title: "Intro to Balagha", desc: "Metaphors, emphasis, and structural eloquence in the Quran.", status: "Rhetorical Eloquence" },
        { month: "Month 5", num: "05", title: "Thematic Study", desc: "Following linguistic themes and motifs through diverse Quranic Surahs.", status: "Thematic Exegesis" },
        { month: "Month 6", num: "06", title: "Independent Translation", desc: "Final capstone project translating and annotating selected verses directly.", status: "Scholarly Independence" },
      ]
    : [
        { month: "Month 1", num: "01", title: "The Foundations", desc: "Alphabet, vowels (Harakaat), Makharij, and basic pronunciation rules.", status: "Foundations Established" },
        { month: "Month 2", num: "02", title: "Building Blocks", desc: "Nouns, gender, plurality, demonstratives, and sentence structure.", status: "Literacy & Dictation" },
        { month: "Month 3", num: "03", title: "Action and Time", desc: "Introduction to basic past and present tense verbs and verbal sentences.", status: "Verbal Sentence Skills" },
        { month: "Month 4", num: "04", title: "Daily Conversation", desc: "Greetings, family terms, common vocabulary, and interactive dialogs.", status: "Conversational Confidence" },
        { month: "Month 5", num: "05", title: "Quranic Vocabulary", desc: "High-frequency words in Juz Amma and foundational Quranic Ayat.", status: "Quranic Vocabulary" },
        { month: "Month 6", num: "06", title: "Putting It Together", desc: "Reading short passages, understanding Salah, and direct verse comprehension.", status: "Comprehension Achieved" },
      ];

  const arabicFaqs = isIntermediate
    ? [
        { q: "What is the prerequisite for this intermediate course?", a: "Students should already be able to read the Mushaf fluently and have basic familiarity with elementary Arabic grammar concepts." },
        { q: "How long is the program?", a: "The intermediate program runs for 6 months." },
        { q: "Are the classes live?", a: "Yes. Classes are conducted live with interactive Q&A and guided exercises." },
        { q: "Are classes recorded?", a: "No. Classes are held live and interactive. To protect student privacy, recordings are not provided." },
        { q: "Who can join?", a: "The course is exclusively for girls and women in a comfortable, sisters-only environment." },
        { q: "Can I try a class before enrolling?", a: "Yes. Hareem Academy offers a free trial class so you can experience the teaching methodology." },
        { q: "What is the tuition fee?", a: `₹${feeMonthly} per month.` },
      ]
    : [
        { q: "Is this course suitable for complete beginners?", a: "Yes. We start from the absolute basics — the Arabic alphabet, pronunciation (Makharij), and simple words." },
        { q: "How long is the course?", a: "The program runs for 6 months." },
        { q: "Are the classes live?", a: "Yes. Classes are conducted live with our qualified female instructors." },
        { q: "Are classes recorded?", a: "No. Classes are live and interactive with female teachers; sessions are not recorded." },
        { q: "Who can join?", a: "The course is strictly for girls and women." },
        { q: "Can I try the course before enrolling?", a: "Yes. Hareem Academy offers a free trial class." },
        { q: "What is the tuition fee?", a: `₹${feeMonthly} per month.` },
      ];

  return (
    <div className="w-full bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      <SEO
        title={`${course.title} | Hareem Academy`}
        description={heroDesc}
        keywords={courseKeywords}
        imageUrl={courseImage}
        url={`https://hareemacademy.com/courses/${course.slug}`}
        schema={[breadcrumbSchema, courseSchema]}
      />

      {/* 1. Breadcrumbs */}
      <section className="w-full px-4 sm:px-6 md:px-16 pt-6 pb-2">
        <div className="max-w-[1280px] mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#404944] font-sans text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link className="hover:text-[#003527] transition-colors" href="/">Home</Link>
            <span className="material-symbols-outlined text-[14px] text-[#707974]">chevron_right</span>
            <Link className="hover:text-[#003527] transition-colors" href="/courses">Courses</Link>
            <span className="material-symbols-outlined text-[14px] text-[#707974]">chevron_right</span>
            <span className="text-[#003527] font-semibold truncate">{course.title}</span>
          </nav>
        </div>
      </section>

      {/* 2. HERO SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-6 md:py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#003527] tracking-tight leading-[1.2] font-bold break-words">
                  {titlePrefix}: <br className="hidden sm:inline" />
                  <span className="italic font-normal text-[#006b5f]">{titleSub}</span>
                </h1>
                <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944] max-w-2xl leading-relaxed">
                  {heroDesc}
                </p>
              </div>

              {/* Value Highlights Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">👩‍🏫</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Taught by Qualified Female Teachers</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">💻</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Live Online Classes</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">🌸</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Sisters Only</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">🎁</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Free Trial Available</span>
                </div>
              </div>

              {/* Action Buttons (Side by Side & Fully Responsive) */}
              <div className="flex items-center gap-2.5 sm:gap-3 pt-2 w-full max-w-lg" id="free-trial">
                <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                  <button className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-7 rounded-xl bg-[#003527] text-white font-sans font-semibold text-xs sm:text-sm md:text-base hover:bg-[#064e3b] transition-all shadow-[0_6px_20px_rgba(0,53,39,0.18)] cursor-pointer whitespace-nowrap text-center">
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1.5 sm:mr-2 text-[#ffe088]">calendar_month</span>
                    Book Your Free Trial
                  </button>
                </EnrollmentModal>
                <a
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-6 rounded-xl bg-[#f2f4f6] text-[#003527] hover:bg-[#eceef0] border border-[#e0e3e5] font-sans font-semibold text-xs sm:text-sm md:text-base transition-all cursor-pointer whitespace-nowrap text-center"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1.5 sm:mr-2 text-[#006b5f]">chat</span>
                  Speak With Our Team
                </a>
              </div>

              <p className="text-[11px] sm:text-xs text-[#707974] font-sans flex items-center gap-1.5 leading-snug">
                <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#006b5f] shrink-0">lock</span>
                Exclusively for sisters • Live interactive Google Meet sessions • No recording policy
              </p>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,53,39,0.12)] bg-white border border-[#e6e8ea]">
                <div className="relative h-[260px] sm:h-[320px] md:h-[340px] overflow-hidden">
                  <img
                    alt={`${course.title} Seminar`}
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1XpREDpNsG4dTQDX_yricoy5nTv-bjM5upRhBrWAL8qgQQXfxUA-NkFphCTbIutQ12bfLqprIX1-o-QlHHHA4SMXbz21HLz44fvqH4PDQ3-sJc8Pa1_8xqJ2OihJWZacRL25yvADX99PLda__v-VitLyNI7MQYV82QuRPUGJFv4tjLLgFZA0iWxGsWoaNT4YdTO6TShT3MYMQL3sL5bqMz7B6NUk8cBmS5DYpfz6Oz2HiBG0OHVjsXOzQ"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/course-arabic.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/85 via-[#003527]/30 to-transparent"></div>
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ffe088] text-[#241a00] backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1">
                    ⭐ Most Popular
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#003527] shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-pulse"></span>
                    Limited seats only
                  </div>
                  {/* Arabic Calligraphic Accent Box */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg">
                    <p className="font-serif text-[#003527] italic text-base sm:text-xl text-center font-medium" dir="rtl">
                      "{arabicQuote}"
                    </p>
                  </div>
                </div>
                <div className="p-2.5 sm:p-4 bg-[#f2f4f6] grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">
                      {isIntermediate ? "Tue & Thu" : "Mon – Fri"}
                    </span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Live Schedule</span>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">8–9:30 PM</span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Evening Cohort</span>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">100% Live</span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Google Meet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COURSE OVERVIEW / HIGHLIGHTS SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-10 sm:py-14 bg-white border-y border-[#e6e8ea]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Course Pillars</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-3 sm:mb-4">What This Course Offers</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944] leading-relaxed">
              A structured six-month journey designed to help sisters develop strong Arabic literacy, deep Quranic vocabulary, and lasting grammatical fluency step by step.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#f2f4f6] hover:bg-[#f7f9fb] transition-all border border-[#e6e8ea] hover:shadow-md group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064e3b] text-white flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px] mb-2">{pillar.title}</h3>
                <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU'LL BE ABLE TO DO (Outcomes) */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Tangible Milestones</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-2 sm:mb-3">What You'll Be Able to Do</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
              By the end of the program, in shaa Allah, you'll work toward:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`material-symbols-outlined text-[22px] sm:text-[24px] ${outcome.color}`}>{outcome.icon}</span>
                  <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">{outcome.title}</h3>
                </div>
                <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                  {outcome.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT YOU'LL LEARN (In-Depth Topics) */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f2f4f6]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">In-Depth Topics</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-3 sm:mb-4">What You'll Learn</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
              Rigorous pedagogical coverage across foundational phonetics, grammar, Quranic vocabulary, and literary eloquence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topics.map((topic, idx) => (
              <div key={idx} className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                  <span className={`material-symbols-outlined text-[24px] sm:text-[26px] ${topic.color}`}>{topic.icon}</span>
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">{topic.title}</h3>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                  {topic.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 sm:gap-2.5">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 6-MONTH CURRICULUM PROGRESSION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="curriculum">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Academic Road Map</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2">Your 6-Month Arabic Journey</h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-[#404944] bg-[#e6e8ea] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold self-start md:self-auto">
              Step-by-Step Cumulative Mastery
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {roadMap.map((step, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064e3b] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                      {step.num}
                    </span>
                    <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">{step.month}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">{step.title}</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check</span> {step.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COURSE DETAILS & LOGISTICS + 8. HOW CLASSES WORK */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-white border-y border-[#e6e8ea]" id="logistics">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Course Details & Logistics */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Schedule &amp; Format</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">Course Details</h2>
                <p className="text-xs sm:text-sm text-[#404944] font-sans">Clear logistics designed for your daily routine.</p>
              </div>
              {/* Metadata Table Card */}
              <div className="rounded-2xl bg-[#f2f4f6] border border-[#e6e8ea] overflow-hidden shadow-xs">
                <div className="divide-y divide-[#e6e8ea]">
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">timelapse</span>
                      Duration
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">6 Months</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">trending_up</span>
                      Level
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">{course.level || (isIntermediate ? "Intermediate" : "Beginner")}</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">laptop_chromebook</span>
                      Classes
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Live Online</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">calendar_today</span>
                      Schedule
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">{isIntermediate ? "Tuesday & Thursday" : "Monday to Friday"}</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">schedule</span>
                      Time
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">8:00–9:30 PM IST</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">video_call</span>
                      Platform
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Google Meet</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">groups</span>
                      Class Format
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Sisters Only</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 bg-[#064e3b]/10">
                    <span className="font-sans text-xs sm:text-sm text-[#003527] font-bold flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">payments</span>
                      Fee
                    </span>
                    <span className="font-bold text-[#003527] text-base sm:text-lg text-right">{currency}{feeMonthly} / month</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00]">card_giftcard</span>
                      Trial
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#006b5f] text-right">Free Trial Available</span>
                  </div>
                </div>
              </div>
              {/* Quick Enroll CTA from table */}
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="w-full py-3.5 rounded-xl bg-[#003527] text-white font-sans font-semibold text-xs sm:text-sm md:text-base text-center hover:bg-[#064e3b] transition-all shadow-md cursor-pointer">
                  Register for Upcoming Batch
                </button>
              </EnrollmentModal>
            </div>

            {/* Right Column: How Classes Work */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Pedagogy</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">How You'll Learn</h2>
                <p className="text-xs sm:text-sm text-[#404944] font-sans">A thoughtful, guided learning environment built around clarity and support.</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">💻</div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Live Online Classes</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Attend interactive classes live with real-time feedback from qualified instructors.
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">👩‍🏫</div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Learn With Female Teachers</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Classes are taught by qualified female scholars in a comfortable, sisters-only environment.
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">📝</div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Guided Practice</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Lessons include step-by-step breakdown, translation drills, and direct Quranic practice.
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">📅</div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Structured 6-Month Program</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Follow a cumulative academic roadmap designed to build your skills progressively.
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">🌍</div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Learn From Anywhere</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Join sisters learning from India, the Middle East, the UK, the US, and worldwide.
                    </p>
                  </div>
                </div>
                {/* Prominent Policy Note */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex items-start gap-3 text-[#191c1e]">
                  <span className="text-lg sm:text-xl shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-[#003527] text-xs sm:text-sm mb-1">Live Attendance Policy</h4>
                    <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
                      <strong>Note:</strong> Classes are live and are not recorded. If you miss a class, the session generally cannot be replayed or rescheduled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHO IS THIS COURSE FOR? */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="who-is-for">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-[#f2f4f6] border border-[#e6e8ea] p-6 sm:p-8 md:p-12 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Eligibility &amp; Suitability</span>
              <h2 className="font-serif text-2xl sm:text-3xl sm:text-4xl text-[#003527] font-bold mt-1 mb-2">Who Is This Course For?</h2>
              <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
                This course is ideal for sisters who:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">{isIntermediate ? "Can already read the Mushaf and want deeper comprehension" : "Are complete beginners or want to start Arabic from the basics"}</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">{isIntermediate ? "Want to master Nahw (Syntax) and Sarf (Morphology)" : "Want to learn Arabic letter Makharij and Tajweed foundations"}</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to experience deep presence in Salah understanding every verse</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">{isIntermediate ? "Want to unlock classical Arabic dictionaries and Tafsir" : "Want to build an extensive Quranic vocabulary from Juz Amma"}</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">{isIntermediate ? "Want to translate Quranic verses independently" : "Want to understand common Quranic sentence patterns"}</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Prefer studying with qualified female educators in a protected sisterhood</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs md:col-span-2">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to build a lifelong connection with the Divine language of the Quran</span>
              </div>
            </div>
            {/* Inline CTA Link */}
            <div className="mt-8 sm:mt-10 text-center">
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm md:text-base text-[#003527] hover:text-[#006b5f] font-semibold transition-colors px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] cursor-pointer">
                  Not sure if this course is right for you? Book a Free Trial →
                </button>
              </EnrollmentModal>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f2f4f6] border-t border-[#e6e8ea]" id="faqs">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Common Questions</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">Frequently Asked Questions</h2>
            <p className="font-sans text-xs sm:text-sm sm:text-base text-[#404944]">Everything you need to know about the {course.title}.</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {arabicFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="rounded-xl bg-white p-4 sm:p-6 shadow-xs border border-[#e6e8ea] cursor-pointer select-none transition-all hover:border-[#003527]/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] text-left">{faq.q}</h4>
                    <span className={`material-symbols-outlined text-[#707974] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#003527]" : ""}`}>
                      expand_more
                    </span>
                  </div>
                  {isOpen && (
                    <div className="mt-3 font-sans text-[#404944] text-xs sm:text-sm leading-relaxed border-t border-[#e6e8ea]/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="enroll-action">
        <div className="max-w-[1280px] mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-[#064e3b] text-white overflow-hidden relative p-6 sm:p-10 md:p-14 text-center max-w-4xl mx-auto shadow-xl">
            {/* Decorative Accent */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ffe088] text-[#241a00] mb-5 sm:mb-6 shadow-md">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#241a00]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-3 sm:mb-4">
              Ready to Start Your Arabic Journey?
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#95d3ba] leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
              Take your first step with a free trial class and experience how Hareem Academy teaches Arabic.
            </p>
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 w-full max-w-md mx-auto">
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-8 rounded-xl bg-[#ffe088] text-[#241a00] font-sans font-bold text-xs sm:text-sm md:text-base hover:bg-[#e9c349] transition-all shadow-md cursor-pointer whitespace-nowrap text-center">
                  Book Your Free Trial
                </button>
              </EnrollmentModal>
              <a
                className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-8 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-sans font-semibold text-xs sm:text-sm md:text-base transition-all cursor-pointer whitespace-nowrap text-center"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="speak-team"
              >
                Speak With Our Team
              </a>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#95d3ba] tracking-wide">
              {currency}{feeMonthly} / month • 6 months • Live online • Sisters only
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function UrduCourseDetailView({
  course,
  testimonials,
  whatsappUrl,
  breadcrumbSchema,
  courseSchema,
  courseKeywords,
  courseImage,
}: {
  course: any;
  testimonials: any[];
  whatsappUrl: string;
  breadcrumbSchema: any;
  courseSchema: any;
  courseKeywords: string[];
  courseImage: string;
}) {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const urduFaqs = [
    {
      q: "Is this course suitable for complete beginners?",
      a: "Yes. The program starts with the foundations and progressively develops skills toward advanced-level Urdu.",
    },
    {
      q: "How long is the course?",
      a: "The program runs for 6 months.",
    },
    {
      q: "Are the classes live?",
      a: "Yes. Classes are conducted live through Google Meet.",
    },
    {
      q: "Are classes recorded?",
      a: "No. Classes are not recorded, so missed sessions generally cannot be replayed or rescheduled.",
    },
    {
      q: "Who can join?",
      a: "The course is exclusively for girls and women.",
    },
    {
      q: "Can I try the course before enrolling?",
      a: "Yes. Hareem Academy offers a free trial class.",
    },
    {
      q: "What is the fee?",
      a: "₹550 per month.",
    },
  ];

  return (
    <div className="w-full bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      <SEO
        title="Urdu Essentials: Build Your Urdu From the Basics to Advanced Level | Hareem Academy"
        description="A comprehensive 6-month live Urdu program designed to take you from the fundamentals to advanced-level skills in reading, writing, pronunciation, vocabulary, grammar, comprehension, and practical Urdu."
        keywords={courseKeywords}
        imageUrl={courseImage}
        url={`https://hareemacademy.com/courses/${course.slug}`}
        schema={[breadcrumbSchema, courseSchema]}
      />

      {/* 1. Breadcrumbs */}
      <section className="w-full px-4 sm:px-6 md:px-16 pt-6 pb-2">
        <div className="max-w-[1280px] mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#404944] font-sans text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link className="hover:text-[#003527] transition-colors" href="/">Home</Link>
            <span className="material-symbols-outlined text-[14px] text-[#707974]">chevron_right</span>
            <Link className="hover:text-[#003527] transition-colors" href="/courses">Courses</Link>
            <span className="material-symbols-outlined text-[14px] text-[#707974]">chevron_right</span>
            <span className="text-[#003527] font-semibold truncate">Urdu Essentials: Basics to Advanced</span>
          </nav>
        </div>
      </section>

      {/* 2. HERO SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-6 md:py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Title & Description */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#003527] tracking-tight leading-[1.2] font-bold break-words">
                  Urdu Essentials: <br className="hidden sm:inline" />
                  <span className="italic font-normal text-[#006b5f]">Build Your Urdu From the Basics to Advanced Level</span>
                </h1>
                <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944] max-w-2xl leading-relaxed">
                  A comprehensive 6-month live Urdu program designed to take you from the fundamentals to advanced-level skills in reading, writing, pronunciation, vocabulary, grammar, comprehension, and practical Urdu.
                </p>
              </div>

              {/* Value Highlights Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">👩‍🏫</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Taught by Qualified Female Teachers</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">💻</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Live Online Classes</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">🌸</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Sisters Only</span>
                </div>
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                  <span className="text-lg sm:text-xl shrink-0">🎁</span>
                  <span className="font-sans text-[11px] sm:text-xs font-medium text-[#191c1e] leading-snug">Free Trial Available</span>
                </div>
              </div>

              {/* Action Buttons (Side by Side & Fully Responsive) */}
              <div className="flex items-center gap-2.5 sm:gap-3 pt-2 w-full max-w-lg" id="free-trial">
                <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                  <button className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-7 rounded-xl bg-[#003527] text-white font-sans font-semibold text-xs sm:text-sm md:text-base hover:bg-[#064e3b] transition-all shadow-[0_6px_20px_rgba(0,53,39,0.18)] cursor-pointer whitespace-nowrap text-center">
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1.5 sm:mr-2 text-[#ffe088]">calendar_month</span>
                    Book Your Free Trial
                  </button>
                </EnrollmentModal>
                <a
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-6 rounded-xl bg-[#f2f4f6] text-[#003527] hover:bg-[#eceef0] border border-[#e0e3e5] font-sans font-semibold text-xs sm:text-sm md:text-base transition-all cursor-pointer whitespace-nowrap text-center"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1.5 sm:mr-2 text-[#006b5f]">chat</span>
                  Speak With Our Team
                </a>
              </div>

              <p className="text-[11px] sm:text-xs text-[#707974] font-sans flex items-center gap-1.5 leading-snug">
                <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#006b5f] shrink-0">lock</span>
                Exclusively for sisters • Live interactive Google Meet sessions • No recording policy
              </p>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,53,39,0.12)] bg-white border border-[#e6e8ea]">
                <div className="relative h-[260px] sm:h-[320px] md:h-[340px] overflow-hidden">
                  <img
                    alt="Urdu learning seminar with elegant Nastaliq calligraphy and notebook"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1XpREDpNsG4dTQDX_yricoy5nTv-bjM5upRhBrWAL8qgQQXfxUA-NkFphCTbIutQ12bfLqprIX1-o-QlHHHA4SMXbz21HLz44fvqH4PDQ3-sJc8Pa1_8xqJ2OihJWZacRL25yvADX99PLda__v-VitLyNI7MQYV82QuRPUGJFv4tjLLgFZA0iWxGsWoaNT4YdTO6TShT3MYMQL3sL5bqMz7B6NUk8cBmS5DYpfz6Oz2HiBG0OHVjsXOzQ"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/course-urdu.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/85 via-[#003527]/30 to-transparent"></div>
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ffe088] text-[#241a00] backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1">
                    ⭐ Most Popular
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#003527] shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-pulse"></span>
                    Limited seats only
                  </div>
                  {/* Nastaliq Calligraphic Accent Box */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg">
                    <p className="font-serif text-[#003527] italic text-base sm:text-xl text-center font-medium" dir="rtl">
                      "اردو ہے جس کا نام ہمیں جانتے ہیں داغ"
                    </p>
                  </div>
                </div>
                <div className="p-2.5 sm:p-4 bg-[#f2f4f6] grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">Mon – Fri</span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Daily Routine</span>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">7–8 PM IST</span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Evening Cohort</span>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg border border-[#e6e8ea]">
                    <span className="block font-bold text-[#003527] text-xs sm:text-sm truncate">100% Live</span>
                    <span className="text-[#707974] text-[10px] sm:text-xs block truncate">Google Meet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COURSE OVERVIEW / HIGHLIGHTS SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-10 sm:py-14 bg-white border-y border-[#e6e8ea]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Course Pillars</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-3 sm:mb-4">What This Course Offers</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944] leading-relaxed">
              A structured six-month journey to help you develop strong Urdu skills step by step — from learning the script to understanding grammar, reading confidently, and using Urdu in everyday situations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Reading */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#f2f4f6] hover:bg-[#f7f9fb] transition-all border border-[#e6e8ea] hover:shadow-md group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064e3b] text-white flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                📖
              </div>
              <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px] mb-2">Reading</h3>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Develop confidence in reading Urdu words, sentences, and longer passages.
              </p>
            </div>
            {/* Card 2: Writing */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#f2f4f6] hover:bg-[#f7f9fb] transition-all border border-[#e6e8ea] hover:shadow-md group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#735c00] text-white flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                ✍️
              </div>
              <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px] mb-2">Writing</h3>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Learn the Urdu script and gradually build accurate writing skills.
              </p>
            </div>
            {/* Card 3: Speaking */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#f2f4f6] hover:bg-[#f7f9fb] transition-all border border-[#e6e8ea] hover:shadow-md group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#006b5f] text-white flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                🗣️
              </div>
              <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px] mb-2">Speaking</h3>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Practice vocabulary, sentence formation, and everyday Urdu conversations.
              </p>
            </div>
            {/* Card 4: Understanding */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#f2f4f6] hover:bg-[#f7f9fb] transition-all border border-[#e6e8ea] hover:shadow-md group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#003527] text-white flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                📚
              </div>
              <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px] mb-2">Understanding</h3>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Build grammar, vocabulary, comprehension, and familiarity with Urdu literature and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU'LL BE ABLE TO DO (Outcomes) */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Tangible Milestones</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-2 sm:mb-3">What You'll Be Able to Do</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
              By the end of the program, in shaa Allah, you'll work toward:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Outcome 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#006b5f] text-[22px] sm:text-[24px]">visibility</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Read With Confidence</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Read Urdu words, sentences, and longer texts with increasing fluency.
              </p>
            </div>
            {/* Outcome 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#735c00] text-[22px] sm:text-[24px]">edit_note</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Write in Urdu</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Build confidence in Urdu spelling, sentence writing, and written expression.
              </p>
            </div>
            {/* Outcome 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#003527] text-[22px] sm:text-[24px]">menu_book</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Understand Grammar</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Learn important Urdu grammar concepts and apply them while reading and writing.
              </p>
            </div>
            {/* Outcome 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#006b5f] text-[22px] sm:text-[24px]">forum</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Communicate in Urdu</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Develop practical vocabulary and sentence patterns for everyday communication.
              </p>
            </div>
            {/* Outcome 5 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#735c00] text-[22px] sm:text-[24px]">psychology</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Understand Written Urdu</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Improve comprehension through progressively more advanced reading material.
              </p>
            </div>
            {/* Outcome 6 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs hover:border-[#006b5f] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#003527] text-[22px] sm:text-[24px]">history_edu</span>
                <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[19px]">Explore Urdu Literature</h3>
              </div>
              <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                Develop the language skills needed to engage with selected Urdu literature, poetry, and Islamic texts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT YOU'LL LEARN (In-Depth Topics) */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f2f4f6]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">In-Depth Topics</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2 mb-3 sm:mb-4">What You'll Learn</h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
              Comprehensive pedagogical coverage across every fundamental and literary domain of the Urdu language.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Topic 1 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#003527] text-[24px] sm:text-[26px]">spellcheck</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Urdu Script &amp; Reading</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Urdu alphabet and letter forms</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Connecting letters and word formation</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Reading words and sentences</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Reading progressively longer passages</span>
                </li>
              </ul>
            </div>
            {/* Topic 2 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#006b5f] text-[24px] sm:text-[26px]">draw</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Writing</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Urdu spelling</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Word and sentence writing</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Dictation and writing practice</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Building written expression</span>
                </li>
              </ul>
            </div>
            {/* Topic 3 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#735c00] text-[24px] sm:text-[26px]">account_tree</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Grammar</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Sentence structure</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Gender</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Pronouns</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Verbs &amp; Tenses</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Common grammatical patterns</span>
                </li>
              </ul>
            </div>
            {/* Topic 4 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#064e3b] text-[24px] sm:text-[26px]">record_voice_over</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Vocabulary &amp; Speaking</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#064e3b] shrink-0 mt-0.5">check_circle</span>
                  <span>Everyday words and phrases</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#064e3b] shrink-0 mt-0.5">check_circle</span>
                  <span>Common expressions &amp; greetings</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#064e3b] shrink-0 mt-0.5">check_circle</span>
                  <span>Sentence formation practice</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#064e3b] shrink-0 mt-0.5">check_circle</span>
                  <span>Conversational Urdu</span>
                </li>
              </ul>
            </div>
            {/* Topic 5 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#006b5f] text-[24px] sm:text-[26px]">import_contacts</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Comprehension</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Reading comprehension</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Understanding sentence meaning</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Vocabulary in context</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f] shrink-0 mt-0.5">check_circle</span>
                  <span>Progressively more advanced texts</span>
                </li>
              </ul>
            </div>
            {/* Topic 6 */}
            <div className="p-5 sm:p-7 rounded-2xl bg-white shadow-xs border border-[#e6e8ea] flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6e8ea]">
                <span className="material-symbols-outlined text-[#735c00] text-[24px] sm:text-[26px]">auto_stories</span>
                <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Literature &amp; Culture</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3 font-sans text-[#404944] text-xs sm:text-sm flex-1">
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Selected Urdu poetry</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Literary vocabulary</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Cultural context</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-2.5">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00] shrink-0 mt-0.5">check_circle</span>
                  <span>Introduction to Urdu literary traditions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 6-MONTH CURRICULUM PROGRESSION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="curriculum">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Academic Road Map</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#003527] font-bold mt-2">Your 6-Month Urdu Journey</h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-[#404944] bg-[#e6e8ea] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold self-start md:self-auto">
              Step-by-Step Cumulative Mastery
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Milestone 01 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064e3b] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    01
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Urdu Foundations</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Build your foundation with the Urdu alphabet, letter forms, pronunciation, joining letters, and basic reading.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Foundations Established
              </div>
            </div>

            {/* Milestone 02 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#003527] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    02
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Reading &amp; Writing</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Move from individual letters to words and sentences while developing spelling and writing confidence.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Literacy &amp; Dictation
              </div>
            </div>

            {/* Milestone 03 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#735c00] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    03
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Essential Urdu Grammar</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Learn sentence structure, gender, pronouns, verbs, tenses, and essential grammatical patterns.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Structural Accuracy
              </div>
            </div>

            {/* Milestone 04 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#006b5f] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    04
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Vocabulary &amp; Everyday Urdu</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Develop practical vocabulary and learn how to form and understand everyday Urdu sentences.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Conversational Fluency
              </div>
            </div>

            {/* Milestone 05 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2b6954] text-white font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    05
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 5</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Reading &amp; Comprehension</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Work with progressively more advanced passages, vocabulary, sentence structures, and comprehension exercises.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Advanced Text Analysis
              </div>
            </div>

            {/* Milestone 06 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064e3b] text-[#ffe088] font-serif text-lg sm:text-xl flex items-center justify-center font-bold">
                    06
                  </span>
                  <span className="px-2.5 py-1 bg-[#eceef0] rounded text-xs font-sans text-[#707974] font-medium">Month 6</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-[#003527] text-lg sm:text-[20px]">Advanced Urdu &amp; Literature</h3>
                  <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                    Strengthen your overall Urdu skills through advanced reading, written expression, selected poetry/literature, and practical language use.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e6e8ea] text-xs text-[#006b5f] font-sans font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Literary Appreciation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COURSE DETAILS & LOGISTICS + 8. HOW CLASSES WORK */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-white border-y border-[#e6e8ea]" id="logistics">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Course Details & Logistics */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Schedule &amp; Format</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">Course Details</h2>
                <p className="text-xs sm:text-sm text-[#404944] font-sans">Clear logistics designed for your daily routine.</p>
              </div>
              {/* Metadata Table Card */}
              <div className="rounded-2xl bg-[#f2f4f6] border border-[#e6e8ea] overflow-hidden shadow-xs">
                <div className="divide-y divide-[#e6e8ea]">
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">timelapse</span>
                      Duration
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">6 Months</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">trending_up</span>
                      Level
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Beginner → Advanced</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">laptop_chromebook</span>
                      Classes
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Live Online</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">calendar_today</span>
                      Schedule
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Monday–Friday</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">schedule</span>
                      Time
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">7:00–8:00 PM IST</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">video_call</span>
                      Platform
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Google Meet</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">groups</span>
                      Class Format
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#003527] text-right">Sisters Only</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 bg-[#064e3b]/10">
                    <span className="font-sans text-xs sm:text-sm text-[#003527] font-bold flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#006b5f]">payments</span>
                      Fee
                    </span>
                    <span className="font-bold text-[#003527] text-base sm:text-lg text-right">₹550 / month</span>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                    <span className="font-sans text-xs sm:text-sm text-[#707974] font-medium flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#735c00]">card_giftcard</span>
                      Trial
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#006b5f] text-right">Free Trial Available</span>
                  </div>
                </div>
              </div>
              {/* Quick Enroll CTA from table */}
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="w-full py-3.5 rounded-xl bg-[#003527] text-white font-sans font-semibold text-xs sm:text-sm md:text-base text-center hover:bg-[#064e3b] transition-all shadow-md cursor-pointer">
                  Register for Upcoming Batch
                </button>
              </EnrollmentModal>
            </div>

            {/* Right Column: How Classes Work */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Pedagogy</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">How You'll Learn</h2>
                <p className="text-xs sm:text-sm text-[#404944] font-sans">A thoughtful, guided learning environment built around clarity and support.</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Feature 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    💻
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Live Online Classes</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Attend interactive classes live through Google Meet.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    👩‍🏫
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Learn With Female Teachers</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Classes are taught by qualified female teachers in a comfortable sisters-only environment.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    📝
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Guided Practice</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Lessons include explanation, examples, practice, and opportunities to ask questions.
                    </p>
                  </div>
                </div>
                {/* Feature 4 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    📅
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Structured 6-Month Program</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Follow a progressive curriculum designed to build your skills step by step.
                    </p>
                  </div>
                </div>
                {/* Feature 5 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#f7f9fb] border border-[#e6e8ea] flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#e6e8ea] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] mb-1">Learn From Anywhere</h3>
                    <p className="font-sans text-[#404944] text-xs sm:text-sm leading-relaxed">
                      Join from India or abroad — wherever you are.
                    </p>
                  </div>
                </div>
                {/* Prominent Policy Note */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex items-start gap-3 text-[#191c1e]">
                  <span className="text-lg sm:text-xl shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-[#003527] text-xs sm:text-sm mb-1">Live Attendance Policy</h4>
                    <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
                      <strong>Note:</strong> Classes are live and are not recorded. If you miss a class, the session generally cannot be replayed or rescheduled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHO IS THIS COURSE FOR? */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="who-is-for">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-[#f2f4f6] border border-[#e6e8ea] p-6 sm:p-8 md:p-12 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Eligibility &amp; Suitability</span>
              <h2 className="font-serif text-2xl sm:text-3xl sm:text-4xl text-[#003527] font-bold mt-1 mb-2">Who Is This Course For?</h2>
              <p className="font-sans text-sm sm:text-base md:text-lg text-[#404944]">
                This course is ideal for sisters who:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Are complete beginners in Urdu</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to learn to read and write Urdu</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to strengthen their existing Urdu skills</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to improve grammar and vocabulary</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to understand Urdu texts more confidently</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to develop practical Urdu for everyday use</span>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white border border-[#e6e8ea]/60 shadow-2xs md:col-span-2">
                <span className="text-[#006b5f] font-bold text-base mt-0.5">✓</span>
                <span className="font-sans text-xs sm:text-sm text-[#191c1e]">Want to explore Urdu literature and poetry</span>
              </div>
            </div>
            {/* Inline CTA Link */}
            <div className="mt-8 sm:mt-10 text-center">
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm md:text-base text-[#003527] hover:text-[#006b5f] font-semibold transition-colors px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] cursor-pointer">
                  Not sure if this course is right for you? Book a Free Trial →
                </button>
              </EnrollmentModal>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f2f4f6] border-t border-[#e6e8ea]" id="faqs">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#006b5f] uppercase tracking-widest">Common Questions</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#003527] font-bold mt-1 mb-2">Frequently Asked Questions</h2>
            <p className="font-sans text-xs sm:text-sm sm:text-base text-[#404944]">Everything you need to know about the Urdu Essentials course.</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {urduFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="rounded-xl bg-white p-4 sm:p-6 shadow-xs border border-[#e6e8ea] cursor-pointer select-none transition-all hover:border-[#003527]/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-serif font-bold text-[#003527] text-base sm:text-[18px] text-left">{faq.q}</h4>
                    <span className={`material-symbols-outlined text-[#707974] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#003527]" : ""}`}>
                      expand_more
                    </span>
                  </div>
                  {isOpen && (
                    <div className="mt-3 font-sans text-[#404944] text-xs sm:text-sm leading-relaxed border-t border-[#e6e8ea]/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="w-full px-4 sm:px-6 md:px-16 py-12 sm:py-16 bg-[#f7f9fb]" id="enroll-action">
        <div className="max-w-[1280px] mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-[#064e3b] text-white overflow-hidden relative p-6 sm:p-10 md:p-14 text-center max-w-4xl mx-auto shadow-xl">
            {/* Decorative Accent */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ffe088] text-[#241a00] mb-5 sm:mb-6 shadow-md">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#241a00]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-3 sm:mb-4">
              Ready to Start Your Urdu Journey?
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#95d3ba] leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
              Take your first step with a free trial class and experience how Hareem Academy teaches Urdu.
            </p>
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 w-full max-w-md mx-auto">
              <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                <button className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-8 rounded-xl bg-[#ffe088] text-[#241a00] font-sans font-bold text-xs sm:text-sm md:text-base hover:bg-[#e9c349] transition-all shadow-md cursor-pointer whitespace-nowrap text-center">
                  Book Your Free Trial
                </button>
              </EnrollmentModal>
              <a
                className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-8 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-sans font-semibold text-xs sm:text-sm md:text-base transition-all cursor-pointer whitespace-nowrap text-center"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="speak-team"
              >
                Speak With Our Team
              </a>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#95d3ba] tracking-wide">
              ₹550 / month • 6 months • Live online • Sisters only
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
