"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "./actions";
import { SaveBar } from "@/components/admin/SaveBar";
import { Field } from "@/components/admin/FormFields";
import type { SiteSettings, SocialLink } from "@prisma/client";

type Props = {
  settings: (SiteSettings & { socials: SocialLink[] }) | null;
};

export function SettingsForm({ settings }: Props) {
  const [title, setTitle] = useState(settings?.title ?? "Tenacity Business Growth Consultancy");
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone ?? "");
  const [footerText, setFooterText] = useState(settings?.footerText ?? "");
  const [socials, setSocials] = useState(
    settings?.socials ?? [],
  );
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSettings({ title, contactEmail, contactPhone, footerText, socials: socials.map((s, i) => ({ icon: s.icon, url: s.url, order: i })) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Contact Details</h2>
        <Field label="Site title">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>
        <Field label="Contact email">
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input" />
        </Field>
        <Field label="Contact phone">
          <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="input" placeholder="Optional" />
        </Field>
        <Field label="Footer text" hint="Short line at the bottom of every page">
          <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="input" />
        </Field>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Social Links</h2>
          <button
            type="button"
            onClick={() => setSocials((prev) => [...prev, { id: Date.now().toString(), icon: "linkedin", url: "", order: prev.length, siteSettingsId: "settings" }])}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            + Add
          </button>
        </div>
        {socials.map((social, i) => (
          <div key={social.id} className="flex gap-3 items-center">
            <select
              value={social.icon}
              onChange={(e) => setSocials((prev) => prev.map((s, j) => j === i ? { ...s, icon: e.target.value } : s))}
              className="input w-36"
            >
              {["linkedin", "twitter", "facebook", "instagram", "youtube"].map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <input
              type="url"
              value={social.url}
              onChange={(e) => setSocials((prev) => prev.map((s, j) => j === i ? { ...s, url: e.target.value } : s))}
              placeholder="https://…"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => setSocials((prev) => prev.filter((_, j) => j !== i))}
              className="text-xs text-red-400 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}
