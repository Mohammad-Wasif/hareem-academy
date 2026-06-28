import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContactMessage } from "@workspace/api-client-react";
import { CreateContactMessageBody } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, MapPin, CheckCircle2, MessageCircle, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { SEO } from "@/components/SEO";

export default function Contact() {
  const createContact = useCreateContactMessage();
  const [isSuccess, setIsSuccess] = useState(false);
  const { whatsappNumber, whatsappUrl } = useWhatsApp();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    adminApi.getLandingPage("contact")
      .then((data) => {
        if (data && data.config) {
          setPageData({
            title: data.title,
            metaDescription: data.metaDescription || "",
            ...data.config,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load contact overrides:", err);
      });
  }, []);

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
        "name": "Contact",
        "item": "https://hareemacademy.com/contact"
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hareem Academy",
    "image": "https://hareemacademy.com/premium-hero-showcase.png",
    "telePhone": "+91-9315118289",
    "url": "https://hareemacademy.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110025",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.56,
      "longitude": 77.29
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };

  const form = useForm({
    resolver: zodResolver(CreateContactMessageBody),
    defaultValues: {
      fullName: "",
      email: "",
      whatsappNumber: "",
      subject: "Question about Hareem Academy",
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

  const computedFont =
    pageData?.theme?.fontFamily === "sans"
      ? "font-sans"
      : pageData?.theme?.fontFamily === "mono"
      ? "font-mono"
      : "font-serif";

  const sizeClass =
    pageData?.theme?.baseFontSize === "lg"
      ? "text-lg"
      : pageData?.theme?.baseFontSize === "sm"
      ? "text-sm"
      : "text-base";

  const primaryColor = pageData?.theme?.primaryColor || "#0F4D36";
  const accentColor = pageData?.theme?.accentColor || "#ECC565";
  const backgroundColor = pageData?.theme?.backgroundColor || "#FDFCF7";

  return (
    <div 
      className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${computedFont} ${sizeClass}`}
      style={pageData?.theme ? { backgroundColor } as React.CSSProperties : undefined}
    >
      <SEO
        title={pageData?.title || "Contact Us"}
        description={pageData?.metaDescription || "Have questions about batch timings, fee structures, or learning paths? Connect with a sister from Hareem Academy via WhatsApp or contact form."}
        schema={[breadcrumbSchema, localBusinessSchema]}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Emotional hook */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          <span 
            className="inline-block text-xs font-bold tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {pageData?.geoContext || "Talk to a sister"}
          </span>
          <h1 
            className="font-serif font-bold text-4xl md:text-5xl"
            style={{ color: primaryColor }}
          >
            {pageData?.heroTitle ? (
              pageData.heroTitle
            ) : (
              <>
                We're here. We listen.
                <br /> No judgment.
              </>
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            {pageData?.heroSubtitle || "Whether you're nervous to start, unsure which course fits, or just want to ask a sister — message us. We reply on WhatsApp within minutes."}
          </p>
        </div>

        {/* WhatsApp-first CTA banner */}
        <div className="max-w-3xl mx-auto mb-16">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25D366] hover:bg-[#128C7E] text-white rounded-3xl p-7 md:p-9 transition-colors shadow-xl shadow-[#25D366]/25 group"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-xl sm:text-2xl md:text-3xl mb-1">
                  {pageData?.whatsappCTATitle || "Chat with us on WhatsApp"}
                </div>
                <p className="text-white/90 text-xs sm:text-sm">
                  {pageData?.whatsappCTASubtitle || "+91 9315118289 — fastest way to reach us. Most messages answered in under 5 minutes."}
                </p>
              </div>
              <div className="bg-white text-[#128C7E] font-bold px-5 py-2.5 rounded-full text-sm whitespace-nowrap shrink-0">
                Open chat →
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-20 mb-20">
          {/* Form (secondary) */}
          <div className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5" style={{ color: primaryColor }} />
              <h2 
                className="font-serif font-bold text-2xl"
                style={{ color: primaryColor }}
              >
                {pageData?.formTitle || "Or send a quick message"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {pageData?.formSubtitle || "Prefer not to use WhatsApp? Drop us a line below."}
            </p>

            {isSuccess ? (
              <div className="text-center py-12 space-y-5">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-primary">Message sent!</h3>
                <p className="text-muted-foreground">
                  A sister from our team will get back to you shortly, in shaa Allah.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsSuccess(false);
                  }}
                  className="rounded-full"
                >
                  Send another
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Sister Aisha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9315..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Email <span className="text-xs">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can we help? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your question here..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-base rounded-full h-12 mt-2"
                    disabled={createContact.isPending}
                  >
                    {createContact.isPending ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    We reply within 24 hours. For girls & women only.
                  </p>
                </form>
              </Form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-6">
                Other ways to reach us
              </h2>
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors border border-[#25D366]/20"
                >
                  <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">{whatsappNumber}</p>
                    <p className="text-xs text-[#128C7E] font-medium mt-1">
                      ⚡ Fastest response
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:salam@hareemacademy.com"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card hover:bg-primary/5 transition-colors border border-border"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Email</h3>
                    <p className="text-sm text-muted-foreground">salam@hareemacademy.com</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reply within 24 hours
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Where we are</h3>
                    <p className="text-sm text-muted-foreground">
                      Online worldwide. Based in India.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/15 p-6 rounded-2xl border border-accent/30">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-primary mb-1">
                    Working hours
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Monday to Saturday, 9 AM – 6 PM (IST). WhatsApp messages outside hours get a reply first thing next morning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
