import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContactMessage, useListFaqs } from "@workspace/api-client-react";
import { CreateContactMessageBody } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: any) => {
    createContact.mutate(
      { data },
      {
        onSuccess: () => setIsSuccess(true),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-serif font-bold text-5xl text-primary">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our courses? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Contact Form */}
          <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-sm">
            <h2 className="font-serif font-bold text-2xl text-foreground mb-6">Send a Message</h2>
            
            {isSuccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. A sister from our team will get back to you shortly.</p>
                <Button variant="outline" onClick={() => {
                  form.reset();
                  setIsSuccess(false);
                }} className="rounded-full">
                  Send another message
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
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" type="email" {...field} />
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
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help?" {...field} />
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
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Type your message here..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg rounded-full h-12 mt-4"
                    disabled={createContact.isPending}
                  >
                    {createContact.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif font-bold text-3xl text-primary mb-8">Direct Contact</h2>
              <div className="space-y-6">
                <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                  <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center shrink-0">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">WhatsApp Us</h3>
                    <p className="text-muted-foreground">+91 9315118289 (Fastest Response)</p>
                  </div>
                </a>

                <a href="mailto:salam@hareemacademy.com" className="flex items-start gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email Us</h3>
                    <p className="text-muted-foreground">salam@hareemacademy.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Location</h3>
                    <p className="text-muted-foreground">Based in India, serving sisters globally online.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/20 p-8 rounded-3xl border border-accent/30">
              <h3 className="font-serif font-bold text-xl text-primary mb-2">Working Hours</h3>
              <p className="text-foreground/80">
                Our support team is available Monday to Saturday, 9:00 AM to 6:00 PM (IST). We aim to respond to all inquiries within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif font-bold text-3xl text-center text-primary mb-8">Frequently Asked Questions</h2>
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6">
                  <AccordionTrigger className="hover:no-underline font-bold text-left py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground">Loading FAQs...</p>
          )}
        </div>
      </div>
    </div>
  );
}
