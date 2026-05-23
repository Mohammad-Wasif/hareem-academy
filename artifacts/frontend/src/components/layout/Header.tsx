import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import staticLogo from "@assets/IMG_20260507_171922.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSiteAssets } from "@/hooks/use-site-assets";
import PremiumImage from "@/components/PremiumImage";

export default function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { assets } = useSiteAssets();
  const { whatsappUrl } = useWhatsApp();

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
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
          ? "bg-[#0F4D36]/95 backdrop-blur-xl border-[#ECC565]/20 shadow-lg shadow-black/[0.08]"
          : "bg-[#0F4D36]/90 backdrop-blur-md border-[#ECC565]/10"
        }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className={`container mx-auto px-3 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-12 sm:h-14" : "h-14 sm:h-16"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group min-w-0 shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`flex items-center shrink-0 transition-all duration-300 ${
              scrolled ? "h-8 sm:h-9.5" : "h-9.5 sm:h-11"
            }`}
          >
            <PremiumImage
              assetKey="logo"
              fallback={staticLogo}
              alt="Hareem Academy"
              objectFit="contain"
              bgClass="bg-transparent"
              widthClass={scrolled ? "w-16 sm:w-22" : "w-20 sm:w-26"}
              heightClass="h-full"
              fetchPriority="high"
            />
          </motion.div>
          <span className="whitespace-nowrap font-serif font-bold text-xs sm:text-base md:text-lg lg:text-xl tracking-[0.06em] sm:tracking-[0.12em] text-[#ECC565] group-hover:text-[#ECC565]/90 transition-colors uppercase">
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
                className={`relative text-sm font-medium transition-colors duration-300 py-1 nav-link-glow ${isActive ? "text-[#ECC565]" : "text-white/80 hover:text-[#ECC565]"
                  }`}
              >
                {item.label}
                {/* Animated active underline */}
                {isActive && (
                  <motion.span
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#ECC565] rounded-full"
                    layoutId="nav-active-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-[#ECC565] transition-colors py-1.5"
          >
            <FaWhatsapp className="w-4 h-4 text-[#ECC565]" />
            <span>WhatsApp</span>
          </a>

          <EnrollmentModal mode="trial">
            <Button className="bg-[#ECC565] text-[#0F4D36] hover:bg-[#ECC565]/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-sans text-sm rounded-lg px-4.5 h-9 font-semibold shadow-sm cursor-pointer">
              {t("common.book_trial", "Begin Your Journey")}
            </Button>
          </EnrollmentModal>
        </nav>

        {/* Mobile Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <motion.button
            className="p-2 text-[#ECC565] rounded-lg hover:bg-white/10 transition-colors"
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
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" strokeWidth={1.75} />
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
            className="md:hidden overflow-hidden bg-[#0F4D36] border-b border-[#ECC565]/20 shadow-xl shadow-black/10"
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
                      className={`flex items-center gap-2 px-4 py-2.5 text-base font-medium rounded-xl transition-colors ${isActive
                          ? "bg-[#ECC565]/15 text-[#ECC565]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ECC565] shrink-0" />
                      )}
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
              >
                <EnrollmentModal mode="trial">
                  <Button
                    className="bg-[#ECC565] text-[#0F4D36] hover:bg-[#ECC565]/90 rounded-lg w-full font-sans h-10 text-base shadow-sm font-semibold cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("common.book_trial", "Begin Your Journey")}
                  </Button>
                </EnrollmentModal>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg border-white/20 text-white hover:bg-white/5 h-10 text-sm font-sans gap-1.5"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-4 h-4 text-[#ECC565]" /> Speak With Our Team
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
