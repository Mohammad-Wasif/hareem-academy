import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";
import Refund from "@/pages/legal/Refund";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:slug" component={CourseDetail} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/refund" component={Refund} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
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
