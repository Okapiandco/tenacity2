"use client";

import { useState, useTransition } from "react";
import { saveSection } from "../actions";
import { Field, Textarea } from "@/components/admin/FormFields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";

type Props = { sectionId: string; content: Record<string, unknown> };

export function ContactContentEditor({ sectionId, content }: Props) {
  const [introCopy, setIntroCopy] = useState((content.introCopy as string) ?? "");
  const [heroImage, setHeroImage] = useState((content.heroImage as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { introCopy, heroImage });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Contact Page Content</h2>
        <Field label="Intro copy" hint="Use two blank lines for paragraph breaks">
          <Textarea value={introCopy} onChange={setIntroCopy} rows={6} />
        </Field>
        <ImageUploadField label="Photo" value={heroImage} onChange={setHeroImage} />
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
