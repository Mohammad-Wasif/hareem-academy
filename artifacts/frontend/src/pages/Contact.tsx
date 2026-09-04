import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContactMessage, CreateContactMessageBody } from "@workspace/api-client-react";
import { Mail, Clock, Send, Headset, CheckCircle2 } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { SEO } from "@/components/SEO";

export default function Contact() {
  const createContact = useCreateContactMessage();
  const [isSuccess, setIsSuccess] = useState(false);
  const { whatsappNumber, whatsappUrl } = useWhatsApp();

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
        "name": "Contact Us",
        "item": "https://hareemacademy.com/contact"
      }
    ]
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Hareem Academy",
    "url": "https://hareemacademy.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Hareem Academy",
      "telephone": "+91-9315118289",
      "email": "admissions@hareemacademy.com",
      "url": "https://hareemacademy.com"
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateContactMessageBody),
    defaultValues: {
      fullName: "",
      email: "",
      whatsappNumber: "",
      subject: "enrollment",
      message: "",
    },
  });

  const onSubmit = (data: any) => {
    createContact.mutate(
      { data },
      {
        onSuccess: () => setIsSuccess(true),
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans">
      <SEO
        title="Contact Us"
        description="Connect with Hareem Academy. Message us on WhatsApp or fill out our contact form — we reply within minutes."
        keywords={[
          "contact hareem academy",
          "hareem academy whatsapp",
          "enroll in arabic class",
          "book free trial arabic",
          "female arabic admissions",
          "sisters online academy contact"
        ]}
        schema={[breadcrumbSchema, contactPageSchema]}
      />

      <main className="flex-grow w-full px-4 md:px-12 max-w-[1280px] mx-auto py-10 md:py-16 space-y-10 md:space-y-14">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10">
            Contact Us
          </span>
          <h1 className="font-serif font-bold text-2xl md:text-4xl text-[#00450d]">
            We're here. We listen. No judgment.
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#41493e] leading-relaxed">
            Whether you're nervous to start, unsure which course fits, or just want to ask a sister — message us. We reply on WhatsApp within minutes.
          </p>
        </section>

        {/* Bento Grid Layout for Contact */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Contact Information Cards (Left Col) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Student Support Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_-8px_rgba(0,53,39,0.06)] border border-gray-200/80 flex gap-5 items-start hover:-translate-y-1 transition-all duration-300">
              <div className="bg-[#62fae3] text-[#007165] p-3.5 rounded-full flex-shrink-0 shadow-xs">
                <Headset className="w-5 h-5" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-serif font-bold text-lg text-[#00450d]">
                  Student Support
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#41493e] leading-relaxed">
                  Our dedicated team is ready to help you with enrollments and platform inquiries.
                </p>
                <div className="space-y-1.5 pt-1 font-sans text-xs md:text-sm font-semibold">
                  <a
                    href="mailto:hareem.educational.academy@gmail.com"
                    className="flex items-center gap-2.5 text-[#00450d] hover:text-[#007165] transition-colors break-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#007165] flex-shrink-0" />
                    hareem.educational.academy@gmail.com
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[#00450d] hover:text-[#007165] transition-colors"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                    {whatsappNumber} (WhatsApp)
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-[#f2f4f6] rounded-2xl p-6 border border-gray-200 flex gap-5 items-start">
              <div className="bg-[#cca72f] text-[#4e3d00] p-3.5 rounded-full flex-shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2.5 w-full">
                <h3 className="font-serif font-bold text-lg text-[#00450d]">
                  Office Hours
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#41493e]">
                  We aim to respond to all inquiries within 24 hours during working days.
                </p>
                <ul className="space-y-1.5 font-sans text-xs text-[#41493e]">
                  <li className="flex justify-between border-b border-gray-200/80 pb-1">
                    <span className="font-medium">Mon - Fri:</span>
                    <span className="font-bold text-[#00450d]">9:00 AM - 6:00 PM (IST)</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200/80 pb-1">
                    <span className="font-medium">Saturday:</span>
                    <span className="font-bold text-[#00450d]">10:00 AM - 2:00 PM (IST)</span>
                  </li>
                  <li className="flex justify-between text-gray-400">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_-8px_rgba(0,53,39,0.06)] border border-gray-200/80 flex flex-col items-center text-center gap-3">
              <h4 className="font-sans text-[11px] font-bold text-[#41493e] uppercase tracking-wider">
                Connect With Us
              </h4>
              <div className="flex gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f2f4f6] text-[#00450d] p-2.5 rounded-full hover:bg-[#00450d] hover:text-white transition-all shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f2f4f6] text-[#00450d] p-2.5 rounded-full hover:bg-[#00450d] hover:text-white transition-all shadow-xs"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f2f4f6] text-[#00450d] p-2.5 rounded-full hover:bg-[#00450d] hover:text-white transition-all shadow-xs"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Col) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_-8px_rgba(0,53,39,0.06)] border border-gray-200/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(#e0e3e5_1px,transparent_1px)] [background-size:20px_20px] opacity-50 rounded-bl-full pointer-events-none" />
            
            <h2 className="font-serif font-bold text-xl md:text-2xl text-[#00450d] mb-6 relative z-10">
              Send us a Message
            </h2>

            {isSuccess ? (
              <div className="text-center py-12 space-y-5 relative z-10">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#00450d]">
                  Message Sent Successfully!
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#41493e] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our team will contact you shortly, in shaa Allah.
                </p>
                <button
                  onClick={() => {
                    reset();
                    setIsSuccess(false);
                  }}
                  className="font-sans font-bold text-xs bg-[#00450d] text-white px-7 py-3 rounded-xl hover:bg-[#00450d]/90 transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#41493e]" htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="e.g. Sister Aisha"
                      className="bg-[#f8f9fa] border border-gray-300 rounded-xl px-3.5 py-2.5 font-sans text-xs md:text-sm text-[#191c1d] w-full focus:outline-none focus:border-[#007165] focus:ring-2 focus:ring-[#62fae3]/40 transition-all"
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-red-500">{errors.fullName.message as string}</span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-bold text-[#41493e]" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className="bg-[#f8f9fa] border border-gray-300 rounded-xl px-3.5 py-2.5 font-sans text-xs md:text-sm text-[#191c1d] w-full focus:outline-none focus:border-[#007165] focus:ring-2 focus:ring-[#62fae3]/40 transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp Number Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold text-[#41493e]" htmlFor="whatsappNumber">
                    WhatsApp Number *
                  </label>
                  <input
                    id="whatsappNumber"
                    {...register("whatsappNumber")}
                    placeholder="+91 9315..."
                    className="bg-[#f8f9fa] border border-gray-300 rounded-xl px-3.5 py-2.5 font-sans text-xs md:text-sm text-[#191c1d] w-full focus:outline-none focus:border-[#007165] focus:ring-2 focus:ring-[#62fae3]/40 transition-all"
                  />
                  {errors.whatsappNumber && (
                    <span className="text-[11px] text-red-500">{errors.whatsappNumber.message as string}</span>
                  )}
                </div>

                {/* Subject Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold text-[#41493e]" htmlFor="subject">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    {...register("subject")}
                    className="bg-[#f8f9fa] border border-gray-300 rounded-xl px-3.5 py-2.5 font-sans text-xs md:text-sm text-[#191c1d] w-full focus:outline-none focus:border-[#007165] focus:ring-2 focus:ring-[#62fae3]/40 transition-all cursor-pointer"
                  >
                    <option value="enrollment">Course Enrollment</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">General Feedback</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold text-[#41493e]" htmlFor="message">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("message")}
                    placeholder="How can we help you today?"
                    className="bg-[#f8f9fa] border border-gray-300 rounded-xl px-3.5 py-2.5 font-sans text-xs md:text-sm text-[#191c1d] w-full focus:outline-none focus:border-[#007165] focus:ring-2 focus:ring-[#62fae3]/40 transition-all resize-y"
                  />
                  {errors.message && (
                    <span className="text-[11px] text-red-500">{errors.message.message as string}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createContact.isPending}
                  className="w-full bg-[#00450d] text-white font-sans font-bold text-xs md:text-sm py-3.5 rounded-xl hover:bg-[#00450d]/90 transition-all shadow-md shadow-[#00450d]/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{createContact.isPending ? "Sending..." : "Send Message"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <p className="text-center font-sans text-[11px] text-gray-500 mt-3">
                  By sending a message, you agree to our{" "}
                  <a href="/privacy" className="text-[#00450d] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
