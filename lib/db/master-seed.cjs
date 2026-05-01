const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function masterSeed() {
  console.log("🌱 Starting Master Seed on Neon...");

  // 1. Courses
  await pool.query(`
    INSERT INTO courses (slug, title, language, level, duration_months, timings, platform, fee_monthly, currency, summary, highlights, curriculum, for_whom, featured)
    VALUES
      ('basic-arabic', 'Basic Arabic Course', 'Arabic', 'Beginner', 6, 'Monday to Friday, 8:00 PM – 9:30 PM IST', 'Live on Zoom', 1000, 'INR', 'A six-month, women-only journey into Quranic and conversational Arabic. Built for sisters who want to read the Quran with...', 
      '["Master the Arabic alphabet and pronunciation (Makharij)", "Build a vocabulary of 500+ common Quranic words", "Understand basic sentence structures and grammar rules", "Learn to read and write simple Arabic sentences"]'::jsonb, 
      '[{"title": "Module 1: The Foundations", "description": "Alphabet, vowels (Harakaat), and basic pronunciation rules."}, {"title": "Module 2: Building Blocks", "description": "Nouns (Ism), gender, and plurality in Arabic."}, {"title": "Module 3: Action and Time", "description": "Introduction to basic past and present tense verbs."}, {"title": "Module 4: Daily Conversation", "description": "Greetings, family, and common household vocabulary."}, {"title": "Module 5: Quranic Vocabulary", "description": "Most frequent words found in the Juz Amma."}, {"title": "Module 6: Putting it Together", "description": "Reading short passages and basic composition."}]'::jsonb, 
      'Sisters only', true),

      ('urdu-foundations', 'Urdu Foundations', 'Urdu', 'Beginner', 4, 'Mon, Wed, Fri — 7:00 PM – 8:00 PM IST', 'Live on Zoom', 800, 'INR', 'A warm four-month journey into reading, writing, and conversational Urdu — designed for sisters in India and abroad who want to...', 
      '["Read and write the Urdu script with confidence", "Engage in basic conversations in Urdu", "Understand the historical and cultural context of the language"]'::jsonb, 
      '[{"title": "Module 1: The Urdu Script", "description": "Connecting letters and identifying unique Urdu sounds."}, {"title": "Module 2: Essential Grammar", "description": "Sentence structure, gender, and basic tenses."}, {"title": "Module 3: The Bazaar and Home", "description": "Vocabulary for daily activities and shopping."}, {"title": "Module 4: Poetry and Culture", "description": "Introduction to simple Urdu couplets and etiquette."}]'::jsonb, 
      'Sisters only', true),

      ('quranic-arabic-intermediate', 'Quranic Arabic — Intermediate', 'Arabic', 'Intermediate', 6, 'Tue & Thu — 8:00 PM – 9:30 PM IST', 'Live on Zoom', 1200, 'INR', 'A continuation of the Basic Arabic course for sisters who can already read the Mushaf and want to go deeper into understanding the Qur...', 
      '["Deep dive into Sarf (Morphology) and Nahw (Syntax)", "Analyze complex Quranic verses grammatically", "Develop an appreciation for Quranic eloquence (Balagha)", "Translate verses directly without relying on English"]'::jsonb, 
      '[{"title": "Module 1: Advanced Verb Forms", "description": "The ten derived scales and their meanings."}, {"title": "Module 2: Complex Sentences", "description": "Conditional statements and relative clauses."}, {"title": "Module 3: Grammatical Analysis (I''rab)", "description": "Detailed parsing of selected Surahs."}, {"title": "Module 4: Intro to Balagha", "description": "Metaphors and emphasis in the Quran."}, {"title": "Module 5: Thematic Study", "description": "Following linguistic themes through different Surahs."}, {"title": "Module 6: Independent Translation", "description": "Final project on translating and explaining a passage."}]'::jsonb, 
      'Sisters only', false)
  `);
  console.log("✅ 3 courses inserted");

  // 2. Testimonials
  await pool.query(`
    INSERT INTO testimonials (student_name, location, course, rating, quote, featured)
    VALUES
      ('Sumayyah A.', 'Dubai, UAE', 'Basic Arabic Course', 5, 'The word-by-word Quran sessions have transformed my Salah. I now understand what I am saying. There are no words for what this course has given me.', true),
      ('Maryam S.', 'Lucknow, India', 'Urdu Foundations', 5, E'My grandmother spoke beautiful Urdu and I always wished I could too. In four months I went from struggling with the alphabet to reading Iqbal''s nazms with my Naani.', true),
      ('Khadijah M.', 'Toronto, Canada', 'Basic Arabic Course', 5, E'As a working mother, the 8 PM IST timing didn''t suit me \\u2014 but my teacher arranged a recording every single class. I have not missed a single lesson in six months.', true)
  `);
  console.log("✅ 3 testimonials inserted");

  // 3. FAQs
  await pool.query(`
    INSERT INTO faqs (question, answer, category, sort_order)
    VALUES
      ('Who can join Hareem Academy?', 'Hareem Academy is exclusively for girls and women (sisters only). We welcome learners of all ages and backgrounds — whether you are a beginner or want to deepen your existing knowledge.', 'General', 1),
      ('Do I need any prior knowledge of Arabic or Urdu?', 'Not at all! Our Beginner courses start from the very basics — the alphabet, pronunciation, and simple words. You will be guided step by step.', 'General', 2),
      ('How are classes conducted?', 'All classes are held live on Zoom. You get real-time interaction with your teacher, can ask questions, and practice during class.', 'Classes', 3),
      ('What are the class timings?', 'Each course has its own schedule. For example, the Basic Arabic Course runs Monday to Friday from 8:00 PM to 9:30 PM IST. Check the course page for exact timings.', 'Classes', 4),
      ('Is there a free trial available?', 'Yes! Every course offers a free trial class so you can experience our teaching style before committing. Click "Book Free Trial" on any course page to get started.', 'Enrollment', 5),
      ('What is the fee structure?', 'Fees are charged monthly and vary by course. The Basic Arabic Course is INR 1,000/month, Urdu Foundations is INR 800/month, and the Intermediate Arabic course is INR 1,200/month.', 'Enrollment', 6),
      ('What if I miss a class?', 'We understand life gets busy. Every class is recorded, and recordings are shared with all enrolled students. You will never miss a lesson.', 'Classes', 7),
      ('Can I join from outside India?', 'Absolutely! We have students from the UAE, Canada, UK, USA, and many other countries. Classes are on Zoom, so you can join from anywhere in the world.', 'General', 8),
      ('How do I enroll?', 'Simply visit the course page, click "Enroll Now" or "Book Free Trial", fill in your details, and our team will contact you on WhatsApp within minutes to confirm your spot.', 'Enrollment', 9)
  `);
  console.log("✅ 9 FAQs inserted");

  await pool.end();
  console.log("🎉 Neon Database Seeded Successfully!");
}

masterSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
