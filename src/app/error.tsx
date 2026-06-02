"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">500</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        We&rsquo;re sorry — an unexpected error occurred. Please try again, or get in touch if the problem persists.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-ink/90"
        >
          Try again
        </button>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border border-brand-ink/20 px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink/40"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
