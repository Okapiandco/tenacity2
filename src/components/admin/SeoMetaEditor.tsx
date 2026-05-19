"use client";

import { useState, useTransition } from "react";
import { Field } from "@/components/admin/FormFields";

type Props = {
  metaTitle: string;
  metaDescription: string;
  onSave: (metaTitle: string, metaDescription: string) => Promise<void>;
};

export function SeoMetaEditor({ metaTitle: initialTitle, metaDescription: initialDesc, onSave }: Props) {
  const [metaTitle, setMetaTitle] = useState(initialTitle);
  const [metaDescription, setMetaDescription] = useState(initialDesc);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await onSave(metaTitle, metaDescription);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">SEO</h2>
          <p className="text-xs text-gray-400 mt-0.5">Controls how this page appears in Google search results</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${saved ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-gray-700"}`}
        >
          {saved ? "✓ Saved" : "Save SEO"}
        </button>
      </div>

      <Field label="Meta title" hint="Shown in browser tab and Google results — aim for 50–60 characters">
        <input
          type="text"
          value={metaTitle}
          onChange={e => setMetaTitle(e.target.value)}
          className="input"
          placeholder="Page title — Tenacity Business Growth Consultancy"
          maxLength={70}
        />
        <p className={`mt-1 text-xs ${metaTitle.length > 60 ? "text-amber-600" : "text-gray-400"}`}>
          {metaTitle.length} / 60 characters
        </p>
      </Field>

      <Field label="Meta description" hint="Shown under the title in Google results — aim for 140–160 characters">
        <textarea
          value={metaDescription}
          onChange={e => setMetaDescription(e.target.value)}
          rows={3}
          className="input"
          placeholder="A short sentence describing what visitors will find on this page."
          maxLength={200}
        />
        <p className={`mt-1 text-xs ${metaDescription.length > 160 ? "text-amber-600" : "text-gray-400"}`}>
          {metaDescription.length} / 160 characters
        </p>
      </Field>

      {(metaTitle || metaDescription) && (
        <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-medium text-gray-400">Google preview</p>
          <p className="text-sm font-medium text-blue-700 truncate">{metaTitle || "Page title"}</p>
          <p className="text-xs text-green-700">tenacity.co.uk</p>
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{metaDescription || "Page description"}</p>
        </div>
      )}
    </div>
  );
}
