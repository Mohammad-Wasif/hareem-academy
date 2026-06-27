const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : `${import.meta.env.BASE_URL}api`;

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  console.log("Admin Request:", `${BASE}${path}`);
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  me: () => request<{ isAdmin: boolean }>("/admin/me"),
  login: async (username: string, password: string) => {
    return await request<{ ok: true }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  logout: () => request<{ ok: true }>("/admin/logout", { method: "POST" }),

  dashboard: () =>
    request<{
      counts: {
        courses: number;
        enrollments: number;
        contacts: number;
        leads: number;
        testimonials: number;
        faqs: number;
      };
      recentEnrollments: {
        id: number;
        fullName: string;
        courseSlug: string;
        city: string;
        createdAt: string;
      }[];
    }>("/admin/dashboard"),

  listEnrollments: () => request<AdminEnrollment[]>("/admin/enrollments"),
  deleteEnrollment: (id: number) =>
    request<{ ok: true }>(`/admin/enrollments/${id}`, { method: "DELETE" }),

  listContacts: () => request<AdminContact[]>("/admin/contacts"),
  deleteContact: (id: number) =>
    request<{ ok: true }>(`/admin/contacts/${id}`, { method: "DELETE" }),

  listLeads: () => request<AdminLead[]>("/admin/leads"),
  deleteLead: (id: number) =>
    request<{ ok: true }>(`/admin/leads/${id}`, { method: "DELETE" }),

  listCourses: () => request<AdminCourse[]>("/admin/courses"),
  getCourse: (id: number) => request<AdminCourse>(`/admin/courses/${id}`),
  createCourse: (data: AdminCourseInput) =>
    request<AdminCourse>("/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCourse: (id: number, data: AdminCourseInput) =>
    request<AdminCourse>(`/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: number) =>
    request<{ ok: true }>(`/admin/courses/${id}`, { method: "DELETE" }),

  listTestimonials: () => request<AdminTestimonial[]>("/admin/testimonials"),
  createTestimonial: (data: AdminTestimonialInput) =>
    request<AdminTestimonial>("/admin/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: number, data: AdminTestimonialInput) =>
    request<AdminTestimonial>(`/admin/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: number) =>
    request<{ ok: true }>(`/admin/testimonials/${id}`, { method: "DELETE" }),

  listFaqs: () => request<AdminFaq[]>("/admin/faqs"),
  createFaq: (data: AdminFaqInput) =>
    request<AdminFaq>("/admin/faqs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFaq: (id: number, data: AdminFaqInput) =>
    request<AdminFaq>(`/admin/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteFaq: (id: number) =>
    request<{ ok: true }>(`/admin/faqs/${id}`, { method: "DELETE" }),

  listFormFields: () => request<AdminFormField[]>("/admin/form-fields"),
  createFormField: (data: AdminFormFieldInput) =>
    request<AdminFormField>("/admin/form-fields", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFormField: (id: number, data: AdminFormFieldInput) =>
    request<AdminFormField>(`/admin/form-fields/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteFormField: (id: number) =>
    request<{ ok: true }>(`/admin/form-fields/${id}`, { method: "DELETE" }),

  // Lead Assignee
  assignLead: (id: number, assignedTo: string | null) =>
    request<any>(`/admin/leads/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ assignedTo }),
    }),
  assignEnrollment: (id: number, assignedTo: string | null) =>
    request<any>(`/admin/enrollments/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ assignedTo }),
    }),

  // Dashboard Tasks
  listTasks: () => request<any[]>("/admin/tasks"),
  createTask: (text: string) =>
    request<any>("/admin/tasks", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  updateTask: (id: number, data: { text?: string; completed?: boolean }) =>
    request<any>(`/admin/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTask: (id: number) =>
    request<{ ok: true }>(`/admin/tasks/${id}`, { method: "DELETE" }),

  // Site Settings
  getSettings: () => request<{ key: string; value: any }[]>("/admin/settings"),
  updateSettings: (key: string, value: any) =>
    request<any>(`/admin/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),

  // Landing Pages
  listLandingPages: () => request<any[]>("/admin/landing-pages"),
  getLandingPage: (slug: string) => request<any>(`/landing-pages/${slug}`),
  createLandingPage: (data: { slug: string; title: string; metaDescription?: string; config: any }) =>
    request<any>("/admin/landing-pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLandingPage: (slug: string, data: { title: string; metaDescription?: string; config: any }) =>
    request<any>(`/admin/landing-pages/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLandingPage: (slug: string) =>
    request<{ ok: true }>(`/admin/landing-pages/${slug}`, { method: "DELETE" }),

  // Media Asset Metadata
  updateAssetMetadata: (
    key: string,
    metadata: {
      title?: string | null;
      description?: string | null;
      altText?: string | null;
      tags?: string | null;
    },
  ) =>
    request<any>(`/admin/site-assets/${key}/metadata`, {
      method: "PUT",
      body: JSON.stringify(metadata),
    }),
};

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select";

export type AdminFormField = {
  id: number;
  formKey: string;
  fieldKey: string;
  label: string;
  fieldType: FormFieldType;
  placeholder: string | null;
  helpText: string | null;
  required: boolean;
  options: string[];
  sortOrder: number;
  enabled: boolean;
  isBuiltIn: boolean;
};

export type AdminFormFieldInput = Omit<AdminFormField, "id">;

export type AdminEnrollment = {
  id: number;
  fullName: string;
  age: number;
  whatsappNumber: string;
  city: string;
  country: string | null;
  courseSlug: string;
  notes: string | null;
  customData: Record<string, string>;
  assignedTo?: string | null;
  createdAt: string;
};

export type AdminContact = {
  id: number;
  fullName: string;
  email: string | null;
  whatsappNumber: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
};

export type AdminLead = {
  id: number;
  fullName: string | null;
  whatsappNumber: string;
  email: string | null;
  source: string;
  assignedTo?: string | null;
  createdAt: string;
};

export type AdminCourse = {
  id: number;
  slug: string;
  title: string;
  language: string;
  level: string;
  durationMonths: number;
  timings: string;
  platform: string;
  feeMonthly: number;
  currency: string;
  startDate: string | null;
  summary: string;
  highlights: string[];
  curriculum: { title: string; description?: string }[];
  forWhom: string | null;
  seatsRemaining: number | null;
  featured: boolean;
  sortOrder: number;
  enrollmentStatus: "open" | "closed";
  title_ur?: string;
  summary_ur?: string;
  timings_ur?: string;
  title_ar?: string;
  summary_ar?: string;
  timings_ar?: string;
};

export type AdminCourseInput = Omit<AdminCourse, "id">;

export type AdminTestimonial = {
  id: number;
  studentName: string;
  location: string | null;
  course: string | null;
  rating: number;
  quote: string;
  bottomText?: string | null;
  featured: boolean;
  quote_ur?: string;
  quote_ar?: string;
  bottomText_ur?: string | null;
  bottomText_ar?: string | null;
};

export type AdminTestimonialInput = Omit<AdminTestimonial, "id">;

export type AdminFaq = {
  id: number;
  question: string;
  question_ur?: string | null;
  question_ar?: string | null;
  answer: string;
  answer_ur?: string | null;
  answer_ar?: string | null;
  category: string | null;
  sortOrder: number;
};

export type AdminFaqInput = Omit<AdminFaq, "id">;
