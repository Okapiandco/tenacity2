"use client";

import { useState, useTransition } from "react";
import { saveSection } from "../actions";
import { SaveBar } from "@/components/admin/SaveBar";
import { Field, Textarea } from "@/components/admin/FormFields";

type Props = {
  sectionId: string;
  content: Record<string, unknown>;
};

export function CtaBandEditor({ sectionId, content }: Props) {
  const [quote, setQuote] = useState((content.quote as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { quote });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Call to Action Band</h2>

        <Field label="Quote / headline" hint="Shown in large type inside the dark banner" required>
          <Textarea
            value={quote}
            onChange={setQuote}
            rows={3}
            placeholder="The best investment you can make is in yourself and your business."
          />
        </Field>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
