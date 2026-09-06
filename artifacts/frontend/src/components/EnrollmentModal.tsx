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
import { COUNTRIES_DATA } from "@/lib/countries";

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
  "email",
  "age",
  "whatsappNumber",
  "country",
  "city",
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
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [manualCountry, setManualCountry] = useState(false);
  const [manualCity, setManualCity] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    age: "18",
    whatsappNumber: "",
    country: "India",
    city: "",
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
  const emailField = getBuiltIn("email", "Email Address");
  const ageField = getBuiltIn("age", "Age");
  const whatsappField = getBuiltIn("whatsappNumber", "WhatsApp Number");
  const countryField = getBuiltIn("country", "Country");
  const cityField = getBuiltIn("city", "City");
  const notesField = getBuiltIn("notes", "Any questions or notes? (Optional)");

  const currentCountryInfo = COUNTRIES_DATA.find(
    (c) => c.name.toLowerCase() === (values.country || "").trim().toLowerCase(),
  );
  const currentCountryCities = currentCountryInfo?.cities ?? [];

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
        next.fullName = "Please enter your full name";
      }
      if (!values.email.trim()) {
        next.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        next.email = "Please enter a valid email address";
      }
      if (!phoneDigits.trim()) {
        next.whatsappNumber = "WhatsApp number is required";
      } else if (phoneDigits.trim().length < 6 || phoneDigits.trim().length > 15) {
        next.whatsappNumber = "Enter a valid phone number (6 - 15 digits)";
      }
    }
    
    if (currentStep === 3) {
      if (countryField.visible && !values.country.trim()) {
        next.country = "Country is required";
      }
      if (cityField.visible && !values.city.trim()) {
        next.city = "City is required";
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
    const fullWhatsappNumber = `${countryCode} ${phoneDigits.trim()}`;
    const customData: Record<string, string> = {};
    for (const f of customFields) {
      const v = values[f.fieldKey] ?? "";
      if (v !== "") customData[f.fieldKey] = v;
    }
    if (isTrial) customData.requestType = "free_trial";
    if (values.email) customData.email = values.email.trim();

    const notesWithEmail = values.notes?.trim()
      ? `[Email: ${values.email.trim()}]\n\n${values.notes.trim()}`
      : `[Email: ${values.email.trim()}]`;

    const payload = {
      fullName: values.fullName.trim(),
      age: Number(values.age),
      whatsappNumber: fullWhatsappNumber,
      city: values.city.trim(),
      country: values.country.trim() || undefined,
      courseSlug: values.courseSlug,
      notes: notesWithEmail,
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
            setManualCountry(false);
            setManualCity(false);
            setPhoneDigits("");
            setCountryCode("+91");
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
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl sm:text-2xl text-primary font-bold">
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
            <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-border bg-muted/20 select-none">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-colors ${
                      step === s
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : step > s
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  <span
                    className={`text-xs font-sans ${
                      step === s
                        ? "font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s === 1 ? "Course" : s === 2 ? "Your Info" : "Details"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
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

                  {/* Email Address (Mandatory) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold text-xs text-primary">
                      {emailField.label} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="name@example.com"
                      className="h-10 rounded-lg border-border bg-background"
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* WhatsApp with Country Code & Numbers Only */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber" className="font-semibold text-xs text-primary">
                      {whatsappField.label} <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={countryCode}
                        onValueChange={(val) => {
                          setCountryCode(val);
                          const matchedCountry = COUNTRIES_DATA.find((c) => c.code === val);
                          if (matchedCountry && !values.country) {
                            setField("country", matchedCountry.name);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[125px] sm:w-[135px] shrink-0 h-10 rounded-lg border-border bg-background px-2 font-sans text-xs">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {COUNTRIES_DATA.map((c) => (
                            <SelectItem key={`${c.name}-${c.code}`} value={c.code}>
                              <span className="flex items-center gap-1.5 text-xs">
                                <span>{c.flag}</span>
                                <span className="font-mono font-semibold">{c.code}</span>
                                <span className="text-muted-foreground text-[10px] truncate max-w-[70px]">
                                  ({c.name})
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="whatsappNumber"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneDigits}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setPhoneDigits(digits);
                          setField("whatsappNumber", digits);
                        }}
                        onKeyDown={(e) => {
                          if (
                            [
                              "Backspace",
                              "Delete",
                              "Tab",
                              "Escape",
                              "Enter",
                              "ArrowLeft",
                              "ArrowRight",
                              "ArrowUp",
                              "ArrowDown",
                            ].includes(e.key) ||
                            e.ctrlKey === true ||
                            e.metaKey === true
                          ) {
                            return;
                          }
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="98765 43210 (numbers only)"
                        className="h-10 rounded-lg border-border bg-background flex-1"
                        autoComplete="tel-national"
                      />
                    </div>
                    {whatsappField.helpText && (
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {whatsappField.helpText}
                      </p>
                    )}
                    {errors.whatsappNumber && (
                      <p className="text-xs text-destructive">{errors.whatsappNumber}</p>
                    )}
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
                  {/* Country (First) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="country" className="font-semibold text-xs text-primary">
                        {countryField.label} <span className="text-destructive">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextManual = !manualCountry;
                          setManualCountry(nextManual);
                          if (nextManual) {
                            setManualCity(true);
                          }
                        }}
                        className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                      >
                        {manualCountry ? "Choose from list" : "Type manually"}
                      </button>
                    </div>

                    {!manualCountry ? (
                      <Select
                        value={values.country}
                        onValueChange={(val) => {
                          if (val === "OTHER") {
                            setManualCountry(true);
                            setManualCity(true);
                            setField("country", "");
                            setField("city", "");
                          } else {
                            setField("country", val);
                            setField("city", "");
                            setManualCity(false);
                            const matched = COUNTRIES_DATA.find((c) => c.name === val);
                            if (matched && (!phoneDigits || countryCode === "+91")) {
                              setCountryCode(matched.code);
                            }
                          }
                        }}
                      >
                        <SelectTrigger id="country" className="h-10 rounded-lg border-border bg-background">
                          <SelectValue placeholder={countryField.placeholder ?? "Select your country"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {COUNTRIES_DATA.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              <span className="flex items-center gap-2 text-xs">
                                <span>{c.flag}</span>
                                <span>{c.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                          <SelectItem value="OTHER">Other (Type manually)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="country"
                        value={values.country}
                        onChange={(e) => setField("country", e.target.value)}
                        placeholder="Enter your country"
                        className="h-10 rounded-lg border-border bg-background"
                      />
                    )}
                    {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                  </div>

                  {/* City (Second - Based on Country with manual write option) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="city" className="font-semibold text-xs text-primary">
                        {cityField.label} <span className="text-destructive">*</span>
                      </Label>
                      {currentCountryCities.length > 0 && !manualCountry && (
                        <button
                          type="button"
                          onClick={() => setManualCity(!manualCity)}
                          className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                        >
                          {manualCity ? "Select from list" : "Type manually"}
                        </button>
                      )}
                    </div>

                    {!manualCity && currentCountryCities.length > 0 && !manualCountry ? (
                      <Select
                        value={currentCountryCities.includes(values.city) ? values.city : (values.city ? "OTHER" : "")}
                        onValueChange={(val) => {
                          if (val === "OTHER") {
                            setManualCity(true);
                            setField("city", "");
                          } else {
                            setField("city", val);
                          }
                        }}
                      >
                        <SelectTrigger id="city" className="h-10 rounded-lg border-border bg-background">
                          <SelectValue
                            placeholder={
                              values.country
                                ? `Select city in ${values.country}`
                                : (cityField.placeholder ?? "Select city")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {currentCountryCities.map((cityName) => (
                            <SelectItem key={cityName} value={cityName}>
                              {cityName}
                            </SelectItem>
                          ))}
                          <SelectItem value="OTHER">Other (Type manually)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="city"
                        value={values.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder={
                          values.country
                            ? `Enter your city in ${values.country}`
                            : (cityField.placeholder ?? "Enter your city")
                        }
                        className="h-10 rounded-lg border-border bg-background"
                      />
                    )}
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
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
