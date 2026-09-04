import { Link, useLocation } from "wouter";
import { useState, useEffect, Suspense, lazy } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const EnrollmentModal = lazy(() => import("@/components/EnrollmentModal"));
import staticLogo from "@assets/IMG_20260507_171922.png";
import { useSiteAssets } from "@/hooks/use-site-assets";
import PremiumImage from "@/components/PremiumImage";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { assets } = useSiteAssets();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-[#003527] text-[#ffe088] sticky top-0 z-50 border-b border-[#064e3b] shadow-md transition-all">
      <div className="flex justify-between items-center w-full px-4 md:px-12 max-w-[1280px] mx-auto h-20">
        {/* Circular Logo Container (#0B2216 border and background, no white/grey outline) */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-13 h-13 md:w-15 md:h-15 rounded-full bg-[#0B2216] border border-[#0B2216] flex items-center justify-center shrink-0 shadow-md overflow-hidden p-0"
          >
            <PremiumImage
              assetKey="logo"
              fallback={staticLogo}
              alt="Hareem Academy"
              objectFit="cover"
              bgClass="bg-[#0B2216]"
              widthClass="w-full"
              heightClass="h-full scale-105"
              fetchPriority="high"
            />
          </motion.div>
          <span className="font-serif font-bold text-xl md:text-2xl text-white tracking-normal group-hover:text-[#ffe088] transition-colors leading-snug">
            Hareem Academy
          </span>
        </Link>

        {/* All Nav Links inside a Capsule with ONLY BORDERS */}
        <nav className="hidden md:flex items-center space-x-1 border-2 border-[#ffe088] rounded-full p-1.5 bg-transparent">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-sans text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                      ? "bg-[#ffe088] text-[#003527] font-bold shadow-sm"
                      : "text-[#ffe088] hover:bg-[#ffe088]/20 hover:text-white"
                    }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Book Free Trial Button (Separate Action Button) */}
        <div className="hidden md:flex items-center">
          <Suspense
            fallback={
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="font-sans font-bold text-xs md:text-sm bg-[#ffe088] text-[#003527] px-6 py-2.5 rounded-full hover:bg-[#e9c349] transition-all shadow-md shadow-black/20 cursor-pointer"
              >
                Book Free Trial
              </motion.button>
            }
          >
            <EnrollmentModal mode="trial">
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="font-sans font-bold text-xs md:text-sm bg-[#ffe088] text-[#003527] px-6 py-2.5 rounded-full hover:bg-[#e9c349] transition-all shadow-md shadow-black/20 cursor-pointer"
              >
                Book Free Trial
              </motion.button>
            </EnrollmentModal>
          </Suspense>
        </div>

        {/* Mobile Menu Trigger */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 text-[#ffe088] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#002a1f] border-b border-[#064e3b] px-4 py-4"
          >
            <div className="flex flex-col space-y-3">
              <div className="border-2 border-[#ffe088] rounded-2xl p-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all ${isActive
                            ? "bg-[#ffe088] text-[#003527] font-bold"
                            : "text-[#ffe088] hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Suspense fallback={null}>
                  <EnrollmentModal mode="trial">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className="w-full font-sans font-bold text-sm bg-[#ffe088] text-[#003527] py-3 rounded-full hover:bg-[#e9c349] transition-all shadow-md cursor-pointer"
                    >
                      Book Free Trial
                    </motion.button>
                  </EnrollmentModal>
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
