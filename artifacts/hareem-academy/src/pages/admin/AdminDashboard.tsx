import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import {
  BookOpen,
  Users,
  MessageSquare,
  Mail,
  Star,
  HelpCircle,
  Loader2,
} from "lucide-react";

const STATS = [
  { key: "courses", label: "Courses", icon: BookOpen, href: "/admin/courses" },
  {
    key: "enrollments",
    label: "Enrollments",
    icon: Users,
    href: "/admin/enrollments",
  },
  {
    key: "contacts",
    label: "Messages",
    icon: MessageSquare,
    href: "/admin/contacts",
  },
  { key: "leads", label: "Leads", icon: Mail, href: "/admin/leads" },
  {
    key: "testimonials",
    label: "Testimonials",
    icon: Star,
    href: "/admin/testimonials",
  },
  { key: "faqs", label: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
] as const;

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-primary font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          A quick overview of activity across your site.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {STATS.map(({ key, label, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                className="bg-white border border-border/50 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                </div>
                <div className="font-serif text-3xl font-bold text-primary">
                  {data?.counts[key as keyof typeof data.counts] ?? 0}
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white border border-border/50 rounded-xl">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-serif text-lg text-primary font-bold">
                Recent Enrollments
              </h2>
              <Link
                href="/admin/enrollments"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            {data?.recentEnrollments.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground text-center">
                No enrollments yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="px-5 py-3 font-medium">City</th>
                    <th className="px-5 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentEnrollments.map((e) => (
                    <tr key={e.id} className="border-t border-border/50">
                      <td className="px-5 py-3 font-medium">{e.fullName}</td>
                      <td className="px-5 py-3">{e.courseSlug}</td>
                      <td className="px-5 py-3">{e.city}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
