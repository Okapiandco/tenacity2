"use client";

import { useState, useTransition } from "react";
import type { Service } from "@prisma/client";
import { saveService } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Field, Textarea } from "@/components/admin/FormFields";

type ServicesListItem = { label: string; description?: string };

type Props = { service: Service };

export function ServiceEditorForm({ service }: Props) {
  const [title, setTitle] = useState(service.title);
  const [shortDescription, setShortDescription] = useState(service.shortDescription);
  const [heroImageUrl, setHeroImageUrl] = useState(service.heroImageUrl ?? "");
  const [heroImageAlt, setHeroImageAlt] = useState(service.heroImageAlt ?? "");
  const [body, setBody] = useState(service.body ?? "");
  const [servicesList, setServicesList] = useState<ServicesListItem[]>(
    (service.servicesList as ServicesListItem[]) ?? [],
  );
  const [ctaLabel, setCtaLabel] = useState(service.ctaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(service.ctaHref ?? "");
  const [hidden, setHidden] = useState(service.hidden ?? false);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function updateListItem(index: number, field: keyof ServicesListItem, value: string) {
    setServicesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function addListItem() {
    setServicesList((prev) => [...prev, { label: "", description: "" }]);
  }

  function removeListItem(index: number) {
    setServicesList((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    startTransition(async () => {
      await saveService(service.id, {
        title,
        shortDescription,
        heroImageUrl,
        heroImageAlt,
        body,
        servicesList: servicesList.filter((i) => i.label.trim()),
        ctaLabel,
        ctaHref,
        hidden,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <p className="font-semibold text-gray-800">Visibility</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {hidden ? "Hidden from public — record kept in admin" : "Visible to the public"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!hidden}
            onClick={() => setHidden((h) => !h)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-ink ${hidden ? "bg-gray-300" : "bg-brand-ink"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${hidden ? "translate-x-0" : "translate-x-5"}`} />
          </button>
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Basic Info</h2>
        <Field label="Service title" required>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>
        <Field label="Short description" hint="One sentence shown on the services overview and cards">
          <Textarea value={shortDescription} onChange={setShortDescription} rows={2} />
        </Field>
        <ImageUploadField label="Hero image" value={heroImageUrl} onChange={setHeroImageUrl} />
        <Field label="Hero image alt text">
          <input type="text" value={heroImageAlt} onChange={(e) => setHeroImageAlt(e.target.value)} className="input" placeholder="Becky Phillips coaching a client" />
        </Field>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Body Content</h2>
        <Field label="Body text" hint="Use two blank lines for paragraph breaks">
          <Textarea value={body} onChange={setBody} rows={10} />
        </Field>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">&#8220;Let&#8217;s Get to Work&#8221; List</h2>
          <button
            type="button"
            onClick={addListItem}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            + Add item
          </button>
        </div>
        {servicesList.map((item, i) => (
          <div key={i} className="flex gap-3 items-start rounded-md border border-gray-100 p-3">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateListItem(i, "label", e.target.value)}
                placeholder="Item label"
                className="input"
              />
              <input
                type="text"
                value={item.description ?? ""}
                onChange={(e) => updateListItem(i, "description", e.target.value)}
                placeholder="Short description (optional)"
                className="input text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeListItem(i)}
              className="text-xs text-red-400 hover:text-red-700 mt-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Call to Action</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label">
            <input type="text" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="input" placeholder="Book a discovery call" />
          </Field>
          <Field label="Button link">
            <input type="text" value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="input" placeholder="/contact" />
          </Field>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
