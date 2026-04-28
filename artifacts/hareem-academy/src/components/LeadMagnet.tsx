import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreateLead } from "@workspace/api-client-react";
import { CreateLeadBody } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function LeadMagnet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createLead = useCreateLead();

  const form = useForm({
    resolver: zodResolver(CreateLeadBody),
    defaultValues: {
      whatsappNumber: "",
      source: "alphabet-pdf",
    },
  });

  useEffect(() => {
    const dismissed = localStorage.getItem("lead-magnet-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000); // 15 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("lead-magnet-dismissed", "true");
  };

  const onSubmit = (data: any) => {
    createLead.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          localStorage.setItem("lead-magnet-dismissed", "true");
        },
        onError: () => {
          toast.error("Failed to submit. Please try again.");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-full max-w-sm">
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden shadow-primary/5">
        <div className="bg-primary/5 p-4 border-b border-primary/10 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg">Free Arabic PDF</h4>
              <p className="text-xs text-muted-foreground">Start your journey today</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h5 className="font-bold text-primary">Sent!</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll message you the PDF shortly on WhatsApp.
                </p>
              </div>
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer">
                  Continue on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground/80">
                Get our beautiful beginner's guide to the Arabic alphabet. Just drop your WhatsApp number.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="WhatsApp Number (with code)" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={createLead.isPending}
                  >
                    {createLead.isPending ? "Sending..." : "Get Free PDF"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
