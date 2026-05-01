import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBaseUrl } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";

// In production (Render), VITE_API_URL points to the backend service.
// In local dev, the Vite proxy handles /api requests so no base URL is needed.
if (import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL);
}

import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Faqs from "@/pages/Faqs";
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";
import Refund from "@/pages/legal/Refund";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCourseEdit from "@/pages/admin/AdminCourseEdit";
import AdminEnrollments from "@/pages/admin/AdminEnrollments";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminFaqs from "@/pages/admin/AdminFaqs";
import AdminFormFields from "@/pages/admin/AdminFormFields";

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <Layout>
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
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/courses" component={AdminCourses} />
        <Route path="/admin/courses/new" component={AdminCourseEdit} />
        <Route path="/admin/courses/:id/edit" component={AdminCourseEdit} />
        <Route path="/admin/enrollments" component={AdminEnrollments} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/faqs" component={AdminFaqs} />
        <Route path="/admin/form-fields" component={AdminFormFields} />
      </Switch>
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
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
