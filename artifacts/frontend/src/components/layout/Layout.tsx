import { ReactNode } from "react";
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

  return (
    <div className={`flex flex-col min-h-[100dvh] bg-background theme-${themePreset} glow-${glowPreset}`}>
      <Header />
      <main className="flex-grow pt-12 sm:pt-14 bg-background overflow-x-hidden">
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
