import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContactMessage, useListFaqs } from "@workspace/api-client-react";
import { CreateContactMessageBody } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export default function Contact() {
  const { data: faqs = [] } = useListFaqs();
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
            Talk to a sister
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground">
            We're here. We listen.
            <br /> No judgment.
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you're nervous to start, unsure which course fits, or just want to ask
            a sister — message us. We reply on WhatsApp <strong>within minutes</strong>.
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
                  Chat with us on WhatsApp
                </div>
                <p className="text-white/90 text-sm">
                  +91 9315118289 — fastest way to reach us. Most messages answered in
                  under 5 minutes.
                </p>
              </div>
              <div className="bg-white text-[#128C7E] font-bold px-5 py-2.5 rounded-full text-sm whitespace-nowrap">
                Open chat →
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
                Or send a quick message
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Prefer not to use WhatsApp? Drop us a line below.
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
                    Monday to Saturday, 9 AM – 6 PM (IST). WhatsApp messages outside hours
                    get a reply first thing next morning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-2">
                FAQ
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                Quick answers to common questions.
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="hover:no-underline font-bold text-left py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
