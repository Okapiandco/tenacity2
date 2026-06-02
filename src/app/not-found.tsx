import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Sorry — we could not find the page you were looking for. It may have moved or been removed.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-ink/90"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border border-brand-ink/20 px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink/40"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
