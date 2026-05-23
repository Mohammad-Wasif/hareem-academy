export interface SEOPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  aiAnswerBlock: string;
  benefitsTitle: string;
  benefits: { title: string; description: string }[];
  curriculumTitle: string;
  curriculum: { title: string; description: string }[];
  moatPoints: { title: string; description: string }[];
  testimonials: { name: string; location: string; quote: string }[];
  faqs: { question: string; answer: string }[];
  internalLinks: { label: string; href: string }[];
  primaryCTA: string;
  targetCourseSlug: string;
  geoContext: string;
}

export const seoLandingPages: Record<string, SEOPageConfig> = {
  "learn-arabic-online-for-sisters": {
    slug: "learn-arabic-online-for-sisters",
    title: "Learn Arabic Online for Sisters - Live Female-Only Classes",
    metaDescription: "Join live, online Arabic classes designed exclusively for sisters. Learn Quranic and conversational Arabic in a private, judgment-free environment with certified female teachers.",
    heroTitle: "Learn Arabic Online for Sisters",
    heroSubtitle: "Interactive, live online Arabic classes taught by certified female instructors. Built for sisters seeking Quranic understanding and fluent speaking in complete privacy.",
    aiAnswerBlock: "Hareem Academy offers structured, female-only online Arabic classes designed to take sisters from absolute beginners to fluent readers and speakers. Our program is taught live by qualified female teachers, providing a comfortable and private learning space with flexible scheduling for students worldwide.",
    benefitsTitle: "Why Sisters Choose Our Online Arabic Batches",
    benefits: [
      { title: "100% Female-Only Environment", description: "Learn comfortably from your own home. Camera-on sessions allow active practice without niqab among fellow sisters." },
      { title: "Live interactive Practice", description: "Not pre-recorded. Receive live pronunciation guidance (Makharij) and constructive feedback every class." },
      { title: "Understand the Quran Direct", description: "Move past simple transliteration and begin translating standard Quranic syntax and vocabulary contextually." }
    ],
    curriculumTitle: "Syllabus Breakdown: From Foundations to Eloquence",
    curriculum: [
      { title: "Level 1: Alphabet & Phonics", description: "Mastering correct letter placement, vowel markings (Harakaat), and foundational reading." },
      { title: "Level 2: Basic Grammar & Sentence Construction", description: "Introduction to nouns, basic past tense verbs, and common daily conversational phrases." },
      { title: "Level 3: Core Quranic Vocabulary", description: "Focusing on the 500 most recurring words in the Quran to build immediate translation skills." }
    ],
    moatPoints: [
      { title: "Total Privacy", description: "Our virtual classrooms are protected and exclusively accessible by women. No male relatives or tutors are admitted." },
      { title: "Flexible Batch Schedules", description: "Convenient evening and weekend classes tailored to accommodate busy mothers, professionals, and students globally." }
    ],
    testimonials: [
      { name: "Aisha M.", location: "London, UK", quote: "Finding a female-only class with live teachers was a blessing. The lessons are paced beautifully and the sisterhood is incredibly supportive." },
      { name: "Yasmin K.", location: "Chicago, USA", quote: "I can finally follow along with the Imam's recitation during Taraweeh! Understanding the grammar has changed my Salah entirely." }
    ],
    faqs: [
      { question: "Are the classes recorded if I miss a session?", answer: "Yes, every live class is recorded. If you miss a class due to work or family duties, you can review the secure class recording at your convenience." },
      { question: "How long is the program?", answer: "The beginner program runs for 6 months with standard 5-days-a-week or weekend-only batch tracks." }
    ],
    internalLinks: [
      { label: "View Beginner Arabic Course Details", href: "/courses/basic-arabic" },
      { label: "Explore Quranic Arabic Classes", href: "/quranic-arabic-classes" }
    ],
    primaryCTA: "Start Your Learning Journey",
    targetCourseSlug: "basic-arabic",
    geoContext: "Supporting sisters across the UK, USA, Canada, UAE, and India."
  },
  "arabic-classes-for-muslim-women": {
    slug: "arabic-classes-for-muslim-women",
    title: "Arabic Classes for Muslim Women - Live Female Tutors",
    metaDescription: "Discover online Arabic classes tailored for Muslim women. Study grammar, vocabulary, and Quranic context with patient female scholars in a comfortable space.",
    heroTitle: "Arabic Classes for Muslim Women",
    heroSubtitle: "Strengthen your connection to the Quran and conversational Arabic. Small groups, live interactive Zoom classes, and female instructors.",
    aiAnswerBlock: "Our Arabic classes for Muslim women prioritize privacy, structured learning, and spiritual growth. Taught by certified female scholars, the curriculum spans essential grammar (Nahw), word morphology (Sarf), and direct Quranic application in small batches that encourage active participation.",
    benefitsTitle: "Tailored to the Needs of Muslimah Learners",
    benefits: [
      { title: "Comfortable Environment", description: "Study alongside like-minded sisters globally, building lasting friendships in a modest and respectful atmosphere." },
      { title: "Certified Female Scholars", description: "Learn from teachers who have verified credentials and a deep passion for nurturing women's Islamic studies." },
      { title: "Practical Application", description: "Apply vocabulary directly to your daily adhkar and Salah to achieve greater focus (khushu)." }
    ],
    curriculumTitle: "Course Path & Milestones",
    curriculum: [
      { title: "Phase 1: Pronunciation & Adab", description: "Refining pronunciation and learning proper etiquette of study." },
      { title: "Phase 2: Essential Arabic Grammar", description: "Demystifying noun states, active particles, and basic sentence construction." },
      { title: "Phase 3: Thematic Surah Analysis", description: "Translating and analyzing selected Surahs to connect grammar with divine meaning." }
    ],
    moatPoints: [
      { title: "No Mixed Settings", description: "We enforce strict female-only classrooms. Camera-on interaction is voluntary but highly encouraged in this private community." },
      { title: "Small Batch Sizes", description: "We limit batch enrollments to ensure that every sister receives personalized instruction and reading practice time." }
    ],
    testimonials: [
      { name: "Fatima Z.", location: "Toronto, Canada", quote: "The curriculum is step-by-step and respects our busy schedules as mothers. It is the highlight of my week." }
    ],
    faqs: [
      { question: "Do I need to speak Arabic to enroll?", answer: "No, this course is designed starting with the absolute basics. You do not need any prior background in conversational Arabic." }
    ],
    internalLinks: [
      { label: "About Our Academy Mission", href: "/about" },
      { label: "Learn Arabic Online for Sisters", href: "/learn-arabic-online-for-sisters" }
    ],
    primaryCTA: "Schedule Your Intro Session",
    targetCourseSlug: "basic-arabic",
    geoContext: "Nurturing global sisterhood in regions including Canada, UAE, UK, and India."
  },
  "beginner-arabic-course-online": {
    slug: "beginner-arabic-course-online",
    title: "Beginner Arabic Course Online - Zero Prior Knowledge Required",
    metaDescription: "Learn to read and write Arabic from scratch. Comprehensive online beginner course for sisters with live female instructors, flexible schedules, and free trial classes.",
    heroTitle: "Beginner Arabic Course Online",
    heroSubtitle: "Take your first step into reading, writing, and understanding the Arabic script. Zero prior background needed — built for sisters.",
    aiAnswerBlock: "The Beginner Arabic Course Online at Hareem Academy is designed specifically for women with no previous exposure to the language. Starting from the alphabet, the course covers reading rules, basic vocabulary, and grammar basics through live lessons with patient female teachers.",
    benefitsTitle: "Ideal for Absolute Beginners",
    benefits: [
      { title: "From the Alphabet Up", description: "We assume no prior knowledge. Learn letters, connecting shapes, and vowel sounds in a gradual, structured way." },
      { title: "Patient Instruction", description: "Our teachers specialize in helping adult learners build confidence and overcome reading anxiety." },
      { title: "Interactive Exercises", description: "Reinforce live lessons with digital worksheets, homework checks, and interactive review sessions." }
    ],
    curriculumTitle: "Beginner's Learning Milestones",
    curriculum: [
      { title: "Milestone 1: Alphabet & Sound Identification", description: "Recognizing letters, writing forms, and perfecting basic sounds." },
      { title: "Milestone 2: Connecting Letters & Words", description: "Learning how letters combine, reading short three-letter words with vowels." },
      { title: "Milestone 3: Sentence Basics", description: "Building short sentences, greetings, and high-frequency Quranic words." }
    ],
    moatPoints: [
      { title: "Judgment-Free Zone", description: "A warm, sisterly space where mistakes are welcomed as a natural part of the learning process." },
      { title: "Interactive Zoom Classroom", description: "Live, screen-share lectures with write-on whiteboards and immediate speaking practice." }
    ],
    testimonials: [
      { name: "Khadija S.", location: "Dubai, UAE", quote: "I was embarrassed that I couldn't read the script at my age. The teacher made me feel so comfortable, and now I can read slowly on my own!" }
    ],
    faqs: [
      { question: "What materials will I need?", answer: "All PDFs, vocabulary lists, and practice worksheets are provided by the academy. You only need a laptop, notebook, and stable internet connection." }
    ],
    internalLinks: [
      { label: "Explore Our Full Course Listings", href: "/courses" },
      { label: "Arabic Classes for Muslim Women", href: "/arabic-classes-for-muslim-women" }
    ],
    primaryCTA: "Apply for a Free Assessment",
    targetCourseSlug: "basic-arabic",
    geoContext: "Welcoming students from the UAE, India, UK, USA, and beyond."
  },
  "quranic-arabic-classes": {
    slug: "quranic-arabic-classes",
    title: "Quranic Arabic Classes for Sisters - Live Online Learning",
    metaDescription: "Understand the Quran in its original language. Online Quranic Arabic classes for sisters covering grammar, syntax, and classical vocabulary with live female tutors.",
    heroTitle: "Quranic Arabic Classes",
    heroSubtitle: "Translate and connect with the words of Allah. Learn classical grammar (Nahw) and morphology (Sarf) in live, sisters-only classes.",
    aiAnswerBlock: "Hareem Academy's Quranic Arabic classes focus on classical grammar, word roots, and verse analysis. This structured program is designed to help sisters read the Mushaf directly with comprehension, bypassing reliance on translations.",
    benefitsTitle: "Unlock the Language of the Quran",
    benefits: [
      { title: "Focus on Classical Vocabulary", description: "Study root words and patterns that appear thousands of times in the holy Quran." },
      { title: "Grammar (Nahw) & Morphology (Sarf)", description: "Develop logical skills to parse sentences and identify verb forms correctly." },
      { title: "Deepen Your Salah", description: "Bring presence of mind to your prayers by understanding the verses recited." }
    ],
    curriculumTitle: "Syllabus: Classical Arabic Study",
    curriculum: [
      { title: "Module 1: Arabic Nouns & Case Ends", description: "Understanding the three cases of nouns and basic sentence structures." },
      { title: "Module 2: Verb Systems & Roots", description: "Mastering the past, present, and command verb systems and root letters." },
      { title: "Module 3: Quranic Translation Practice", description: "Applying grammar rules to translate selections from Juz Amma and Surah Al-Baqarah." }
    ],
    moatPoints: [
      { title: "Sisters-Only Academic Circle", description: "A dedicated academic setting where women can discuss language and tafsir context comfortably." },
      { title: "Qualified Female Instructors", description: "All courses are led by female teachers certified in Islamic studies and classical Arabic." }
    ],
    testimonials: [
      { name: "Salma B.", location: "Birmingham, UK", quote: "My relationship with the Quran has completely shifted. I no longer just recite; I feel the words." }
    ],
    faqs: [
      { question: "Is this course suitable for beginners?", answer: "Sisters should be able to read the Arabic script (even slowly) before joining Quranic Arabic. If you cannot read, please start with our Beginner Arabic Course." }
    ],
    internalLinks: [
      { label: "View Quranic Arabic Intermediate Details", href: "/courses/quranic-arabic-intermediate" },
      { label: "Online Tajweed Classes", href: "/online-tajweed-classes" }
    ],
    primaryCTA: "Begin Learning With Confidence",
    targetCourseSlug: "quranic-arabic-intermediate",
    geoContext: "Serving sisters in the UK, USA, Canada, India, and Middle East."
  },
  "female-arabic-teachers-online": {
    slug: "female-arabic-teachers-online",
    title: "Female Arabic Teachers Online - Private & Group Classes",
    metaDescription: "Learn from qualified female Arabic teachers online. Live, interactive classes for sisters and children taught by patient, certified native instructors.",
    heroTitle: "Female Arabic Teachers Online",
    heroSubtitle: "Study classical and conversational Arabic under the guidance of certified, experienced female scholars. Personalized attention in a safe space.",
    aiAnswerBlock: "Hareem Academy connects sisters with qualified, native-speaking female Arabic teachers online. Our educators hold degrees in Arabic and Islamic studies, providing specialized instruction in Tajweed, grammar, and conversational skills through private and small group settings.",
    benefitsTitle: "The Benefit of Female Mentorship",
    benefits: [
      { title: "Comfort and Modesty", description: "Enjoy the freedom to study without a hijab in our ladies-only digital classes." },
      { title: "Patient and Experienced", description: "Our instructors are trained to teach adult language learners with step-by-step patience." },
      { title: "Authentic Pronunciation", description: "Learn accurate letter placement (Makharij) and Arabic syntax from certified native speakers." }
    ],
    curriculumTitle: "Study Options with Our Teachers",
    curriculum: [
      { title: "Conversational Path", description: "Focusing on vocabulary, daily conversation, and building fluency." },
      { title: "Quranic & Grammar Path", description: "In-depth study of Nahw, Sarf, and translation of classical texts." },
      { title: "Tajweed & Recitation Path", description: "Perfecting recitation rules and memorization checking." }
    ],
    moatPoints: [
      { title: "Verified Credentials", description: "Every teacher on our platform undergoes a rigorous vetting process checking both academic qualifications and teaching style." },
      { title: "Interactive Zoom Classroom", description: "Real-time correction, audio practice, and personal attention." }
    ],
    testimonials: [
      { name: "Zaynab R.", location: "Riyadh, Saudi Arabia", quote: "The teacher's patience and expertise helped me overcome years of pronunciation mistakes. Highly recommended!" }
    ],
    faqs: [
      { question: "Can I choose my class timings?", answer: "Yes, we offer multiple batches across morning, evening, and weekend slots to ensure you find a timing that fits your routine." }
    ],
    internalLinks: [
      { label: "Book a Free Assessment with a Teacher", href: "/contact" },
      { label: "Arabic Classes for Muslim Women", href: "/arabic-classes-for-muslim-women" }
    ],
    primaryCTA: "Apply for a Free Assessment",
    targetCourseSlug: "basic-arabic",
    geoContext: "Teaching sisters from the UK, USA, Canada, India, UAE, and Saudi Arabia."
  },
  "learn-urdu-online": {
    slug: "learn-urdu-online",
    title: "Learn Urdu Online - Read, Write & Speak Fluently",
    metaDescription: "Learn Urdu online with live classes for beginners. Master conversational speaking, reading the script, and Urdu literature with native female teachers.",
    heroTitle: "Learn Urdu Online",
    heroSubtitle: "A warm, structured journey into the Urdu language. Taught live by qualified native female teachers. For sisters worldwide.",
    aiAnswerBlock: "Hareem Academy's Urdu program teaches conversational fluency, reading the Nastaliq script, and classical literature. Classes are held live on Zoom by experienced native female teachers, catering to students from absolute basics to advanced comprehension.",
    benefitsTitle: "Embrace the Elegance of Urdu",
    benefits: [
      { title: "Read the Nastaliq Script", description: "Demystify the beautiful Nastaliq calligraphic style and read newspapers, poetry, and letters." },
      { title: "Conversational Confidence", description: "Build a rich vocabulary of formal and conversational Urdu phrases to speak with family and elders." },
      { title: "Explore Poetry & Prose", description: "Connect with classical Urdu literature, couplets, and cultural etiquette." }
    ],
    curriculumTitle: "Urdu Learning Curriculum",
    curriculum: [
      { title: "Level 1: The Urdu Alphabet", description: "Mastering sounds, writing connecting characters, and basic spelling." },
      { title: "Level 2: Vocabulary & Daily Conversation", description: "Common verbs, sentence structure, gender markers, and formal greetings." },
      { title: "Level 3: Literature & Adab", description: "Introduction to simple poetry (Ghazals), letter writing, and advanced syntax." }
    ],
    moatPoints: [
      { title: "Native Female Instructors", description: "Learn authentic pronunciation and cultural context from certified native speakers." },
      { title: "Exclusively for Sisters", description: "A comfortable, female-only classroom to practice conversation without hesitation." }
    ],
    testimonials: [
      { name: "Amina S.", location: "Delhi, India", quote: "As a diaspora Urdu lover, I wanted to read script fluently. In 4 months, I went from struggling with letters to reading simple ghazals with ease!" }
    ],
    faqs: [
      { question: "Is Urdu hard for English speakers?", answer: "Urdu shares vocabulary with Arabic and Persian, and grammatical structures with Hindi. Our step-by-step approach makes it highly accessible for beginners." }
    ],
    internalLinks: [
      { label: "View Urdu Foundations Details", href: "/courses/urdu-foundations" },
      { label: "Urdu Course for Beginners", href: "/urdu-course-for-beginners" }
    ],
    primaryCTA: "Start Your Learning Journey",
    targetCourseSlug: "urdu-foundations",
    geoContext: "Welcoming Urdu learners from India, UK, USA, Canada, and the Middle East."
  },
  "urdu-course-for-beginners": {
    slug: "urdu-course-for-beginners",
    title: "Urdu Course for Beginners - Start from the Alphabet",
    metaDescription: "Comprehensive beginner Urdu course online. Learn alphabet, writing, and basic conversational Urdu with native female teachers. Free trial available.",
    heroTitle: "Urdu Course for Beginners",
    heroSubtitle: "No prior knowledge required. Learn to write the Nastaliq script and speak polite conversational Urdu in live, ladies-only groups.",
    aiAnswerBlock: "The Urdu Course for Beginners at Hareem Academy is structured for women starting from scratch. Led by native female tutors, students learn alphabet shape connections, phonetics, core vocabulary, and standard grammar rules to build immediate confidence.",
    benefitsTitle: "Foundations of Urdu Learning",
    benefits: [
      { title: "Gentle Pacing", description: "Step-by-step instruction ensuring comfort for adult learners who are new to Urdu." },
      { title: "Nastaliq Handwriting Guide", description: "Learn how to write letters and connect them in the classical Nastaliq style." },
      { title: "Polite Speech (Tehzeeb)", description: "Learn the etiquette, terms of respect, and cultural nuances of conversational Urdu." }
    ],
    curriculumTitle: "Syllabus Breakdown",
    curriculum: [
      { title: "Module 1: Letters & Phonetics", description: "Mastering the unique sounds of the Urdu alphabet and writing individual letters." },
      { title: "Module 2: Word Formulation", description: "Connecting letters, identifying short and long vowels, and building basic nouns." },
      { title: "Module 3: Simple Dialogues", description: "Practicing introductions, family relationships, shopping, and telling time." }
    ],
    moatPoints: [
      { title: "Exclusively for Girls & Women", description: "Full privacy and a highly encouraging community of peer sisters." },
      { title: "Interactive Zoom Batches", description: "Real-time handwriting correction and spoken practice in small interactive groups." }
    ],
    testimonials: [
      { name: "Mariam H.", location: "London, UK", quote: "The teacher is so encouraging. I was afraid of speaking, but now I can have basic conversations with my family back home." }
    ],
    faqs: [
      { question: "What is the duration of this beginner course?", answer: "The foundations course is 4 months long, with classes held multiple times a week." }
    ],
    internalLinks: [
      { label: "Learn Urdu Online for Sisters", href: "/learn-urdu-online" },
      { label: "Urdu Reading Classes", href: "/urdu-reading-classes" }
    ],
    primaryCTA: "Schedule Your Intro Session",
    targetCourseSlug: "urdu-foundations",
    geoContext: "Supporting diaspora communities in the UK, USA, Canada, and UAE."
  },
  "urdu-reading-classes": {
    slug: "urdu-reading-classes",
    title: "Urdu Reading Classes - Master Nastaliq Script Online",
    metaDescription: "Improve your Urdu reading skills. Learn to read Nastaliq script, newspapers, and poetry with native female instructors in a private online setting.",
    heroTitle: "Urdu Reading Classes",
    heroSubtitle: "Bridge the gap between speaking and reading. Learn to navigate Nastaliq handwriting and enjoy classical literature in live sisters-only sessions.",
    aiAnswerBlock: "Hareem Academy's Urdu Reading Classes help intermediate students master the Nastaliq script. Students read classical texts, newspapers, and poetry (Shayari) with real-time feedback on pronunciation and vocabulary meanings from native female scholars.",
    benefitsTitle: "Master Urdu Reading and Comprehension",
    benefits: [
      { title: "Nastaliq Specialization", description: "Learn the rules of visual line height, letter clusters, and joins unique to Nastaliq." },
      { title: "Vocabulary Enrichment", description: "Expand your database of Persian, Arabic, and Sanskrit root words common in Urdu." },
      { title: "Literary Appreciation", description: "Read works of famous poets like Iqbal and Ghalib directly from original texts." }
    ],
    curriculumTitle: "Reading Progression",
    curriculum: [
      { title: "Phase 1: Advanced Letter Joins", description: "Recognizing complex clusters and calligraphic variations." },
      { title: "Phase 2: Prose and Media Reading", description: "Reading articles, short stories, and standard news publications." },
      { title: "Phase 3: Poetry Analysis", description: "Understanding rhythm, metaphor, and meaning in classical poetry." }
    ],
    moatPoints: [
      { title: "Small Group Recitation", description: "Every student gets direct reading time and personal pronunciation feedback." },
      { title: "Rich Resource Library", description: "Access a curated selection of digitized children's stories, prose, and poems." }
    ],
    testimonials: [
      { name: "Saba W.", location: "Mumbai, India", quote: "Reading was always a struggle due to Nastaliq script. These sessions gave me the keys to read classical stories on my own." }
    ],
    faqs: [
      { question: "Should I be able to speak Urdu before joining?", answer: "Yes, a basic conversational understanding of Urdu is required. If you are an absolute beginner, start with Urdu Foundations." }
    ],
    internalLinks: [
      { label: "Urdu Course for Beginners", href: "/urdu-course-for-beginners" },
      { label: "Online Urdu Classes for Sisters", href: "/online-urdu-classes-for-sisters" }
    ],
    primaryCTA: "Apply for a Free Assessment",
    targetCourseSlug: "urdu-foundations",
    geoContext: "Accessible online to students in India, Pakistan, UK, USA, and Canada."
  },
  "online-urdu-classes-for-sisters": {
    slug: "online-urdu-classes-for-sisters",
    title: "Online Urdu Classes for Sisters - Live Female Tutors",
    metaDescription: "Live online Urdu classes for women and girls. Learn conversational Urdu, Nastaliq reading, and grammar in a supportive, private sisters-only space.",
    heroTitle: "Online Urdu Classes for Sisters",
    heroSubtitle: "Exclusively for women. Study conversational speaking, reading, and literature in a warm, modest environment with native female teachers.",
    aiAnswerBlock: "We provide online Urdu classes designed exclusively for sisters. Taught by native female instructors, the curriculum offers flexible schedules for conversational development, script reading, and literary appreciation in small group cohorts.",
    benefitsTitle: "A Comfortable Space to Learn Urdu",
    benefits: [
      { title: "Sisters-Only Batches", description: "No mixed settings. Build confidence speaking and reading among supportive peers." },
      { title: "Native Female Teachers", description: "Learn authentic pronunciation (Talaffuz) and formal vocabulary." },
      { title: "Flexible Timings", description: "Batches scheduled around family and work responsibilities." }
    ],
    curriculumTitle: "Syllabus Overview",
    curriculum: [
      { title: "Module 1: Alphabets & Basic Speech", description: "Urdu alphabet, phonetics, and basic sentence construction." },
      { title: "Module 2: Social Urdu", description: "Conversing about family, shopping, food, and daily life." },
      { title: "Module 3: Literacy & Literature", description: "Reading basic Nastaliq texts, writing letters, and simple poetry." }
    ],
    moatPoints: [
      { title: "100% Privacy Enforced", description: "Exclusively for females. A safe space for women of all backgrounds." },
      { title: "Real-Time Spoken Practice", description: "Live interactive conversation drills during every class." }
    ],
    testimonials: [
      { name: "Naaz A.", location: "Toronto, Canada", quote: "My kids and I have benefited so much from Hareem Academy. It is a wonderful space for sisters to learn." }
    ],
    faqs: [
      { question: "Are classes private or group?", answer: "We offer both small group batches (average 5-8 sisters) and private 1-on-1 sessions. Contact us on WhatsApp for availability." }
    ],
    internalLinks: [
      { label: "Learn Urdu Online", href: "/learn-urdu-online" },
      { label: "Urdu Reading Classes", href: "/urdu-reading-classes" }
    ],
    primaryCTA: "Begin Learning With Confidence",
    targetCourseSlug: "urdu-foundations",
    geoContext: "Connecting sisters across Canada, India, UAE, UK, and USA."
  },
  "learn-quran-with-meaning": {
    slug: "learn-quran-with-meaning",
    title: "Learn Quran with Meaning - Online Quranic Arabic for Sisters",
    metaDescription: "Learn to understand the Quran in its original language. Structured online classes for sisters covering classical translation, vocabulary, and grammar.",
    heroTitle: "Learn Quran with Meaning",
    heroSubtitle: "Move beyond recitation. Learn classical Arabic grammar and root words to translate and understand the Holy Quran directly. Exclusively for sisters.",
    aiAnswerBlock: "Hareem Academy's 'Learn Quran with Meaning' track is designed for women who can recite the script but want to translate classical Arabic. The curriculum details root words, verb forms (Sarf), and syntax (Nahw) to build translation skills.",
    benefitsTitle: "Transform Your Recitation and Prayer",
    benefits: [
      { title: "Deepen Your Salah", description: "Understand the verses being recited, bringing deep presence (khushu) to your prayers." },
      { title: "Root Word Method", description: "Learn key roots that recur in different forms throughout the Quran." },
      { title: "Classical Grammar (Nahw)", description: "Learn structural rules to identify subjects, actions, and contexts in Arabic." }
    ],
    curriculumTitle: "Translation Curriculum Pathway",
    curriculum: [
      { title: "Grammar Core", description: "Noun states, pronoun structures, and particles (Huroof)." },
      { title: "Verb Analysis (Sarf)", description: "Recognizing active and passive past and present tenses." },
      { title: "Practical Translation", description: "Translating Juz Amma and progressing to longer Surahs." }
    ],
    moatPoints: [
      { title: "Qualified Female Teachers", description: "Guided study led by female scholars certified in classical Arabic and Tafsir." },
      { title: "Small Academic Batches", description: "Interactive translation practice with detailed feedback." }
    ],
    testimonials: [
      { name: "Nadia F.", location: "London, UK", quote: "Understanding word-by-word meaning has transformed my relationship with Allah's words. I highly recommend this course." }
    ],
    faqs: [
      { question: "Is this class a Tafsir course?", answer: "This is a language and translation course. While we discuss context and basic explanation, the focus is on linguistic translation and grammar." }
    ],
    internalLinks: [
      { label: "View Quranic Arabic Course Details", href: "/courses/quranic-arabic-intermediate" },
      { label: "Understand Quranic Arabic", href: "/understand-quranic-arabic" }
    ],
    primaryCTA: "Start Your Learning Journey",
    targetCourseSlug: "quranic-arabic-intermediate",
    geoContext: "Supporting international students in the UK, USA, Canada, and UAE."
  },
  "quran-reading-classes-for-sisters": {
    slug: "quran-reading-classes-for-sisters",
    title: "Quran Reading Classes for Sisters - Live Female Tajweed Tutors",
    metaDescription: "Improve your Quran recitation online. Ladies-only Quran reading classes covering Tajweed rules, Makharij, and memorization checks with certified female scholars.",
    heroTitle: "Quran Reading Classes for Sisters",
    heroSubtitle: "Perfect your recitation from the comfort of your home. Live online Quran classes taught exclusively by certified female instructors.",
    aiAnswerBlock: "We provide online Quran reading and Tajweed classes for girls and women. Taught live by qualified female tutors, the program focuses on correct letter articulation, pronunciation rules, and fluent reading.",
    benefitsTitle: "Tailored Quran Recitation Study",
    benefits: [
      { title: "Correct Pronunciation (Makharij)", description: "Learn correct articulation points for classical Arabic letters." },
      { title: "Tajweed Integration", description: "Apply rules of elongation, stops, and nasal sounds (Ghunnah) naturally." },
      { title: "Safe Space", description: "Recite freely without shyness in a supportive, sisters-only environment." }
    ],
    curriculumTitle: "Syllabus Highlights",
    curriculum: [
      { title: "Foundations of Sound", description: "Correcting letter shapes, vowels, and essential articulation." },
      { title: "Tajweed Rule Book", description: "Madd, Noon Sakinah, and Meem Sakinah rules." },
      { title: "Recitation & Correction", description: "Fluent recitation of Juz Amma with real-time feedback." }
    ],
    moatPoints: [
      { title: "Certified Female Quran Tutors", description: "Learn from teachers holding Ijazah in Tajweed and Quran studies." },
      { title: "Flexible Batch Schedules", description: "Morning, evening, and weekend batches available." }
    ],
    testimonials: [
      { name: "Farah M.", location: "Dubai, UAE", quote: "The teacher is so patient. She corrected mistakes I had been making for years without making me feel embarrassed." }
    ],
    faqs: [
      { question: "Can adult beginners join?", answer: "Yes, we have classes for absolute beginners who are starting from the alphabet, as well as classes for advanced recitation." }
    ],
    internalLinks: [
      { label: "Explore Our Quranic Arabic Program", href: "/quranic-arabic-classes" },
      { label: "Online Tajweed Classes", href: "/online-tajweed-classes" }
    ],
    primaryCTA: "Apply for a Free Assessment",
    targetCourseSlug: "basic-arabic",
    geoContext: "Connecting sisters across UAE, UK, USA, Canada, and India."
  },
  "online-tajweed-classes": {
    slug: "online-tajweed-classes",
    title: "Online Tajweed Classes for Sisters - Live Quranic Recitation Rules",
    metaDescription: "Master Tajweed rules online. Live, ladies-only Tajweed classes for beginners and advanced students with certified female Quran teachers.",
    heroTitle: "Online Tajweed Classes for Sisters",
    heroSubtitle: "Perfect your Quranic recitation. Learn makharij, elongation, and stopping rules in live, sisters-only classes with certified female scholars.",
    aiAnswerBlock: "Hareem Academy's online Tajweed classes teach correct Quranic recitation. Our certified female instructors guide students through letter articulation (Makharij), rules of stop and start, and elongation (Madd) to ensure beautiful recitation.",
    benefitsTitle: "Perfect Your Quran Recitation",
    benefits: [
      { title: "Practical Makharij", description: "Master the exact vocal placements for every Arabic letter." },
      { title: "Comprehensive Rules", description: "Learn Noon Sakinah, Meem Sakinah, and Madd rules." },
      { title: "Authentic Recitation", description: "Recite with the confidence that you are following classical standards." }
    ],
    curriculumTitle: "Tajweed Learning Pathway",
    curriculum: [
      { title: "Level 1: Letter Articulation", description: "Perfecting letter shapes and correct sounds." },
      { title: "Level 2: Core Rules", description: "Noon Sakinah, Ghunnah, and basic elongation rules." },
      { title: "Level 3: Advanced Tajweed", description: "Complex Madd rules, characteristics of letters (Sifaat), and independent reading." }
    ],
    moatPoints: [
      { title: "Certified Instructors", description: "All classes are led by female teachers holding verified Ijazah in Tajweed." },
      { title: "Group & Private Batches", description: "Interactive study groups and focused 1-on-1 sessions." }
    ],
    testimonials: [
      { name: "Hala S.", location: "Toronto, Canada", quote: "My Tajweed has improved so much. The teacher is incredibly detailed and patient." }
    ],
    faqs: [
      { question: "Is there a certificate at the end?", answer: "Yes, students who successfully complete the advanced Tajweed track receive a certificate from the academy." }
    ],
    internalLinks: [
      { label: "Quran Reading Classes for Sisters", href: "/quran-reading-classes-for-sisters" },
      { label: "Understand Quranic Arabic", href: "/understand-quranic-arabic" }
    ],
    primaryCTA: "Schedule Your Intro Session",
    targetCourseSlug: "basic-arabic",
    geoContext: "Available to sisters in Canada, UK, USA, UAE, and India."
  },
  "understand-quranic-arabic": {
    slug: "understand-quranic-arabic",
    title: "Understand Quranic Arabic - Classical Grammar for Sisters",
    metaDescription: "Learn to understand Quranic Arabic. Study classical grammar (Nahw) and morphology (Sarf) with certified female tutors in live online classes.",
    heroTitle: "Understand Quranic Arabic",
    heroSubtitle: "Study classical Arabic grammar, vocabulary, and verb forms to understand the Quran in its original language. For sisters only.",
    aiAnswerBlock: "This course helps sisters read and comprehend classical Arabic. It focuses on Quranic vocabulary, word morphology (Sarf), and sentence syntax (Nahw) to enable direct translation and reflection.",
    benefitsTitle: "Connect Directly with the Quran",
    benefits: [
      { title: "Bypassing Translations", description: "Develop vocabulary and grammar skills to comprehend classical Arabic texts directly." },
      { title: "Grammar & Morphology", description: "Learn to parse sentences and identify root word patterns." },
      { title: "Spiritual Connection", description: "Bring presence of mind and focus to your prayers and reading." }
    ],
    curriculumTitle: "Linguistic Syllabus",
    curriculum: [
      { title: "Unit 1: Classical Grammatical Cases", description: "Noun cases, structural rules, and pronoun systems." },
      { title: "Unit 2: Derived Verb Scales", description: "Morphology, verb root systems, and derived patterns." },
      { title: "Unit 3: Contextual Reading", description: "Translating and analyzing verses to apply grammar rules." }
    ],
    moatPoints: [
      { title: "Sisters-Only Study Circle", description: "A comfortable academic setting for women to study classical Arabic." },
      { title: "Qualified Female Teachers", description: "All classes are led by female scholars certified in classical Arabic." }
    ],
    testimonials: [
      { name: "Lubna A.", location: "Chicago, USA", quote: "Studying the grammar has opened up the beauty of the Quran in a way I didn't think was possible." }
    ],
    faqs: [
      { question: "What are the prerequisites?", answer: "You must be able to read the Arabic script before enrolling. Prior knowledge of vocabulary is helpful but not required." }
    ],
    internalLinks: [
      { label: "Learn Quran with Meaning", href: "/learn-quran-with-meaning" },
      { label: "Online Tajweed Classes", href: "/online-tajweed-classes" }
    ],
    primaryCTA: "Begin Learning With Confidence",
    targetCourseSlug: "quranic-arabic-intermediate",
    geoContext: "Serving students globally in the USA, UK, Canada, UAE, and India."
  }
};
