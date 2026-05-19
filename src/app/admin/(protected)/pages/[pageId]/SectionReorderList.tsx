"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type SectionItem = {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  order: number;
};

type Props = {
  sections: SectionItem[];
  reorderAction: (orderedIds: string[]) => Promise<void>;
  toggleAction: (id: string, enabled: boolean) => Promise<void>;
};

export function SectionReorderList({ sections: initial, reorderAction, toggleAction }: Props) {
  const [sections, setSections] = useState(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...sections];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setSections(next);
    setDragIndex(index);
  }

  function handleDrop() {
    setDragIndex(null);
    startTransition(async () => {
      await reorderAction(sections.map((s) => s.id));
    });
  }

  function handleToggle(id: string, enabled: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    startTransition(async () => {
      await toggleAction(id, enabled);
    });
  }

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
          className={`flex items-center gap-4 rounded-lg border bg-white px-5 py-4 transition-all ${
            dragIndex === index ? "border-blue-400 shadow-md" : "border-gray-200"
          }`}
        >
          <span
            className="cursor-grab select-none text-gray-300 hover:text-gray-500"
            aria-label="Drag to reorder"
          >
            ⠿
          </span>

          <div className="flex-1">
            <p className="font-medium text-gray-900">{section.label}</p>
            <p className="text-xs text-gray-400">{section.type}</p>
          </div>

          {section.type !== "service_cards" && (
            <Link
              href={`/admin/sections/${section.id}`}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Edit
            </Link>
          )}

          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={(e) => handleToggle(section.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Visible
          </label>
        </div>
      ))}
    </div>
  );
}
