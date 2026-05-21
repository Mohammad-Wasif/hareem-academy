import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919315118289"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#0F4D36] text-white rounded-full shadow-md shadow-[#0F4D36]/20 border border-[#D6B25E]/20 hover:bg-[#0A3828] transition-all hover:scale-105 active:scale-[0.92]"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
    >
      <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
    </motion.a>
  );
}
