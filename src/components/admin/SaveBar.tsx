"use client";

type Props = {
  onSave: () => void;
  saved: boolean;
};

export function SaveBar({ onSave, saved }: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4">
      {saved ? (
        <span className="text-sm font-medium text-green-600">✓ Changes saved</span>
      ) : (
        <span className="text-sm text-gray-400">Unsaved changes</span>
      )}
      <button
        onClick={onSave}
        className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Save changes
      </button>
    </div>
  );
}
