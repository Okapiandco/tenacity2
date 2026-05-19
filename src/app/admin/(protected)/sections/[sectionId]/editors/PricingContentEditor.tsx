"use client";

import { useState, useTransition } from "react";
import { saveSection } from "../actions";
import { Field, Textarea } from "@/components/admin/FormFields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";

type Props = { sectionId: string; content: Record<string, unknown> };

export function PricingContentEditor({ sectionId, content }: Props) {
  const [heading, setHeading] = useState((content.heading as string) ?? "");
  const [introText, setIntroText] = useState((content.introText as string) ?? "");
  const [body, setBody] = useState((content.body as string) ?? "");
  const [closingText, setClosingText] = useState((content.closingText as string) ?? "");
  const [ctaLabel, setCtaLabel] = useState((content.ctaLabel as string) ?? "");
  const [ctaHref, setCtaHref] = useState((content.ctaHref as string) ?? "/contact");
  const [heroImage, setHeroImage] = useState((content.heroImage as string) ?? "");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSection(sectionId, { heading, introText, body, closingText, ctaLabel, ctaHref, heroImage });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Pricing Page Content</h2>
        <Field label="Heading">
          <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className="input" />
        </Field>
        <Field label="Intro text" hint="Shown above the bullet points. Use two blank lines for paragraph breaks">
          <Textarea value={introText} onChange={setIntroText} rows={6} />
        </Field>
        <Field label="Bullet points" hint="Each paragraph (separated by a blank line) becomes one pink bullet point">
          <Textarea value={body} onChange={setBody} rows={8} />
        </Field>
        <Field label="Closing paragraph" hint="Shown below the bullet points">
          <Textarea value={closingText} onChange={setClosingText} rows={3} />
        </Field>
        <ImageUploadField label="Photo" value={heroImage} onChange={setHeroImage} />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Call to Action</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label">
            <input type="text" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} className="input" placeholder="Enquire about pricing" />
          </Field>
          <Field label="Button link">
            <input type="text" value={ctaHref} onChange={e => setCtaHref(e.target.value)} className="input" placeholder="/contact" />
          </Field>
        </div>
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
