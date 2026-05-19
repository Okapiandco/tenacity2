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

export function AboutTeaserEditor({ sectionId, content }: Props) {
  const [shortBio, setShortBio] = useState((content.shortBio as string) ?? "");
  const [image, setImage] = useState((content.image as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { shortBio, image });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Meet Becky — About Teaser</h2>

        <Field label="Short bio" hint="Use two blank lines to create paragraph breaks. First two paragraphs are shown." required>
          <Textarea
            value={shortBio}
            onChange={setShortBio}
            rows={8}
            placeholder="Becky Phillips is a three-time entrepreneur…"
          />
        </Field>

        <ImageUploadField
          label="Portrait photo"
          value={image}
          onChange={setImage}
        />
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
