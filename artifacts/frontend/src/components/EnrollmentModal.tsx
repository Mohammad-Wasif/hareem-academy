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
  const [step, setStep] = useState(1);
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

  function validateStep(currentStep: number): boolean {
    const next: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!values.courseSlug) next.courseSlug = "Choose a course";
      const ageNum = Number(values.age);
      if (ageField.visible && ageField.required) {
        if (!values.age || !Number.isFinite(ageNum) || ageNum < 4 || ageNum > 120) {
          next.age = "Enter a valid age (4 - 120)";
        }
      }
    }
    
    if (currentStep === 2) {
      if (nameField.visible && nameField.required && !values.fullName.trim()) {
        next.fullName = "Required";
      }
      if (whatsappField.visible && whatsappField.required && !values.whatsappNumber.trim()) {
        next.whatsappNumber = "Required";
      }
    }
    
    if (currentStep === 3) {
      if (cityField.visible && cityField.required && !values.city.trim()) {
        next.city = "Required";
      }
      if (countryField.visible && countryField.required && !values.country.trim()) {
        next.country = "Required";
      }
      if (notesField.visible && notesField.required && !values.notes.trim()) {
        next.notes = "Required";
      }
      for (const f of customFields) {
        if (f.required && !(values[f.fieldKey] ?? "").trim()) {
          next[f.fieldKey] = "Required";
        }
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  }

  function handleBack(e: React.MouseEvent) {
    e.preventDefault();
    setStep((s) => Math.max(1, s - 1));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;
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
        <Label htmlFor={id} className="font-semibold text-xs text-primary">
          {f.label}
          {f.required && <span className="text-destructive"> *</span>}
        </Label>
        {f.fieldType === "textarea" ? (
          <Textarea
            id={id}
            placeholder={f.placeholder ?? undefined}
            value={value}
            onChange={(e) => setField(f.fieldKey, e.target.value)}
            className="rounded-lg"
          />
        ) : f.fieldType === "select" ? (
          <Select
            value={value}
            onValueChange={(v) => setField(f.fieldKey, v)}
          >
            <SelectTrigger id={id} className="h-10 rounded-lg">
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
            className="h-10 rounded-lg"
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
            setStep(1);
          }, 500);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[94vw] sm:max-w-[480px] max-h-[92vh] overflow-y-auto p-0 rounded-2xl border border-accent/15">
        {isSuccess ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Alhamdulillah!
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isTrial
                  ? "Your free trial request is in. A sister from our team will WhatsApp you within minutes to schedule your trial class."
                  : "Your enrollment request has been received. Our team will WhatsApp you within minutes to confirm your admission."}
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg rounded-full mt-4 transition-all duration-300 font-sans shadow-md"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center"
              >
                <FaWhatsapp className="w-5 h-5 animate-pulse" />
                Message Us on WhatsApp Now
              </a>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="p-6 pb-4 border-b border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-primary font-bold">
                  {isTrial ? "Book Your Free Trial Class" : "Enroll Now"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {isTrial
                    ? "Try one class for free, no payment required. Takes 30 seconds."
                    : "Quick form, no payment now. Takes 30 seconds."}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20">
                <FaWhatsapp className="w-4 h-4 text-[#25D366] shrink-0" />
                <p className="text-[11px] text-foreground/80 leading-normal">
                  We'll contact you on <strong>WhatsApp within minutes</strong> — no spam calls.
                </p>
              </div>
            </div>

            {/* Step progress dots */}
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-muted/20 select-none">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-sans transition-all duration-300 ${
                      step === s
                        ? "bg-primary text-primary-foreground scale-105 shadow-sm"
                        : step > s
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`text-[10px] font-sans font-semibold transition-colors duration-300 ${
                      step === s ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {s === 1 ? "Program" : s === 2 ? "Contact" : "Location"}
                  </span>
                  {s < 3 && <div className="h-[1px] w-6 bg-border" />}
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="p-6 pt-2 space-y-4">
              {step === 1 && (
                <div className="space-y-4 pt-2">
                  {/* Select Course */}
                  <div className="space-y-2">
                    <Label htmlFor="courseSlug" className="font-semibold text-xs text-primary">
                      {courseField.label} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={values.courseSlug}
                      onValueChange={(v) => setField("courseSlug", v)}
                    >
                      <SelectTrigger id="courseSlug" className="h-10 rounded-lg border-border bg-background">
                        <SelectValue placeholder={courseField.placeholder ?? "Choose a course"} />
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
                    {courseField.helpText && <p className="text-[10px] text-muted-foreground leading-normal">{courseField.helpText}</p>}
                    {errors.courseSlug && <p className="text-xs text-destructive">{errors.courseSlug}</p>}
                  </div>

                  {/* Age */}
                  {ageField.visible && (
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-semibold text-xs text-primary">
                        {ageField.label} {ageField.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={values.age}
                        onChange={(e) => setField("age", e.target.value)}
                        placeholder="Enter your age"
                        className="h-10 rounded-lg border-border bg-background"
                      />
                      {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                    </div>
                  )}
                  
                  {/* Step Actions */}
                  <div className="pt-2">
                    <Button onClick={handleNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-full font-sans font-semibold text-sm">
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 pt-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold text-xs text-primary">
                      {nameField.label} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={values.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder={nameField.placeholder ?? "Enter your full name"}
                      className="h-10 rounded-lg border-border bg-background"
                      autoComplete="name"
                    />
                    {nameField.helpText && <p className="text-[10px] text-muted-foreground leading-normal">{nameField.helpText}</p>}
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber" className="font-semibold text-xs text-primary">
                      {whatsappField.label} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="whatsappNumber"
                      value={values.whatsappNumber}
                      onChange={(e) => setField("whatsappNumber", e.target.value)}
                      placeholder={whatsappField.placeholder ?? "+91..."}
                      className="h-10 rounded-lg border-border bg-background"
                      autoComplete="tel"
                    />
                    {errors.whatsappNumber && <p className="text-xs text-destructive">{errors.whatsappNumber}</p>}
                  </div>

                  {/* Step Actions */}
                  <div className="pt-2 flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-10 rounded-full font-sans font-semibold text-sm border-border">
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-full font-sans font-semibold text-sm">
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 pt-2">
                  {/* City & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-semibold text-xs text-primary">
                        {cityField.label} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={values.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder={cityField.placeholder ?? "Your city"}
                        className="h-10 rounded-lg border-border bg-background"
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>

                    {countryField.visible && (
                      <div className="space-y-2">
                        <Label htmlFor="country" className="font-semibold text-xs text-primary">
                          {countryField.label} {countryField.required && <span className="text-destructive">*</span>}
                        </Label>
                        <Input
                          id="country"
                          value={values.country}
                          onChange={(e) => setField("country", e.target.value)}
                          placeholder={countryField.placeholder ?? "Your country"}
                          className="h-10 rounded-lg border-border bg-background"
                        />
                        {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                      </div>
                    )}
                  </div>

                  {/* Custom Fields */}
                  {customFields.map(renderCustom)}

                  {/* Notes */}
                  {notesField.visible && (
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="font-semibold text-xs text-primary">
                        {notesField.label} {notesField.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Textarea
                        id="notes"
                        value={values.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        placeholder={notesField.placeholder ?? "Let us know..."}
                        className="rounded-lg min-h-[80px] border-border bg-background text-sm"
                      />
                      {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
                    </div>
                  )}

                  {/* Step Actions */}
                  <div className="pt-2 flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-10 rounded-full font-sans font-semibold text-sm border-border" disabled={createEnrollment.isPending}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-full font-sans font-semibold text-sm" disabled={createEnrollment.isPending}>
                      {createEnrollment.isPending ? "Sending..." : isTrial ? "Book My Free Trial" : "Confirm Enrollment"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
