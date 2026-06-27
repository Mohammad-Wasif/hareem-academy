import { Router, type IRouter } from "express";
import { db, formFieldsTable } from "@workspace/db";
import { asc, eq, and } from "drizzle-orm";
import { ensureBuiltInEnrollmentFields } from "../lib/formFieldsSeed";

const router: IRouter = Router();

router.get("/form-fields/:formKey", async (req, res) => {
  try {
    if (req.params.formKey === "enrollment") {
      await ensureBuiltInEnrollmentFields();
    }
    const rows = await db
      .select()
      .from(formFieldsTable)
      .where(
        and(
          eq(formFieldsTable.formKey, req.params.formKey),
          eq(formFieldsTable.enabled, true),
        ),
      )
      .orderBy(asc(formFieldsTable.sortOrder), asc(formFieldsTable.id));
    res.json(
      rows.map((f: any) => ({
        id: f.id,
        formKey: f.formKey,
        fieldKey: f.fieldKey,
        label: f.label,
        fieldType: f.fieldType,
        placeholder: f.placeholder ?? null,
        helpText: f.helpText ?? null,
        required: f.required,
        options: f.options ?? [],
        sortOrder: f.sortOrder,
        isBuiltIn: f.isBuiltIn,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list form fields");
    res.status(500).json({ error: "Failed to list form fields" });
  }
});

export default router;
