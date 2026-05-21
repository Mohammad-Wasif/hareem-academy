import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEnrollment, useListCourses } from "@workspace/api-client-react";
import { FaWhatsapp } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";
import { useWhatsApp } from "@/hooks/use-whatsapp";

type FormFieldType = "text" | "email" | "tel" | "number" | "textarea" | "select";
type PublicFormField = {
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
  isBuiltIn: boolean;
};

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : `${import.meta.env.BASE_URL}api`;

const BUILT_IN_KEYS = new Set([
  "courseSlug",
  "fullName",
  "age",
  "whatsappNumber",
  "city",
  "country",
  "notes",
]);

async function fetchEnrollmentFields(): Promise<PublicFormField[]> {
  const res = await fetch(`${BASE}/form-fields/enrollment`);
  if (!res.ok) return [];
  return res.json();
}

export default function EnrollmentModal({
  children,
  defaultCourseSlug = "",
  mode = "enroll",
}: {
  children: React.ReactNode;
  defaultCourseSlug?: string;
  mode?: "enroll" | "trial";
}) {
  const isTrial = mode === "trial";
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { whatsappUrl } = useWhatsApp();
  const [values, setValues] = useState<Record<string, string>>({
    fullName: "",
    age: "18",
    whatsappNumber: "",
    city: "",
    country: "",
    courseSlug: defaultCourseSlug,
    notes: "",
  });

  const { data: courses = [] } = useListCourses();
  const { data: allFields = [] } = useQuery({
    queryKey: ["form-fields", "enrollment"],
    queryFn: fetchEnrollmentFields,
  });
  const createEnrollment = useCreateEnrollment();

  // Map fieldKey -> field config (only enabled fields are returned by the API)
  const fieldMap = new Map(allFields.map((f) => [f.fieldKey, f]));
  const customFields = allFields
    .filter((f) => !BUILT_IN_KEYS.has(f.fieldKey))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function getBuiltIn(key: string, fallbackLabel: string) {
    const f = fieldMap.get(key);
    return {
      visible: !!f,
      label: f?.label ?? fallbackLabel,
      placeholder: f?.placeholder ?? null,
      helpText: f?.helpText ?? null,
      required: f?.required ?? true,
    };
  }

  const courseField = getBuiltIn("courseSlug", "Select Course");
  const nameField = getBuiltIn("fullName", "Full Name");
  const ageField = getBuiltIn("age", "Age");
  const whatsappField = getBuiltIn("whatsappNumber", "WhatsApp Number");
  const cityField = getBuiltIn("city", "City");
  const countryField = getBuiltIn("country", "Country");
  const notesField = getBuiltIn("notes", "Any questions or notes? (Optional)");

  function setField(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _omit, ...rest } = e;
      return rest;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!values.fullName.trim()) next.fullName = "Required";
    const ageNum = Number(values.age);
    if (!Number.isFinite(ageNum) || ageNum < 4 || ageNum > 120)
      next.age = "Enter a valid age";
    if (!values.whatsappNumber.trim()) next.whatsappNumber = "Required";
    if (!values.city.trim()) next.city = "Required";
    if (!values.courseSlug) next.courseSlug = "Choose a course";
    if (countryField.visible && countryField.required && !values.country.trim())
      next.country = "Required";
    if (notesField.visible && notesField.required && !values.notes.trim())
      next.notes = "Required";
    for (const f of customFields) {
      if (f.required && !(values[f.fieldKey] ?? "").trim()) {
        next[f.fieldKey] = "Required";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const customData: Record<string, string> = {};
    for (const f of customFields) {
      const v = values[f.fieldKey] ?? "";
      if (v !== "") customData[f.fieldKey] = v;
    }
    if (isTrial) customData.requestType = "free_trial";
    const payload = {
      fullName: values.fullName,
      age: Number(values.age),
      whatsappNumber: values.whatsappNumber,
      city: values.city,
      country: countryField.visible && values.country ? values.country : undefined,
      courseSlug: values.courseSlug,
      notes: notesField.visible && values.notes ? values.notes : undefined,
      ...(Object.keys(customData).length ? { customData } : {}),
    };
    createEnrollment.mutate(
      // The generated client only types the spec'd body; cast to allow our
      // additional customData payload, which the server accepts.
      { data: payload as never },
      {
        onSuccess: () => setIsSuccess(true),
      },
    );
  }

  function renderCustom(f: PublicFormField) {
    const value = values[f.fieldKey] ?? "";
    const err = errors[f.fieldKey];
    const id = `cf_${f.fieldKey}`;
    return (
      <div className="space-y-2" key={f.id}>
        <Label htmlFor={id}>
          {f.label}
          {f.required && <span className="text-destructive"> *</span>}
        </Label>
        {f.fieldType === "textarea" ? (
          <Textarea
            id={id}
            placeholder={f.placeholder ?? undefined}
            value={value}
            onChange={(e) => setField(f.fieldKey, e.target.value)}
          />
        ) : f.fieldType === "select" ? (
          <Select
            value={value}
            onValueChange={(v) => setField(f.fieldKey, v)}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={f.placeholder ?? "Choose..."} />
            </SelectTrigger>
            <SelectContent>
              {f.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={id}
            placeholder={f.placeholder ?? undefined}
            type={
              f.fieldType === "email"
                ? "email"
                : f.fieldType === "tel"
                  ? "tel"
                  : f.fieldType === "number"
                    ? "number"
                    : "text"
            }
            value={value}
            onChange={(e) => setField(f.fieldKey, e.target.value)}
          />
        )}
        {f.helpText && (
          <p className="text-xs text-muted-foreground">{f.helpText}</p>
        )}
        {err && <p className="text-xs text-destructive">{err}</p>}
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTimeout(() => {
            setIsSuccess(false);
            setErrors({});
          }, 500);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Alhamdulillah!
              </h2>
              <p className="text-muted-foreground">
                {isTrial
                  ? "Your free trial request is in. A sister from our team will WhatsApp you within minutes to schedule your trial class."
                  : "Your enrollment request has been received. Our team will WhatsApp you within minutes to confirm your admission."}
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg rounded-full mt-4"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaWhatsapp className="w-5 h-5" />
                Message Us on WhatsApp Now
              </a>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-primary">
                {isTrial ? "Book Your Free Trial Class" : "Enroll Now"}
              </DialogTitle>
              <DialogDescription>
                {isTrial
                  ? "Try one class for free, no payment required. Takes 30 seconds."
                  : "Quick form, no payment now. Takes 30 seconds."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20">
              <FaWhatsapp className="w-4 h-4 text-[#25D366] shrink-0" />
              <p className="text-xs text-foreground/80">
                We'll contact you on <strong>WhatsApp within minutes</strong> — no
                spam calls.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="courseSlug">
                  {courseField.label}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={values.courseSlug}
                  onValueChange={(v) => setField("courseSlug", v)}
                >
                  <SelectTrigger id="courseSlug">
                    <SelectValue
                      placeholder={courseField.placeholder ?? "Choose a course"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {courses
                      .filter((c) => (c as any).enrollmentStatus !== "closed" || c.slug === defaultCourseSlug)
                      .map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.title} {(c as any).enrollmentStatus === 'closed' ? '(Closed)' : ''}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {courseField.helpText && (
                  <p className="text-xs text-muted-foreground">
                    {courseField.helpText}
                  </p>
                )}
                {errors.courseSlug && (
                  <p className="text-xs text-destructive">{errors.courseSlug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  {nameField.label}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder={nameField.placeholder ?? "Enter your full name"}
                />
                {nameField.helpText && (
                  <p className="text-xs text-muted-foreground">
                    {nameField.helpText}
                  </p>
                )}
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    {ageField.label}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={values.age}
                    onChange={(e) => setField("age", e.target.value)}
                    placeholder={ageField.placeholder ?? undefined}
                  />
                  {errors.age && (
                    <p className="text-xs text-destructive">{errors.age}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">
                    {whatsappField.label}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="whatsappNumber"
                    value={values.whatsappNumber}
                    onChange={(e) =>
                      setField("whatsappNumber", e.target.value)
                    }
                    placeholder={whatsappField.placeholder ?? "+91..."}
                  />
                  {errors.whatsappNumber && (
                    <p className="text-xs text-destructive">
                      {errors.whatsappNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    {cityField.label}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={values.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder={cityField.placeholder ?? "Your city"}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive">{errors.city}</p>
                  )}
                </div>
                {countryField.visible && (
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      {countryField.label}
                      {countryField.required && (
                        <span className="text-destructive"> *</span>
                      )}
                    </Label>
                    <Input
                      id="country"
                      value={values.country}
                      onChange={(e) => setField("country", e.target.value)}
                      placeholder={countryField.placeholder ?? "Your country"}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive">
                        {errors.country}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {customFields.map(renderCustom)}

              {notesField.visible && (
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {notesField.label}
                    {notesField.required && (
                      <span className="text-destructive"> *</span>
                    )}
                  </Label>
                  <Textarea
                    id="notes"
                    value={values.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    placeholder={notesField.placeholder ?? "Let us know..."}
                  />
                  {errors.notes && (
                    <p className="text-xs text-destructive">{errors.notes}</p>
                  )}
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg rounded-full"
                  disabled={createEnrollment.isPending}
                >
                  {createEnrollment.isPending
                    ? "Sending..."
                    : isTrial
                      ? "Book My Free Trial"
                      : "Confirm Enrollment"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free for girls & women only. No spam, no payment until you're sure.
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
