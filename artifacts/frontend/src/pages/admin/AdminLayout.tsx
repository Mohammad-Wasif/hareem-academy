import { ReactNode, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Mail,
  Star,
  HelpCircle,
  LogOut,
  Loader2,
  ListChecks,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/enrollments", label: "Enrollments", icon: Users },
  { href: "/admin/form-fields", label: "Form Fields", icon: ListChecks },
  { href: "/admin/contacts", label: "Messages", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}) {
  const [location] = useLocation();
  const active = exact ? location === href : location.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/70 hover:bg-primary/5 hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [isLogin] = useRoute("/admin/login");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminApi.me(),
    retry: false,
  });

  const logoutMut = useMutation({
    mutationFn: () => adminApi.logout(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin"] });
      setLocation("/admin/login");
    },
  });

  useEffect(() => {
    if (!isLoading && data && !data.isAdmin && !isLogin) {
      setLocation("/admin/login");
    }
  }, [isLoading, data, isLogin, setLocation]);

  if (isLogin) {
    return <div className="min-h-screen bg-[#FAF7F0]">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#FAF7F0]">
      <aside className="w-64 bg-white border-r border-border/50 flex flex-col">
        <div className="px-6 py-6 border-b border-border/50">
          <Link href="/admin" className="block">
            <div className="font-serif text-xl text-primary font-bold">
              Hareem Academy
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Admin Panel
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </nav>
        <div className="p-3 border-t border-border/50 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:bg-primary/5"
          >
            View Site →
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground/70"
            onClick={() => logoutMut.mutate()}
            disabled={logoutMut.isPending}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
