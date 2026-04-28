import { ShieldCheck, Video, Heart, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center max-w-4xl">
        <h1 className="font-serif font-bold text-5xl md:text-6xl text-primary mb-6">Our Story</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Hareem Academy was founded with a simple vision: to provide a safe, high-quality, and deeply respectful environment for Muslim women to learn the languages of our faith and heritage.
        </p>
      </section>

      {/* Image & Mission */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-card rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
          <div className="h-full min-h-[400px] relative">
            <img src="/about-bg.png" alt="Studying" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="font-serif font-bold text-3xl text-primary">Mission & Vision</h2>
            <p className="text-foreground/80 text-lg leading-relaxed">
              We believe that every sister should have access to authentic knowledge without compromising her privacy or values. Our mission is to break down the barriers of distance and time by bringing expert female educators directly to your home.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              We envision a world where mothers, daughters, and professionals can confidently read the Quran, understand Islamic texts in Arabic, and connect with Urdu literature, all while maintaining their modest lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 mb-24">
        <h2 className="font-serif font-bold text-4xl text-center text-primary mb-16">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Privacy First", desc: "100% female-only classes. Safe environment to open your camera." },
            { icon: Heart, title: "Modesty", desc: "A culture that respects and upholds Islamic values of Haya." },
            { icon: BookOpen, title: "Quality", desc: "Structured learning paths with qualified, experienced educators." },
            { icon: Video, title: "Flexibility", desc: "Learn from anywhere. Zoom classes designed for busy lives." }
          ].map((val, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl">{val.title}</h3>
              <p className="text-muted-foreground">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teachers */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif font-bold text-4xl text-primary mb-4">Meet Our Teachers</h2>
          <p className="text-muted-foreground text-lg">Dedicated, passionate, and qualified sisters ready to guide you.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Ustadha Fatima", role: "Head of Arabic", img: "/teacher-1.png" },
            { name: "Ustadha Ayesha", role: "Senior Urdu Instructor", img: "/teacher-2.png" },
            { name: "Ustadha Zainab", role: "Arabic & Tajweed", img: "/teacher-3.png" },
          ].map((teacher, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 transition-colors">
              <img src={teacher.img} alt={teacher.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/10 mb-6" />
              <h3 className="font-serif font-bold text-xl text-foreground">{teacher.name}</h3>
              <p className="text-primary font-medium mt-1">{teacher.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
