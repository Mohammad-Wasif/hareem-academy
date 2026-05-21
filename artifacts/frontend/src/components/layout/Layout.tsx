import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import LeadMagnet from "../LeadMagnet";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
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
