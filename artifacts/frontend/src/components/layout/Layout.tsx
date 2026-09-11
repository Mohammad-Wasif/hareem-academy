import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import LeadMagnet from "../LeadMagnet";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const themePreset = "emerald";
  const glowPreset = "classic";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 30);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={`flex flex-col min-h-[100dvh] bg-background theme-${themePreset} glow-${glowPreset}`}>
      <Header />
      <main className="flex-grow bg-background overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <LeadMagnet />
    </div>
  );
}
