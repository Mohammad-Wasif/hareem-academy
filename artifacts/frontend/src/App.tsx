import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBaseUrl } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import "@/lib/i18n";
import { MediaProvider } from "@/hooks/use-site-assets";

// In production (Render), VITE_API_URL points to the backend service.
// In local dev, the Vite proxy handles /api requests so no base URL is needed.
console.log("Debug: VITE_API_URL is", import.meta.env.VITE_API_URL);
if (import.meta.env.VITE_API_URL) {
  console.log("Debug: Setting Base URL to", import.meta.env.VITE_API_URL);
  setBaseUrl(import.meta.env.VITE_API_URL);
}

import React, { Suspense } from "react";

// Public Pages (Lazy)
const Home = React.lazy(() => import("@/pages/Home"));
const About = React.lazy(() => import("@/pages/About"));
const Courses = React.lazy(() => import("@/pages/Courses"));
const CourseDetail = React.lazy(() => import("@/pages/CourseDetail"));
const Testimonials = React.lazy(() => import("@/pages/Testimonials"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const Faqs = React.lazy(() => import("@/pages/Faqs"));
const Privacy = React.lazy(() => import("@/pages/legal/Privacy"));
const Terms = React.lazy(() => import("@/pages/legal/Terms"));
const Refund = React.lazy(() => import("@/pages/legal/Refund"));
const SEOLandingPage = React.lazy(() => import("@/pages/SEOLandingPage"));

// Admin Pages (Lazy)
const AdminLayout = React.lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLogin = React.lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminCourses = React.lazy(() => import("@/pages/admin/AdminCourses"));
const AdminCourseEdit = React.lazy(() => import("@/pages/admin/AdminCourseEdit"));
const AdminEnrollments = React.lazy(() => import("@/pages/admin/AdminEnrollments"));
const AdminContacts = React.lazy(() => import("@/pages/admin/AdminContacts"));
const AdminLeads = React.lazy(() => import("@/pages/admin/AdminLeads"));
const AdminTestimonials = React.lazy(() => import("@/pages/admin/AdminTestimonials"));
const AdminFaqs = React.lazy(() => import("@/pages/admin/AdminFaqs"));
const AdminFormFields = React.lazy(() => import("@/pages/admin/AdminFormFields"));
const AdminSiteContent = React.lazy(() => import("@/pages/admin/AdminSiteContent"));
const AdminMedia = React.lazy(() => import("@/pages/admin/AdminMedia"));
const AdminBuilder = React.lazy(() => import("@/pages/admin/AdminBuilder"));

import { I18nInitializer } from "@/components/I18nInitializer";

const queryClient = new QueryClient();

function RouteLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-[#ECC565]/20 border-t-[#0F4D36] rounded-full animate-spin mb-4" />
      <span className="text-xs font-bold tracking-widest text-[#0F4D36] uppercase animate-pulse">
        Loading Academy...
      </span>
    </div>
  );
}

function PublicRoutes() {
  return (
    <Layout>
      <Suspense fallback={<RouteLoading />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/courses" component={Courses} />
          <Route path="/courses/:slug" component={CourseDetail} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/faqs" component={Faqs} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/refund" component={Refund} />

          {/* SEO Landing Pages */}
          <Route path="/learn-arabic-online-for-sisters">
            {() => <SEOLandingPage slug="learn-arabic-online-for-sisters" />}
          </Route>
          <Route path="/arabic-classes-for-muslim-women">
            {() => <SEOLandingPage slug="arabic-classes-for-muslim-women" />}
          </Route>
          <Route path="/beginner-arabic-course-online">
            {() => <SEOLandingPage slug="beginner-arabic-course-online" />}
          </Route>
          <Route path="/quranic-arabic-classes">
            {() => <SEOLandingPage slug="quranic-arabic-classes" />}
          </Route>
          <Route path="/female-arabic-teachers-online">
            {() => <SEOLandingPage slug="female-arabic-teachers-online" />}
          </Route>
          <Route path="/learn-urdu-online">
            {() => <SEOLandingPage slug="learn-urdu-online" />}
          </Route>
          <Route path="/urdu-course-for-beginners">
            {() => <SEOLandingPage slug="urdu-course-for-beginners" />}
          </Route>
          <Route path="/urdu-reading-classes">
            {() => <SEOLandingPage slug="urdu-reading-classes" />}
          </Route>
          <Route path="/online-urdu-classes-for-sisters">
            {() => <SEOLandingPage slug="online-urdu-classes-for-sisters" />}
          </Route>
          <Route path="/learn-quran-with-meaning">
            {() => <SEOLandingPage slug="learn-quran-with-meaning" />}
          </Route>
          <Route path="/quran-reading-classes-for-sisters">
            {() => <SEOLandingPage slug="quran-reading-classes-for-sisters" />}
          </Route>
          <Route path="/online-tajweed-classes">
            {() => <SEOLandingPage slug="online-tajweed-classes" />}
          </Route>
          <Route path="/understand-quranic-arabic">
            {() => <SEOLandingPage slug="understand-quranic-arabic" />}
          </Route>

          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Suspense fallback={<RouteLoading />}>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/courses" component={AdminCourses} />
          <Route path="/admin/courses/new" component={AdminCourseEdit} />
          <Route path="/admin/courses/:id/edit" component={AdminCourseEdit} />
          <Route path="/admin/site-content" component={AdminSiteContent} />
          <Route path="/admin/media" component={AdminMedia} />
          <Route path="/admin/builder" component={AdminBuilder} />

          <Route path="/admin/enrollments" component={AdminEnrollments} />
          <Route path="/admin/contacts" component={AdminContacts} />
          <Route path="/admin/leads" component={AdminLeads} />
          <Route path="/admin/testimonials" component={AdminTestimonials} />
          <Route path="/admin/faqs" component={AdminFaqs} />
          <Route path="/admin/form-fields" component={AdminFormFields} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location === "/admin" || location.startsWith("/admin/")) {
    return <AdminRoutes />;
  }
  return <PublicRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MediaProvider>
        <I18nInitializer>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </I18nInitializer>
      </MediaProvider>
    </QueryClientProvider>
  );
}

export default App;
