import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import EnrollmentModal from "./EnrollmentModal";

export const WHATSAPP_NUMBER = "919315118289";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Assalamu alaikum, I'd like to know more about Hareem Academy."
)}`;

type Variant = "hero" | "section" | "compact";
type Theme = "light" | "dark";

interface CTAGroupProps {
  variant?: Variant;
  align?: "left" | "center";
  theme?: Theme;
  trialMode?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  defaultCourseSlug?: string;
  showSecondary?: boolean;
}

export default function CTAGroup({
  variant = "section",
  align = "left",
  theme = "light",
  trialMode = true,
  primaryLabel,
  secondaryLabel = "Chat on WhatsApp",
  defaultCourseSlug,
  showSecondary = true,
}: CTAGroupProps) {
  const size =
    variant === "hero"
      ? "h-14 px-7 text-base sm:text-lg"
      : variant === "compact"
        ? "h-10 px-5 text-sm"
        : "h-12 px-6 text-base";

  const align_classes = align === "center" ? "justify-center" : "";

  const primaryButton =
    theme === "dark"
      ? "bg-accent text-primary hover:bg-accent/90 shadow-lg shadow-black/20"
      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20";

  const secondaryButton =
    "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/20";

  const label = primaryLabel ?? (trialMode ? "Book Free Trial" : "Enroll Now");

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${align_classes}`}>
      <EnrollmentModal
        mode={trialMode ? "trial" : "enroll"}
        defaultCourseSlug={defaultCourseSlug}
      >
        <Button
          className={`${size} font-serif rounded-full ${primaryButton} group`}
        >
          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {label}
        </Button>
      </EnrollmentModal>
      {showSecondary && (
        <Button asChild className={`${size} font-serif rounded-full ${secondaryButton}`}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaWhatsapp className="w-5 h-5" />
            {secondaryLabel}
          </a>
        </Button>
      )}
    </div>
  );
}
