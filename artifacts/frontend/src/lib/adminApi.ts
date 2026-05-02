const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : `${import.meta.env.BASE_URL}api`;

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
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
  login: (username: string, password: string) =>
    request<{ ok: true }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
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
};

export type AdminCourseInput = Omit<AdminCourse, "id">;

export type AdminTestimonial = {
  id: number;
  studentName: string;
  location: string | null;
  course: string | null;
  rating: number;
  quote: string;
  featured: boolean;
};

export type AdminTestimonialInput = Omit<AdminTestimonial, "id">;

export type AdminFaq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
};

export type AdminFaqInput = Omit<AdminFaq, "id">;
