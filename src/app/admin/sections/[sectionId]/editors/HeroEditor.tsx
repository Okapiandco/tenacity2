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

export function HeroEditor({ sectionId, content }: Props) {
  const [definition, setDefinition] = useState((content.definition as string) ?? "");
  const [headline, setHeadline] = useState((content.headline as string) ?? "");
  const [subhead, setSubhead] = useState((content.subhead as string) ?? "");
  const [backgroundImage, setBackgroundImage] = useState((content.backgroundImage as string) ?? "");
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState((content.primaryCtaLabel as string) ?? "");
  const [primaryCtaHref, setPrimaryCtaHref] = useState((content.primaryCtaHref as string) ?? "");
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState((content.secondaryCtaLabel as string) ?? "");
  const [secondaryCtaHref, setSecondaryCtaHref] = useState((content.secondaryCtaHref as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, {
        definition,
        headline,
        subhead,
        backgroundImage,
        primaryCtaLabel,
        primaryCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Hero Content</h2>

        <Field label="Dictionary definition line" hint="Appears above the headline in small caps">
          <input
            type="text"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="input"
            placeholder="tenacity /tɪˈnæs.ɪ.ti/: the quality of being very determined"
          />
        </Field>

        <Field label="Headline" required>
          <Textarea
            value={headline}
            onChange={setHeadline}
            placeholder="Supporting UK small business owners and leaders"
            rows={2}
          />
        </Field>

        <Field label="Subheading" hint="Optional sentence below the headline">
          <Textarea
            value={subhead}
            onChange={setSubhead}
            placeholder="Coaching, consultancy and leadership support…"
            rows={2}
          />
        </Field>

        <ImageUploadField
          label="Background image"
          value={backgroundImage}
          onChange={setBackgroundImage}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Call to Action Buttons</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary button label">
            <input type="text" value={primaryCtaLabel} onChange={(e) => setPrimaryCtaLabel(e.target.value)} className="input" placeholder="Work with us" />
          </Field>
          <Field label="Primary button link">
            <input type="text" value={primaryCtaHref} onChange={(e) => setPrimaryCtaHref(e.target.value)} className="input" placeholder="/contact" />
          </Field>
          <Field label="Secondary button label">
            <input type="text" value={secondaryCtaLabel} onChange={(e) => setSecondaryCtaLabel(e.target.value)} className="input" placeholder="Our services" />
          </Field>
          <Field label="Secondary button link">
            <input type="text" value={secondaryCtaHref} onChange={(e) => setSecondaryCtaHref(e.target.value)} className="input" placeholder="/services" />
          </Field>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
