export function useWhatsApp() {
  const whatsappNumber = "919315118289";
  
  // Clean up number for URL (remove +, spaces, hyphens)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const whatsappMessage = "Assalamu alaikum, I'd like to know more about Hareem Academy.";

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return {
    whatsappNumber,
    whatsappUrl,
  };
}
