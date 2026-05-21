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
      ? "h-12 px-6 text-sm sm:text-base rounded-xl font-sans font-medium"
      : variant === "compact"
        ? "h-9 px-4 text-xs rounded-lg font-sans font-medium"
        : "h-11 px-5 text-sm rounded-lg font-sans font-medium";

  const align_classes = align === "center" ? "justify-center" : "";

  const primaryButton =
    theme === "dark"
      ? "bg-accent text-primary hover:bg-accent/90 shadow-sm shadow-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
      : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer";

  const secondaryButton =
    theme === "dark"
      ? "border border-accent/20 text-accent bg-transparent hover:bg-accent/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      : "border border-primary/20 text-primary bg-transparent hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300";

  const label = primaryLabel ?? (trialMode ? "Book Free Trial" : "Enroll Now");

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${align_classes}`}>
      <EnrollmentModal
        mode={trialMode ? "trial" : "enroll"}
        defaultCourseSlug={defaultCourseSlug}
      >
        <Button
          className={`${size} ${primaryButton} group`}
        >
          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-accent" />
          {label}
        </Button>
      </EnrollmentModal>
      {showSecondary && (
        <Button asChild className={`${size} ${secondaryButton}`}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
            {secondaryLabel}
          </a>
        </Button>
      )}
    </div>
  );
}
