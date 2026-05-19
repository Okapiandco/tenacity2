"use client";

import { useState, useTransition } from "react";
import { saveSection } from "../actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Field, Textarea } from "@/components/admin/FormFields";

type Props = {
  sectionId: string;
  content: Record<string, unknown>;
};

export function IntroEditor({ sectionId, content }: Props) {
  const [paragraph, setParagraph] = useState((content.paragraph as string) ?? "");
  const [photoBottom, setPhotoBottom] = useState((content.photoBottom as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { paragraph, photoBottom });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Introduction Section</h2>

        <Field label="Paragraph text" hint="Use two blank lines to create paragraph breaks" required>
          <Textarea
            value={paragraph}
            onChange={setParagraph}
            rows={8}
            placeholder="At Tenacity, we believe every small business owner…"
          />
        </Field>

        <ImageUploadField
          label="Side image"
          value={photoBottom}
          onChange={setPhotoBottom}
        />
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
