import { useTranslation } from "react-i18next";

export function useWhatsApp() {
  const { t } = useTranslation();
  const whatsappNumber = t("common.whatsapp_number", "919315118289");
  
  // Clean up number for URL (remove +, spaces, hyphens)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const whatsappMessage = t(
    "common.whatsapp_message",
    "Assalamu alaikum, I'd like to know more about Hareem Academy."
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return {
    whatsappNumber,
    whatsappUrl,
  };
}
