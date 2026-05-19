"use client";

import { useState, useTransition } from "react";
import type { Testimonial } from "@prisma/client";
import { saveTestimonial, deleteTestimonial } from "./actions";

type Props = { testimonials: Testimonial[] };

const EMPTY = { quote: "", name: "", role: "", company: "", featured: false };

export function TestimonialsManager({ testimonials: initial }: Props) {
  const [testimonials, setTestimonials] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [, startTransition] = useTransition();

  function startAdd() {
    setEditing("new");
    setForm(EMPTY);
  }

  function startEdit(t: Testimonial) {
    setEditing(t.id);
    setForm({ quote: t.quote, name: t.name, role: t.role ?? "", company: t.company ?? "", featured: t.featured });
  }

  function handleSave() {
    startTransition(async () => {
      await saveTestimonial({ id: editing === "new" ? undefined : (editing ?? undefined), ...form });
      setEditing(null);
      // Refresh by reloading (server component will re-fetch)
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    startTransition(async () => {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    });
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t) => (
        <div key={t.id} className="rounded-lg border border-gray-200 bg-white p-5">
          {editing === t.id ? (
            <TestimonialForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => setEditing(null)} />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-700">&#8220;{t.quote}&#8221;</p>
                <p className="mt-2 text-xs font-semibold text-gray-500">
                  — {t.name}{t.role ? `, ${t.role}` : ""}{t.company ? ` at ${t.company}` : ""}
                </p>
                {t.featured && <span className="mt-1 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(t)} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {editing === "new" ? (
        <div className="rounded-lg border border-blue-200 bg-white p-5">
          <h3 className="mb-4 font-medium text-gray-900">New testimonial</h3>
          <TestimonialForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      ) : (
        <button
          onClick={startAdd}
          className="w-full rounded-lg border border-dashed border-gray-300 py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600"
        >
          + Add testimonial
        </button>
      )}
    </div>
  );
}

type FormState = { quote: string; name: string; role: string; company: string; featured: boolean };

function TestimonialForm({
  form, setForm, onSave, onCancel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const upd = (field: keyof FormState, value: string | boolean) =>
    setForm({ ...form, [field]: value });

  return (
    <div className="space-y-3">
      <textarea value={form.quote} onChange={(e) => upd("quote", e.target.value)} rows={3} placeholder="Quote" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="text" value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Name" className="input" />
        <input type="text" value={form.role} onChange={(e) => upd("role", e.target.value)} placeholder="Role (optional)" className="input" />
        <input type="text" value={form.company} onChange={(e) => upd("company", e.target.value)} placeholder="Company (optional)" className="input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={form.featured} onChange={(e) => upd("featured", e.target.checked)} className="h-4 w-4 rounded" />
        Feature on homepage
      </label>
      <div className="flex gap-3">
        <button onClick={onSave} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">Save</button>
        <button onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  );
}
