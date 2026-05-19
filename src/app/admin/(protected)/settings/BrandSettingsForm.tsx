"use client";

import { useState, useTransition } from "react";
import { saveBrandSettings } from "./actions";
import { SaveBar } from "@/components/admin/SaveBar";
import { Field } from "@/components/admin/FormFields";

const FONT_OPTIONS = [
  { label: "Montserrat (current)", value: "Montserrat" },
  { label: "Inter", value: "Inter" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Lato", value: "Lato" },
];

type Brand = { primaryColor: string; accentColor: string; inkColor: string; headingFont: string; bodyFont: string };

type Props = { brand: Brand };

export function BrandSettingsForm({ brand: initial }: Props) {
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor);
  const [accentColor, setAccentColor] = useState(initial.accentColor);
  const [inkColor, setInkColor] = useState(initial.inkColor);
  const [headingFont, setHeadingFont] = useState(initial.headingFont);
  const [bodyFont, setBodyFont] = useState(initial.bodyFont);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveBrandSettings({ primaryColor, accentColor, inkColor, headingFont, bodyFont });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Colours</h2>
        <p className="text-xs text-gray-500">Changes apply site-wide — refresh the public site after saving to see the effect.</p>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Primary (brand) colour">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-200 bg-white p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="input font-mono text-sm"
                placeholder="#7694b6"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Used for nav, buttons, and brand sections</p>
          </Field>

          <Field label="Accent colour">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-200 bg-white p-0.5"
              />
              <input
                type="text"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
                className="input font-mono text-sm"
                placeholder="#ffc2c2"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Used for highlights and decorative dots</p>
          </Field>

          <Field label="Text colour">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={inkColor}
                onChange={e => setInkColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border border-gray-200 bg-white p-0.5"
              />
              <input
                type="text"
                value={inkColor}
                onChange={e => setInkColor(e.target.value)}
                className="input font-mono text-sm"
                placeholder="#6b6b6b"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Main body text colour</p>
          </Field>
        </div>

        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Preview</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-8 w-24 rounded" style={{ backgroundColor: primaryColor }} title="Primary" />
            <div className="h-8 w-24 rounded" style={{ backgroundColor: accentColor }} title="Accent" />
            <div className="h-8 w-24 rounded border border-gray-200" style={{ backgroundColor: inkColor }} title="Ink" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Fonts</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Heading font">
            <select value={headingFont} onChange={e => setHeadingFont(e.target.value)} className="input">
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <p className="mt-2 text-sm" style={{ fontFamily: headingFont }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </Field>
          <Field label="Body font">
            <select value={bodyFont} onChange={e => setBodyFont(e.target.value)} className="input">
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <p className="mt-2 text-sm" style={{ fontFamily: bodyFont }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </Field>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
