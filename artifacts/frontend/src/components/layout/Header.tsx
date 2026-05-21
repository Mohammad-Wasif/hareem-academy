import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EnrollmentModal from "@/components/EnrollmentModal";
import { WHATSAPP_URL } from "@/components/CTAGroup";
import staticLogo from "@assets/IMG_20260507_171922.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSiteAssets } from "@/hooks/use-site-assets";

export default function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { assets } = useSiteAssets();

  const logoSrc = assets["logo"] || staticLogo;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.courses"), href: "/courses" },
    { label: t("nav.testimonials"), href: "/testimonials" },
    { label: t("nav.faqs"), href: "/faqs" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/98 backdrop-blur-xl border-primary/15 shadow-lg shadow-primary/5"
          : "bg-background/95 backdrop-blur-md border-primary/10"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-12" : "h-14 sm:h-15"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.img
            src={logoSrc}
            alt="Hareem Academy"
            className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-9.5" : "h-11 sm:h-12.5"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
          <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-primary group-hover:text-primary/80 transition-colors">
            {t("common.site_name", "Hareem Academy")}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />

          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
                {/* Animated active underline */}
                {isActive && (
                  <motion.span
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="nav-active-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#128C7E] transition-colors py-1.5"
          >
            <FaWhatsapp className="w-4 h-4 text-[#128C7E]" />
            <span>WhatsApp</span>
          </a>

          <EnrollmentModal mode="trial">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-sans text-sm rounded-md px-4.5 h-9 shadow-sm shadow-primary/[0.02] cursor-pointer">
              {t("common.book_trial")}
            </Button>
          </EnrollmentModal>
        </nav>

        {/* Mobile Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <motion.button
            className="p-2 text-primary rounded-lg hover:bg-primary/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav — animated slide-down drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-background border-b border-primary/10 shadow-xl shadow-primary/5"
          >
            <div className="p-4 flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = location === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-base font-medium rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
              >
                <EnrollmentModal mode="trial">
                  <Button
                    className="bg-primary text-primary-foreground rounded-lg w-full font-sans h-10 text-base shadow-sm cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.book_trial", "Book Free Trial")}
                  </Button>
                </EnrollmentModal>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg border-primary/20 text-primary hover:bg-primary/5 h-10 text-sm font-sans gap-1.5"
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-4 h-4 text-[#128C7E]" /> Chat on WhatsApp
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
