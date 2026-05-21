import { Link } from "wouter";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { Mail, MapPin } from "lucide-react";
import logo from "@assets/IMG_20260507_171922.png";
import { useTranslation } from "react-i18next";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { useWhatsApp } from "@/hooks/use-whatsapp";

export default function Footer() {
  const { t } = useTranslation();
  const { assets } = useSiteAssets();
  const logoSrc = assets["logo"] || logo;
  const { whatsappNumber, whatsappUrl } = useWhatsApp();

  return (
    <footer className="bg-primary text-primary-foreground py-16 border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <img src={logoSrc} alt="Hareem Academy" className="h-20 w-auto object-contain" />
          </Link>
          <p className="text-primary-foreground/80 font-medium text-sm leading-relaxed">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <FaWhatsapp className="h-6 w-6" />
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <FaFacebook className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif font-bold text-lg text-accent mb-6">{t("footer.links")}</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">{t("nav.about")}</Link></li>
            <li><Link href="/courses" className="text-primary-foreground/80 hover:text-accent transition-colors">{t("nav.courses")}</Link></li>
            <li><Link href="/testimonials" className="text-primary-foreground/80 hover:text-accent transition-colors">{t("nav.testimonials")}</Link></li>
            <li><Link href="/faqs" className="text-primary-foreground/80 hover:text-accent transition-colors">{t("nav.faqs")}</Link></li>
            <li><Link href="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-lg text-accent mb-6">{t("footer.legal")}</h4>
          <ul className="space-y-4">
            <li><Link href="/privacy" className="text-primary-foreground/80 hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-primary-foreground/80 hover:text-accent transition-colors">Terms of Service</Link></li>
            <li><Link href="/refund" className="text-primary-foreground/80 hover:text-accent transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-lg text-accent mb-6">{t("nav.contact")}</h4>
          <ul className="space-y-4 text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <FaWhatsapp className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                {whatsappNumber}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <a href="mailto:salam@hareemacademy.com" className="hover:text-accent transition-colors">
                salam@hareemacademy.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <span>Available worldwide<br />(Based in India)</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/60 text-sm">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
