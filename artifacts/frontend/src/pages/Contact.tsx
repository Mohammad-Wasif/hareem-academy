import { useState } from "react";
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
import { WHATSAPP_URL } from "@/components/CTAGroup";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const createContact = useCreateContactMessage();
  const [isSuccess, setIsSuccess] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Emotional hook */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            {t("contact.hero.label", "Talk to a sister")}
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground">
            {t("contact.hero.title_part1", "We're here. We listen.")}
            <br /> {t("contact.hero.title_part2", "No judgment.")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("contact.hero.subtitle", "Whether you're nervous to start, unsure which course fits, or just want to ask a sister — message us. We reply on WhatsApp within minutes.")}
          </p>
        </div>

        {/* WhatsApp-first CTA banner */}
        <div className="max-w-3xl mx-auto mb-16">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25D366] hover:bg-[#128C7E] text-white rounded-3xl p-7 md:p-9 transition-colors shadow-xl shadow-[#25D366]/25 group"
          >
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-9 h-9" />
              </div>
              <div className="flex-1">
                <div className="font-serif font-bold text-2xl md:text-3xl mb-1">
                  {t("contact.whatsapp_cta.title", "Chat with us on WhatsApp")}
                </div>
                <p className="text-white/90 text-sm">
                  {t("contact.whatsapp_cta.subtitle", "+91 9315118289 — fastest way to reach us. Most messages answered in under 5 minutes.")}
                </p>
              </div>
              <div className="bg-white text-[#128C7E] font-bold px-5 py-2.5 rounded-full text-sm whitespace-nowrap">
                {t("contact.whatsapp_cta.btn", "Open chat →")}
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Form (secondary) */}
          <div className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-bold text-2xl text-foreground">
                {t("contact.form.title", "Or send a quick message")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t("contact.form.subtitle", "Prefer not to use WhatsApp? Drop us a line below.")}
            </p>

            {isSuccess ? (
              <div className="text-center py-12 space-y-5">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-primary">{t("contact.form.success.title", "Message sent!")}</h3>
                <p className="text-muted-foreground">
                  {t("contact.form.success.subtitle", "A sister from our team will get back to you shortly, in shaa Allah.")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsSuccess(false);
                  }}
                  className="rounded-full"
                >
                  {t("contact.form.success.btn", "Send another")}
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
                        <FormLabel>{t("contact.form.fields.name.label", "Your name *")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.form.fields.name.placeholder", "Sister Aisha")} {...field} />
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
                        <FormLabel>{t("contact.form.fields.whatsapp.label", "WhatsApp number *")}</FormLabel>
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
                          {t("contact.form.fields.email.label", "Email")} <span className="text-xs">({t("contact.form.fields.email.optional", "optional")})</span>
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
                        <FormLabel>{t("contact.form.fields.message.label", "How can we help? *")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("contact.form.fields.message.placeholder", "Type your question here...")}
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
                    {createContact.isPending ? t("contact.form.btn_sending", "Sending...") : t("contact.form.btn", "Send Message")}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {t("contact.form.footer", "We reply within 24 hours. For girls & women only.")}
                  </p>
                </form>
              </Form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-6">
                {t("contact.others.title", "Other ways to reach us")}
              </h2>
              <div className="space-y-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors border border-[#25D366]/20"
                >
                  <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">+91 9315118289</p>
                    <p className="text-xs text-[#128C7E] font-medium mt-1">
                      ⚡ {t("contact.others.fastest", "Fastest response")}
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
                    <h3 className="font-bold text-foreground">{t("contact.others.email", "Email")}</h3>
                    <p className="text-sm text-muted-foreground">salam@hareemacademy.com</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("contact.others.email_footer", "Reply within 24 hours")}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{t("contact.others.location.title", "Where we are")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.others.location.desc", "Online worldwide. Based in India.")}
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
                    {t("contact.hours.title", "Working hours")}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {t("contact.hours.desc", "Monday to Saturday, 9 AM – 6 PM (IST). WhatsApp messages outside hours get a reply first thing next morning.")}
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
