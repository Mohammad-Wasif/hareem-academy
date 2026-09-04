import { SEO } from "@/components/SEO";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import {
  FolderKanban,
  Sliders,
  MessageSquare,
  Video,
  ShieldCheck,
  Share2,
  Lock,
  History,
  CheckSquare,
  UserPlus,
  Cookie,
  ExternalLink,
  RefreshCw,
  Mail,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Privacy() {
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
        "name": "Privacy Policy",
        "item": "https://hareemacademy.com/privacy"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased pattern-bg pt-10 pb-24">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy and data protection guidelines for Hareem Academy students and visitors, guaranteeing a secure sisters-only learning environment."
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
            Privacy Policy
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#404944] font-medium">
            Last Updated: {lastUpdated}
          </p>
          <div className="h-1 w-20 bg-[#cca72f] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content Canvas */}
        <div className="bg-white rounded-2xl p-6 md:p-10 soft-glow-shadow border border-gray-200/80 space-y-10">
          {/* Intro Section */}
          <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed pb-4 border-b border-gray-200/80">
            <p>
              At Hareem Academy, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, why we collect it, how we use it, and how we protect it when you use our website, contact us, or enroll in our courses.
            </p>
            <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f] mt-3">
              <p className="font-bold text-[#003527] text-xs md:text-sm">
                Hareem Academy provides online Arabic and Urdu classes exclusively for girls and women.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <FolderKanban className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              1. Information We Collect
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Depending on how you interact with Hareem Academy, we may collect information such as:
              </p>
              <ul className="list-none space-y-2 pl-1">
                {[
                  "Name",
                  "WhatsApp or mobile number",
                  "Email address",
                  "Age or age group",
                  "Location or country",
                  "Course and learning preferences",
                  "Information you provide when contacting us or requesting a free trial",
                  "Enrollment and payment-related information, where applicable",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                We only request information that is reasonably necessary to respond to your inquiry, process enrollment, provide our services, and communicate with you.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sliders className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              2. How We Use Your Information
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>We may use your information to:</p>
              <ul className="list-none space-y-2 pl-1">
                {[
                  "Process and manage course enrollment",
                  "Arrange free trial classes",
                  "Communicate with you regarding classes, schedules, and enrollment",
                  "Provide course-related information and updates",
                  "Respond to questions and support requests",
                  "Manage student communication through WhatsApp, email, or other communication channels",
                  "Process payments where applicable",
                  "Improve our courses, website, and services",
                  "Maintain appropriate student and administrative records",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                We do not use your personal information for unrelated purposes without an appropriate basis or your permission where required.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              3. WhatsApp and Other Communication
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                If you contact Hareem Academy through WhatsApp, your messages and contact information may be processed through WhatsApp's services.
              </p>
              <p className="font-semibold text-[#003527]">We may use WhatsApp to communicate with you about:</p>
              <ul className="list-none space-y-2 pl-1">
                {[
                  "Free trial classes",
                  "Enrollment",
                  "Course timings",
                  "Payments",
                  "Class-related updates",
                  "Questions and support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Please avoid sending sensitive personal information through WhatsApp unless it is necessary for your interaction with us.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Video className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              4. Online Classes
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Our classes are conducted live through Google Meet or another online meeting platform specified for your course.
              </p>
              <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f]">
                <p className="font-bold text-[#003527] text-xs md:text-sm">
                  We do not record our regular classes.
                </p>
              </div>
              <p>
                Students may be required to use their name and relevant account information to join an online class. Meeting links and class information are intended only for enrolled students or approved trial participants and should not be shared with others.
              </p>
              <p>
                Because online classes use third-party platforms, their own privacy policies and terms may also apply.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              5. Female-Only Learning Environment
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy is designed exclusively for girls and women.
              </p>
              <p>
                We take reasonable steps to maintain a comfortable and private learning environment. Student information, contact details, and enrollment information are treated as confidential and are accessed only by people who need the information to operate the academy or provide services to you.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              6. Sharing of Personal Information
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                We do not sell, rent, or trade your personal information.
              </p>
              <p>
                We may share limited information with trusted service providers when necessary to operate Hareem Academy, such as:
              </p>
              <ul className="list-none space-y-2 pl-1">
                {[
                  "Online meeting platforms used for classes",
                  "Communication platforms such as WhatsApp",
                  "Payment service providers, where applicable",
                  "Website, hosting, or technical service providers, where necessary",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                These providers may process information according to their own terms and privacy policies.
              </p>
              <p>
                We may also disclose information where required by applicable law, regulation, legal process, or a lawful government request.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Lock className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              7. Data Security
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                We take reasonable technical and organisational measures to protect personal information from unauthorized access, misuse, alteration, disclosure, or loss.
              </p>
              <p>
                However, no method of transmitting or storing information online can be guaranteed to be completely secure. We therefore cannot guarantee absolute security of information transmitted over the internet.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <History className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              8. How Long We Keep Your Information
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including providing courses, managing enrollment, maintaining necessary records, resolving disputes, and meeting applicable legal or administrative requirements.
              </p>
              <p>
                When information is no longer required, we may delete it or take reasonable steps to anonymize it.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              9. Your Choices and Rights
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Depending on applicable law, you may have rights relating to your personal information, including the ability to:
              </p>
              <ul className="list-none space-y-2 pl-1">
                {[
                  "Ask what personal information we hold about you",
                  "Request correction of inaccurate information",
                  "Request deletion of information where applicable",
                  "Withdraw consent where processing is based on consent",
                  "Raise a concern or complaint about how your information is handled",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#007165] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                To make a privacy-related request, please contact us using the details provided below.
              </p>
              <p>
                We may need to verify your identity before processing certain requests.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              10. Information Relating to Minors
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy is intended for girls and women. Where a student is under the applicable age of majority or is otherwise considered a child under applicable law, we may require a parent or legal guardian to provide or authorise the necessary information and enrollment.
              </p>
              <p>
                We do not knowingly seek unnecessary personal information from children.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Cookie className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              11. Cookies and Website Information
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Our website may use cookies or similar technologies that are necessary for website functionality, security, performance, or understanding how visitors use the website.
              </p>
              <p>
                Where applicable, information collected through these technologies may include browser type, device information, pages visited, and basic website usage information.
              </p>
              <p>
                We do not use such information to sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              12. External Links
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Our website may contain links to third-party websites or services, such as WhatsApp or online meeting platforms.
              </p>
              <p>
                We are not responsible for the privacy practices, content, or security of third-party websites. We encourage you to review their respective privacy policies before providing personal information.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              13. Changes to This Privacy Policy
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time to reflect changes to our services, technology, or applicable legal requirements.
              </p>
              <p>
                When we make changes, we will update the “Last Updated” date at the top of this page.
              </p>
              <p>
                We encourage you to review this page periodically for the latest information about how we handle personal data.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              14. Contact Us
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
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
              <p>
                We will make reasonable efforts to respond to privacy-related requests and concerns.
              </p>
              <p className="font-semibold text-[#003527] pt-1">
                By using our website or providing your information to Hareem Academy, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-10 text-center space-y-3">
          <p className="font-sans text-xs md:text-sm text-[#404944]">
            If you have any questions regarding your privacy, please contact our administrative team.
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
