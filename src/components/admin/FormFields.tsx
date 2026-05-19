type FieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint ? <p className="mb-1.5 text-xs text-gray-400">{hint}</p> : null}
      {children}
    </div>
  );
}

type TextareaProps = {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
};

export function Textarea({ value, onChange, rows = 4, placeholder }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}
