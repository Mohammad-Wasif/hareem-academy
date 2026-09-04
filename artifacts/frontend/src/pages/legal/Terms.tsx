import { SEO } from "@/components/SEO";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import {
  ShieldCheck,
  BookOpen,
  Sparkles,
  CreditCard,
  CalendarX,
  Clock,
  HeartHandshake,
  Lock,
  FileText,
  RotateCcw,
  AlertTriangle,
  Globe,
  Share2,
  RefreshCw,
  Scale,
  Mail,
  Star,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Terms() {
  const { whatsappNumber, whatsappUrl } = useWhatsApp();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        "name": "Terms of Service",
        "item": "https://hareemacademy.com/terms"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased pattern-bg pt-10 pb-24">
      <SEO
        title="Terms of Service"
        description="Terms of Service and student code of conduct guidelines for Hareem Academy live online classes."
        schema={breadcrumbSchema}
      />

      <style>{`
        .pattern-bg {
          background-image: radial-gradient(circle at 2px 2px, rgba(0, 53, 39, 0.05) 1px, transparent 0);
          background-size: 32px 32px;
        }
        .soft-glow-shadow {
          box-shadow: 0 24px 48px -12px rgba(0, 53, 39, 0.08);
        }
      `}</style>

      <main className="max-w-3xl mx-auto px-4 md:px-0">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="font-serif font-bold text-2xl md:text-4xl text-[#003527] mb-3">
            Terms of Service
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#404944] font-medium">
            Last Updated: {lastUpdated}
          </p>
          <div className="h-1 w-20 bg-[#cca72f] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content Canvas */}
        <div className="bg-white rounded-2xl p-6 md:p-10 soft-glow-shadow border border-gray-200/80 space-y-10">
          {/* Welcome Intro */}
          <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed pb-4 border-b border-gray-200/80">
            <p>
              Welcome to Hareem Academy. These Terms of Service govern your use of our website and participation in our courses and live online classes. By using our website, booking a trial class, or enrolling in a course, you agree to these Terms.
            </p>
            <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f] mt-3">
              <p className="font-bold text-[#003527] text-xs md:text-sm">
                If you do not agree with these Terms, please do not use our services or enroll in our courses.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              1. Eligibility & Female-Only Policy
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy provides courses exclusively for girls and women.
              </p>
              <p>
                By booking a trial or enrolling in a course, you confirm that the student participating in the class is female.
              </p>
              <p className="font-semibold text-[#003527]">
                To protect the privacy and comfort of our students and teachers:
              </p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Male individuals are not permitted to attend or participate in live classes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Students should not share class links or access details with anyone else.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Parents or guardians may communicate with our team regarding a student's enrollment where appropriate, but should not attend live classes unless specifically permitted by the academy.</span>
                </li>
              </ul>
              <p>
                We reserve the right to take appropriate action if this policy is violated.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              2. Course Enrollment
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Students may enroll by completing the enrollment process provided on our website or through our academy team.
              </p>
              <p>
                Enrollment is confirmed only after the required information has been submitted and the applicable course fee has been paid or an alternative payment arrangement has been agreed upon with Hareem Academy.
              </p>
              <p>
                A student's place in a batch may be subject to availability.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              3. Free Trial Classes
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy may offer a free trial class for eligible courses.
              </p>
              <p>
                A trial class is intended to allow prospective students to experience the teaching style and class environment before enrolling.
              </p>
              <p>
                Participation in a trial class does not guarantee admission to a particular batch. Enrollment remains subject to course availability.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              4. Course Fees & Payments
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Course fees are communicated on the relevant course page or by our academy team.
              </p>
              <p className="font-semibold text-[#003527]">Unless otherwise agreed:</p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Course fees must be paid according to the payment schedule communicated at enrollment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Monthly fees must be paid on time to continue attending classes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Hareem Academy may restrict or suspend access to classes if required payments remain unpaid.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Any applicable payment processing charges or transaction-related fees will be communicated where relevant.</span>
                </li>
              </ul>
              <p>
                Fees and pricing may change for future enrollments. Any applicable changes will be communicated before they take effect for existing students.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <CalendarX className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              5. Attendance & Missed Classes
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Students are expected to attend classes regularly and arrive on time.
              </p>
              <p>
                If a student is unable to attend a class, the student or parent/guardian should inform the academy where reasonably possible.
              </p>
              <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f]">
                <p className="font-bold text-[#003527] text-xs md:text-sm">
                  Regular classes are not recorded, and missed classes generally cannot be replayed or rescheduled.
                </p>
              </div>
              <p>
                Students are responsible for keeping up with the course material covered during an absence.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              6. Class Timings & Schedule Changes
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Course timings are provided on the relevant course page or communicated during enrollment.
              </p>
              <p>
                Hareem Academy may occasionally need to change a class time, teacher, batch arrangement, or schedule due to circumstances such as teacher availability, technical issues, holidays, or other operational requirements.
              </p>
              <p>
                We will make reasonable efforts to inform students of significant changes in advance.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <HeartHandshake className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              7. Student Code of Conduct
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Students are expected to maintain respectful and appropriate Islamic adab (etiquette) during classes and in all communications with teachers, staff, and fellow students.
              </p>
              <p className="font-semibold text-[#003527]">Students must:</p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Treat teachers and fellow students respectfully.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Avoid abusive, offensive, discriminatory, threatening, or inappropriate language or behavior.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Avoid intentionally disrupting classes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Follow reasonable instructions from teachers and academy staff.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Respect the privacy of other students and teachers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#cca72f] mt-0.5 flex-shrink-0" />
                  <span>Not share another student's personal information, messages, images, or class-related content without permission.</span>
                </li>
              </ul>
              <p>
                Serious or repeated violations may result in suspension or removal from the course.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Lock className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              8. Class Privacy & Access
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Class links and access information are provided for the enrolled student or approved trial participant only.
              </p>
              <p className="font-semibold text-[#003527]">Students must not:</p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Share class links with others.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Allow unauthorized individuals to join a class.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Record, photograph, screenshot, or distribute live classes or other students without permission.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Share private information about teachers or students outside the academy.</span>
                </li>
              </ul>
              <p>
                These rules exist to maintain a comfortable and private learning environment for everyone.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              9. Course Materials & Intellectual Property
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                All original course materials provided by Hareem Academy, including PDFs, notes, worksheets, lesson content, graphics, and other educational resources, are intended for the student's personal educational use.
              </p>
              <div className="bg-[#f2f4f6] p-5 rounded-xl border-l-4 border-[#cca72f]">
                <p className="font-sans text-[11px] font-bold text-[#003527] uppercase tracking-wider mb-1.5">
                  Usage Restriction
                </p>
                <p className="mb-1.5 text-xs md:text-sm">Students may not, without written permission from Hareem Academy:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Copy or reproduce course materials for commercial purposes.</li>
                  <li>Sell, distribute, or publish our materials.</li>
                  <li>Upload materials to public websites or social media.</li>
                  <li>Use our course materials to provide competing paid services.</li>
                </ul>
              </div>
              <p>
                Nothing in these Terms prevents students from using course materials for their own personal learning.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              10. Refunds & Cancellations
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Refunds and cancellations are subject to Hareem Academy's Refund Policy.
              </p>
              <p>
                Please review the Refund Policy before making a payment.
              </p>
              <p>
                Where a refund is applicable, it will be processed according to the conditions and timelines stated in that policy.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              11. Suspension or Termination
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy may suspend or terminate a student's enrollment where reasonably necessary, including in cases of:
              </p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Repeated non-payment of fees</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Serious or repeated misconduct</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Violation of the female-only policy</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Unauthorized sharing or distribution of course materials</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Unauthorized access to classes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Behavior that compromises the safety, privacy, or comfort of teachers or students</span>
                </li>
              </ul>
              <p>
                Where appropriate, we may provide a warning or opportunity to resolve an issue before termination.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              12. Website Use
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>You agree to use the Hareem Academy website responsibly and lawfully.</p>
              <p className="font-semibold text-[#003527]">You must not attempt to:</p>
              <ul className="list-none space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Gain unauthorized access to our website or systems.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Interfere with website functionality.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Upload malicious or harmful content.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                  <span>Misuse forms, communication channels, or other website features.</span>
                </li>
              </ul>
              <p>
                We may modify, suspend, or discontinue parts of the website when necessary.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              13. Third-Party Services
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Our courses and services may use third-party platforms such as Google Meet, WhatsApp, payment providers, hosting services, or other technology providers.
              </p>
              <p>
                Your use of those services may also be subject to the third party's own terms and policies.
              </p>
              <p>
                Hareem Academy is not responsible for the independent operation, availability, or policies of third-party services.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              14. Changes to These Terms
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                We may update these Terms of Service from time to time to reflect changes to our courses, services, website, or applicable requirements.
              </p>
              <p>
                When we make changes, we will update the "Last Updated" date at the top of this page.
              </p>
              <p>
                For significant changes that affect existing students, we will make reasonable efforts to provide notice.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Scale className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              15. Disclaimer
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy aims to provide high-quality educational services, but learning outcomes may vary between students depending on factors such as attendance, participation, practice, and individual learning ability.
              </p>
              <p>
                We do not guarantee a particular level of proficiency or result within a specific period.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              16. Contact Us
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                If you have questions regarding these Terms of Service, your enrollment, or any of our courses, please contact us:
              </p>
              <div className="bg-[#f8f9fa] p-5 rounded-xl border border-gray-200 space-y-1.5">
                <p className="font-bold text-[#003527] text-base font-serif">Hareem Academy</p>
                <p>
                  Email:{" "}
                  <a href="mailto:hareem.educational.academy@gmail.com" className="text-[#007165] font-semibold underline">
                    hareem.educational.academy@gmail.com
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#007165] font-semibold underline">
                    {whatsappNumber}
                  </a>
                </p>
                <p>
                  Website:{" "}
                  <a href="https://hareemacademy.com" className="text-[#007165] font-semibold underline">
                    hareemacademy.com
                  </a>
                </p>
              </div>
              <p className="font-semibold text-[#003527] pt-1">
                By using our website, booking a trial class, or enrolling in a Hareem Academy course, you acknowledge that you have read and agreed to these Terms of Service.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-10 text-center space-y-3">
          <p className="font-sans text-xs md:text-sm text-[#404944]">
            If you have any questions regarding these terms, please contact our administrative team.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#003527] text-white font-sans font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200 shadow-md cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4 text-[#62fae3]" />
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </main>
    </div>
  );
}
