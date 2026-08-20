'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const GA_MEASUREMENT_ID = 'G-NQHE02JYK4'
const STORAGE_KEY = 'tenacity-cookie-consent'

type Choice = 'accepted' | 'declined'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Cookie consent banner using Google Consent Mode v2.
 *
 * GA loads on every page and, until the visitor accepts, runs in a cookieless
 * "denied" state: no analytics cookies are set (UK PECR / GDPR compliant), but
 * Google still receives cookieless pings and models the traffic. Accepting
 * upgrades consent to "granted"; declining keeps it denied. The choice is
 * remembered in localStorage and re-applied on the returning visitor's first hit.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null | undefined>(undefined)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setChoice(stored === 'accepted' || stored === 'declined' ? stored : null)
    } catch {
      setChoice(null)
    }
  }, [])

  function decide(value: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* ignore storage errors */
    }
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: value === 'accepted' ? 'granted' : 'denied',
      })
    }
    setChoice(value)
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          var stored = null;
          try { stored = localStorage.getItem('${STORAGE_KEY}'); } catch (e) {}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: stored === 'accepted' ? 'granted' : 'denied',
            wait_for_update: 500,
          });
          gtag('set', 'url_passthrough', true);

          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      {choice === null && (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl sm:flex sm:items-center sm:gap-6 sm:p-5">
            <p className="text-sm text-gray-600">
              We use cookies to understand how the site is used and improve it.
              Analytics cookies are only set if you accept. See our{' '}
              <Link href="/privacy" className="font-medium underline">
                privacy policy
              </Link>
              .
            </p>
            <div className="mt-3 flex shrink-0 gap-3 sm:mt-0">
              <button
                onClick={() => decide('declined')}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Decline
              </button>
              <button
                onClick={() => decide('accepted')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
