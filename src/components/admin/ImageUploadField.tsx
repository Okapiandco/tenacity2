"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {value ? (
        <div className="mb-3 flex items-start gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200">
            <Image src={value} alt="" fill className="object-cover" unoptimized={value.startsWith("/")} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 break-all">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          {uploading ? "Uploading…" : "Choose image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
            disabled={uploading}
          />
        </label>
        <span className="text-xs text-gray-400">or paste a URL:</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /public-path.jpg"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
