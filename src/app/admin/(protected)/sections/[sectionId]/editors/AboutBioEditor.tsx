"use client";

import { useState, useTransition } from "react";
import { saveSection } from "../actions";
import { Field, Textarea } from "@/components/admin/FormFields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";

type Props = { sectionId: string; content: Record<string, unknown> };

export function AboutBioEditor({ sectionId, content }: Props) {
  const [bioPartOne, setBioPartOne] = useState((content.bioPartOne as string) ?? "");
  const [bioPartTwo, setBioPartTwo] = useState((content.bioPartTwo as string) ?? "");
  const [portrait, setPortrait] = useState((content.portrait as string) ?? "");
  const [bioImageTwo, setBioImageTwo] = useState((content.bioImageTwo as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { bioPartOne, bioPartTwo, portrait, bioImageTwo });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Bio — Part One</h2>
        <Field label="Text" hint="Use two blank lines for paragraph breaks">
          <Textarea value={bioPartOne} onChange={setBioPartOne} rows={8} />
        </Field>
        <ImageUploadField label="Portrait photo" value={portrait} onChange={setPortrait} />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Bio — Part Two</h2>
        <Field label="Text" hint="Use two blank lines for paragraph breaks">
          <Textarea value={bioPartTwo} onChange={setBioPartTwo} rows={8} />
        </Field>
        <ImageUploadField label="Second photo" value={bioImageTwo} onChange={setBioImageTwo} />
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
