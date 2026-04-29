import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  AdminFormField,
  AdminFormFieldInput,
  FormFieldType,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Lock,
} from "lucide-react";

const EMPTY: AdminFormFieldInput = {
  formKey: "enrollment",
  fieldKey: "",
  label: "",
  fieldType: "text",
  placeholder: "",
  helpText: "",
  required: false,
  options: [],
  sortOrder: 0,
  enabled: true,
  isBuiltIn: false,
};

const TYPE_LABELS: Record<FormFieldType, string> = {
  text: "Short text",
  email: "Email",
  tel: "Phone number",
  number: "Number",
  textarea: "Long text",
  select: "Dropdown",
};

const ALWAYS_REQUIRED_BUILTINS = new Set([
  "courseSlug",
  "fullName",
  "age",
  "whatsappNumber",
  "city",
]);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

export default function AdminFormFields() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AdminFormField | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminFormFieldInput>(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "form-fields"],
    queryFn: () => adminApi.listFormFields(),
  });

  const saveMut = useMutation({
    mutationFn: () =>
      editing
        ? adminApi.updateFormField(editing.id, form)
        : adminApi.createFormField(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "form-fields"] });
      qc.invalidateQueries({ queryKey: ["form-fields"] });
      setOpen(false);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteFormField(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "form-fields"] });
      qc.invalidateQueries({ queryKey: ["form-fields"] });
    },
  });

  const toggleEnabledMut = useMutation({
    mutationFn: (f: AdminFormField) =>
      adminApi.updateFormField(f.id, { ...f, enabled: !f.enabled }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "form-fields"] });
      qc.invalidateQueries({ queryKey: ["form-fields"] });
    },
  });

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: (data?.length ?? 0) + 1 });
    setOpen(true);
  }

  function openEdit(f: AdminFormField) {
    setEditing(f);
    const { id: _id, ...rest } = f;
    setForm({
      ...rest,
      placeholder: rest.placeholder ?? "",
      helpText: rest.helpText ?? "",
    });
    setOpen(true);
  }

  const builtInFields = (data ?? []).filter((f) => f.isBuiltIn);
  const customFields = (data ?? []).filter((f) => !f.isBuiltIn);

  function FieldCard({ f }: { f: AdminFormField }) {
    const lockedRequired = ALWAYS_REQUIRED_BUILTINS.has(f.fieldKey);
    return (
      <div
        className={`bg-white rounded-xl border border-border/50 p-4 flex items-start gap-3 ${
          f.enabled ? "" : "opacity-60"
        }`}
      >
        {f.isBuiltIn ? (
          <Lock className="w-4 h-4 text-muted-foreground/50 mt-1.5" />
        ) : (
          <GripVertical className="w-5 h-5 text-muted-foreground/40 mt-1" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{f.label}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
              {TYPE_LABELS[f.fieldType] ?? f.fieldType}
            </span>
            {f.required && (
              <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-foreground/70">
                Required
              </span>
            )}
            {!f.enabled && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Hidden
              </span>
            )}
            {f.isBuiltIn && (
              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                Built-in
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Key: <code>{f.fieldKey}</code> · Order: {f.sortOrder}
          </div>
          {f.fieldType === "select" && f.options.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Options: {f.options.join(", ")}
            </div>
          )}
          {f.helpText && (
            <div className="text-xs text-muted-foreground mt-1 italic">
              {f.helpText}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!lockedRequired && (
            <Switch
              checked={f.enabled}
              onCheckedChange={() => toggleEnabledMut.mutate(f)}
            />
          )}
          <Button size="sm" variant="ghost" onClick={() => openEdit(f)}>
            <Pencil className="w-4 h-4" />
          </Button>
          {!f.isBuiltIn && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm(`Delete field "${f.label}"?`)) delMut.mutate(f.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  const isEditingBuiltIn = !!editing?.isBuiltIn;
  const editingLockedRequired =
    editing && ALWAYS_REQUIRED_BUILTINS.has(editing.fieldKey);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">
            Form Fields
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Customize what appears on your registration form. Edit the labels
            of built-in fields, hide optional ones, and add your own custom
            questions below.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> New Custom Field
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-serif text-xl text-primary font-semibold">
                Built-in Fields
              </h2>
              <span className="text-xs text-muted-foreground">
                Always part of every registration
              </span>
            </div>
            <div className="space-y-3">
              {builtInFields.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Loading built-in fields...
                </div>
              ) : (
                builtInFields.map((f) => <FieldCard key={f.id} f={f} />)
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-serif text-xl text-primary font-semibold">
                Custom Fields
              </h2>
              <span className="text-xs text-muted-foreground">
                Your own questions
              </span>
            </div>
            <div className="space-y-3">
              {customFields.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                  No custom fields yet. Click "New Custom Field" to add one
                  (e.g. "How did you hear about us?").
                </div>
              ) : (
                customFields.map((f) => <FieldCard key={f.id} f={f} />)
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-primary">
              {editing
                ? isEditingBuiltIn
                  ? `Edit Built-in Field`
                  : "Edit Field"
                : "New Custom Field"}
            </DialogTitle>
            <DialogDescription>
              {isEditingBuiltIn
                ? "Built-in fields are always shown. You can rename their label and edit help text."
                : "Add or edit a custom question on your registration form."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isEditingBuiltIn && !form.fieldKey) {
                setForm((f) => ({ ...f, fieldKey: slugify(form.label) }));
                return;
              }
              saveMut.mutate();
            }}
            className="space-y-4"
          >
            {saveMut.isError && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
                {(saveMut.error as Error)?.message ?? "Failed to save"}
              </p>
            )}

            <div className="space-y-2">
              <Label>Label (what students see)</Label>
              <Input
                value={form.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setForm((f) => ({
                    ...f,
                    label,
                    fieldKey:
                      !editing &&
                      (!f.fieldKey || f.fieldKey === slugify(f.label))
                        ? slugify(label)
                        : f.fieldKey,
                  }));
                }}
                placeholder="e.g. Have you studied Arabic before?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select
                  value={form.fieldType}
                  disabled={isEditingBuiltIn}
                  onValueChange={(v) =>
                    setForm({ ...form, fieldType: v as FormFieldType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Internal Key</Label>
              <Input
                value={form.fieldKey}
                disabled={isEditingBuiltIn}
                onChange={(e) =>
                  setForm({ ...form, fieldKey: slugify(e.target.value) })
                }
                placeholder="auto-generated from label"
                required
              />
              {!isEditingBuiltIn && (
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, and underscores only. Used to identify this
                  field internally.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Placeholder (optional)</Label>
              <Input
                value={form.placeholder ?? ""}
                onChange={(e) =>
                  setForm({ ...form, placeholder: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Help Text (optional)</Label>
              <Input
                value={form.helpText ?? ""}
                onChange={(e) =>
                  setForm({ ...form, helpText: e.target.value })
                }
                placeholder="Small note shown below the field"
              />
            </div>

            {form.fieldType === "select" && !isEditingBuiltIn && (
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  Dropdown Options
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setForm({ ...form, options: [...form.options, ""] })
                    }
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Option
                  </Button>
                </Label>
                <div className="space-y-2">
                  {form.options.map((o, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={o}
                        onChange={(e) => {
                          const next = [...form.options];
                          next[i] = e.target.value;
                          setForm({ ...form, options: next });
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setForm({
                            ...form,
                            options: form.options.filter((_, idx) => idx !== i),
                          })
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {form.options.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add at least one option.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.required}
                  disabled={!!editingLockedRequired}
                  onCheckedChange={(v) => setForm({ ...form, required: v })}
                />
                <Label className="!m-0">Required</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.enabled}
                  disabled={!!editingLockedRequired}
                  onCheckedChange={(v) => setForm({ ...form, enabled: v })}
                />
                <Label className="!m-0">Show on form</Label>
              </div>
            </div>
            {editingLockedRequired && (
              <p className="text-xs text-muted-foreground">
                This field is essential and cannot be hidden or made optional.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMut.isPending}>
                {saveMut.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
