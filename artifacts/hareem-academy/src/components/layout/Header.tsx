import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/Untitled_design_1777409286493.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={logo} alt="Hareem Academy" className="h-12 w-auto object-contain rounded" />
          <span className="font-serif font-bold text-xl text-primary hidden sm:block">Hareem Academy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wide rounded-full px-6">
            <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer">
              Enroll Now
            </a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-primary/10 shadow-lg p-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-lg font-medium rounded-md ${
                location === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="w-full bg-primary text-primary-foreground mt-2 rounded-full">
            <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer">
              Enroll Now
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
