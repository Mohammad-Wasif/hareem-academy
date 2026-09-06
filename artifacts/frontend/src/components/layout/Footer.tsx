import { Link } from "wouter";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { Mail, MapPin } from "lucide-react";
import logo from "@assets/IMG_20260507_171922.png";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { useWhatsApp } from "@/hooks/use-whatsapp";

export default function Footer() {
  const { assets } = useSiteAssets();
  const logoSrc = assets["logo"] || logo;
  const { whatsappNumber, whatsappUrl } = useWhatsApp();

  return (
    <footer className="bg-[#003527] text-white py-12 md:py-16 border-t border-[#003527] font-sans">
      <div className="container mx-auto px-4 max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#003527] border border-[#ffe088]/30 flex items-center justify-center shrink-0 shadow-md overflow-hidden p-0">
              <img src={logoSrc} alt="Hareem Academy" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif font-bold text-xl md:text-2xl text-[#ffe088] group-hover:text-white transition-colors tracking-normal">
              Hareem Academy
            </span>
          </Link>
          <p className="text-[#d0e5d8] font-normal text-xs md:text-sm leading-relaxed">
            Structured online Arabic and Urdu classes taught by qualified female teachers designed exclusively for sisters.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#ffe088] hover:text-white transition-colors">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/hareem_academy_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/share/1EnzRmToBK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">
              <FaFacebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif font-bold text-base md:text-lg text-[#ffe088] mb-5">Quick Links</h4>
          <ul className="space-y-3 font-sans text-xs md:text-sm">
            <li><Link href="/about" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">About Us</Link></li>
            <li><Link href="/courses" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Our Courses</Link></li>
            <li><Link href="/testimonials" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Testimonials</Link></li>
            <li><Link href="/faqs" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">FAQs</Link></li>
            <li><Link href="/contact" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-base md:text-lg text-[#ffe088] mb-5">Legal</h4>
          <ul className="space-y-3 font-sans text-xs md:text-sm">
            <li><Link href="/privacy" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Terms of Service</Link></li>
            <li><Link href="/refund" className="text-[#d0e5d8] hover:text-[#ffe088] transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-base md:text-lg text-[#ffe088] mb-5">Contact Us</h4>
          <ul className="space-y-3 font-sans text-xs md:text-sm text-[#d0e5d8]">
            <li className="flex items-start gap-2.5">
              <FaWhatsapp className="h-4 w-4 text-[#ffe088] shrink-0 mt-0.5" />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffe088] transition-colors">
                {whatsappNumber}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 text-[#ffe088] shrink-0 mt-0.5" />
              <a href="mailto:hareem.educational.academy@gmail.com" className="hover:text-[#ffe088] transition-colors break-all">
                hareem.educational.academy@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#ffe088] shrink-0 mt-0.5" />
              <span>Available worldwide (Based in India)</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-[1280px] mt-12 pt-6 border-t border-white/10 text-center text-[#d0e5d8]/70 text-xs">
        <p>© {new Date().getFullYear()} Hareem Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}
