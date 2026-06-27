import { db, formFieldsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

export const BUILT_IN_ENROLLMENT_FIELDS = [
  {
    fieldKey: "courseSlug",
    label: "Select Course",
    fieldType: "select" as const,
    placeholder: null as string | null,
    required: true,
    sortOrder: 1,
  },
  {
    fieldKey: "fullName",
    label: "Full Name",
    fieldType: "text" as const,
    placeholder: "Enter your full name",
    required: true,
    sortOrder: 2,
  },
  {
    fieldKey: "age",
    label: "Age",
    fieldType: "number" as const,
    placeholder: null,
    required: true,
    sortOrder: 3,
  },
  {
    fieldKey: "whatsappNumber",
    label: "WhatsApp Number",
    fieldType: "tel" as const,
    placeholder: "+91...",
    required: true,
    sortOrder: 4,
  },
  {
    fieldKey: "city",
    label: "City",
    fieldType: "text" as const,
    placeholder: "Your city",
    required: true,
    sortOrder: 5,
  },
  {
    fieldKey: "country",
    label: "Country",
    fieldType: "text" as const,
    placeholder: "Your country",
    required: false,
    sortOrder: 6,
  },
  {
    fieldKey: "notes",
    label: "Any questions or notes? (Optional)",
    fieldType: "textarea" as const,
    placeholder: "Let us know...",
    required: false,
    sortOrder: 99,
  },
];

export const ALWAYS_REQUIRED_BUILTINS = new Set([
  "courseSlug",
  "fullName",
  "age",
  "whatsappNumber",
  "city",
]);

export async function ensureBuiltInEnrollmentFields() {
  const existing = await db
    .select({ fieldKey: formFieldsTable.fieldKey })
    .from(formFieldsTable)
    .where(
      and(
        eq(formFieldsTable.formKey, "enrollment"),
        eq(formFieldsTable.isBuiltIn, true),
      ),
    );
  const present = new Set(existing.map((r: any) => r.fieldKey));
  const toInsert = BUILT_IN_ENROLLMENT_FIELDS.filter(
    (f) => !present.has(f.fieldKey),
  );
  if (toInsert.length === 0) return;
  await db.insert(formFieldsTable).values(
    toInsert.map((f) => ({
      formKey: "enrollment",
      fieldKey: f.fieldKey,
      label: f.label,
      fieldType: f.fieldType,
      placeholder: f.placeholder,
      required: f.required,
      options: [],
      sortOrder: f.sortOrder,
      enabled: true,
      isBuiltIn: true,
    })),
  );
}
