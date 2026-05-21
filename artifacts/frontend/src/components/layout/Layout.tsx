import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import LeadMagnet from "../LeadMagnet";

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const themePreset = t("common.theme_preset", "emerald");
  const glowPreset = t("common.glow_preset", "classic");

  return (
    <div className={`flex flex-col min-h-[100dvh] bg-background theme-${themePreset} glow-${glowPreset}`}>
      <Header />
      <main className="flex-grow pt-12 sm:pt-14 bg-background">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <LeadMagnet />
    </div>
  );
}
