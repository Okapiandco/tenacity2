"use client";

import { useState, useId, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import {
  contactSchema,
  HEAR_ABOUT_OPTIONS,
  type ContactPayload,
} from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

function FieldWrapper({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink"
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-brand-ink" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "mt-2 block w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted focus:border-brand focus-visible:outline-none";

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyId = useId();
  const messageId = useId();
  const hearAboutId = useId();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setGlobalError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in fieldErrors)) {
          fieldErrors[key as keyof ContactPayload] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setGlobalError(
          json.error || "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setGlobalError("Could not reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-accent bg-accent/30 p-6"
      >
        <p className="text-lg font-semibold text-ink">
          Thank you, message received.
        </p>
        <p className="mt-2 text-sm text-ink/80">
          Becky will reply as soon as she can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={status === "loading"}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper id={nameId} label="Name" required error={errors.name}>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={cn(inputClass, errors.name && "border-red-500")}
          />
        </FieldWrapper>
        <FieldWrapper id={emailId} label="Email" required error={errors.email}>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={cn(inputClass, errors.email && "border-red-500")}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper id={phoneId} label="Phone" error={errors.phone}>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={cn(inputClass, errors.phone && "border-red-500")}
          />
        </FieldWrapper>
        <FieldWrapper id={companyId} label="Company" error={errors.company}>
          <input
            id={companyId}
            name="company"
            type="text"
            autoComplete="organization"
            className={cn(inputClass, errors.company && "border-red-500")}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        id={hearAboutId}
        label="How did you hear about us?"
      >
        <select
          id={hearAboutId}
          name="hearAbout"
          defaultValue=""
          className={cn(inputClass, "bg-white pr-10")}
        >
          <option value="">Please choose</option>
          {HEAR_ABOUT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper
        id={messageId}
        label="Message"
        required
        error={errors.message}
      >
        <textarea
          id={messageId}
          name="message"
          rows={6}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className={cn(inputClass, "resize-y", errors.message && "border-red-500")}
        />
      </FieldWrapper>

      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {globalError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {globalError}
        </div>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending\u2026" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
