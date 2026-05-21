"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const CONSENT_KEY = "tenacity_cookie_consent";

export type CookieConsent = "accepted" | "declined" | null;

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as CookieConsent) ?? null;
}

function clearAllCookies() {
  const cookies = document.cookie.split(";");
  const hostname = window.location.hostname;
  
  // Try to extract root domain (e.g. tenacity.co.uk from www.tenacity.co.uk or similar)
  const domainParts = hostname.split(".");
  const rootDomain = domainParts.length > 2 ? `.${domainParts.slice(-2).join(".")}` : `.${hostname}`;

  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${rootDomain}`;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- state is checked on client side only to prevent Next.js SSR hydration mismatches
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    clearAllCookies();
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 hidden border-t border-border bg-white px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-6 md:block"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink/80">
          We use cookies to improve your experience and, in future, to understand
          how you use our site. You can accept or decline non-essential cookies.{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-brand-ink"
          >
            Cookie policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={decline}
            className="min-w-[90px]"
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={accept}
            className="min-w-[90px]"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
