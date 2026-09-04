import { SEO } from "@/components/SEO";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import {
  Sparkles,
  CreditCard,
  UserX,
  AlertCircle,
  Ban,
  BookOpen,
  RotateCcw,
  Mail,
  RefreshCw,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Refund() {
  const { whatsappNumber, whatsappUrl } = useWhatsApp();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased pattern-bg pt-10 pb-24">
      <SEO
        title="Refund Policy | Hareem Academy"
        description="Refund Policy and enrollment cancellation guidelines for Hareem Academy."
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
            Refund Policy
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
              At Hareem Academy, we aim to provide a clear and supportive learning experience. Please review this Refund Policy before making a payment or enrolling in a course.
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              1. Free Trial Classes
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Where a free trial is available, we encourage students to attend the trial class and clarify any questions with our team before enrolling.
              </p>
              <p>
                A free trial allows you to experience the teaching style, class environment, and course format before making a payment.
              </p>
              <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f]">
                <p className="font-bold text-[#003527] text-xs md:text-sm">
                  Once you choose to enroll and make a payment, the terms below will apply.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              2. Monthly Course Fees
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Course fees are generally charged on a monthly basis unless otherwise agreed at the time of enrollment.
              </p>
              <p>
                Once a monthly billing period has started and the payment has been made, the fee for that month is generally non-refundable.
              </p>
              <p>
                If you decide to discontinue your course, please inform Hareem Academy before the next billing cycle begins. You will not be charged for the following month once your cancellation has been confirmed.
              </p>
              <p>
                Missing individual classes does not normally qualify for a partial refund or reduction in the monthly fee.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <UserX className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              3. Cancellation by the Student
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Students may choose to discontinue their enrollment by informing our team before the next billing cycle.
              </p>
              <p>
                Cancellation of enrollment does not automatically entitle a student to a refund for the current month once that month's classes have commenced.
              </p>
              <p>
                Any exceptional refund request will be considered according to the circumstances described below.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              4. Exceptional Circumstances
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                If a student is unable to continue the course due to a serious and unexpected personal or medical emergency shortly after making a payment, they may contact us to request consideration for a refund.
              </p>
              <p>
                Such requests will be reviewed case-by-case and are subject to the discretion of Hareem Academy.
              </p>
              <p>
                Approval of one exceptional refund does not establish a general entitlement to refunds in similar circumstances.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Ban className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              5. Cancellation or Closure by Hareem Academy
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                If Hareem Academy permanently cancels a course or batch and is unable to provide the remaining classes, students will receive a refund for the unused portion of the fees already paid, where applicable.
              </p>
              <p>
                If an alternative batch, schedule, or suitable arrangement is offered instead, students may choose from the available options.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              6. Free Trial & Enrollment
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Attending a free trial does not create any payment obligation.
              </p>
              <div className="bg-[#f2f4f6] p-4 rounded-xl border-l-4 border-[#cca72f]">
                <p className="font-bold text-[#003527] text-xs md:text-sm">
                  However, once a student voluntarily enrolls and makes a payment, the applicable course and refund terms become effective.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              7. Refund Processing
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Where a refund is approved, Hareem Academy will process it using the original payment method where reasonably possible.
              </p>
              <p>
                The time taken for the refunded amount to appear in the student's account may depend on the payment provider or bank.
              </p>
              <p>
                Any applicable transaction or payment-processing charges that cannot be recovered may be deducted from the refund where this has been communicated to the student.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              8. How to Request a Refund or Cancellation
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                To request a cancellation or discuss a refund, please contact our team:
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
                Please include your name, enrolled course, and the reason for your request so that our team can review it appropriately.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-4 flex items-center gap-3">
              <span className="bg-[#064e3b] text-[#62fae3] p-2 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              9. Changes to This Refund Policy
            </h2>
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#404944] leading-relaxed">
              <p>
                Hareem Academy may update this Refund Policy from time to time.
              </p>
              <p>
                Any changes will be reflected by updating the "Last Updated" date at the top of this page.
              </p>
              <p>
                The refund terms applicable to a payment will generally be those communicated and accepted at the time of that enrollment or payment, subject to applicable law.
              </p>
              <p className="font-semibold text-[#003527] pt-1">
                If you have questions about our refund or cancellation policy, please contact the Hareem Academy team before making a payment.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-10 text-center space-y-3">
          <p className="font-sans text-xs md:text-sm text-[#404944]">
            If you have any questions regarding refunds, please contact our administrative team.
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
