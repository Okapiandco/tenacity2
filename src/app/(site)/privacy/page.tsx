import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy",
  description:
    "Privacy and cookie policy for Tenacity Business Growth Consultancy.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "May 2025";
const CONTACT_EMAIL = "becky@tenacity.co.uk";
const SITE_NAME = "Tenacity Business Growth Consultancy";
const SITE_URL = "https://tenacity.co.uk";

export default function PrivacyPage() {
  return (
    <Section tone="white" padding="lg">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Privacy &amp; Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <div className="prose-policy mt-12 space-y-10 text-base leading-relaxed text-ink/85">

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">1. Who we are</h2>
              <p>
                This website is operated by {SITE_NAME} (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, &ldquo;our&rdquo;). We are the data controller
                for any personal information collected through{" "}
                <span className="font-medium">{SITE_URL}</span>.
              </p>
              <p>
                If you have any questions about this policy, please contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-brand-ink underline underline-offset-2 hover:text-ink"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                2. What information we collect
              </h2>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Contact form submissions</strong> — your name, email
                  address and any message you send us.
                </li>
                <li>
                  <strong>Analytics data</strong> — anonymised information about
                  how you use our website (pages visited, time on site, device
                  type). This is only collected with your consent.
                </li>
              </ul>
              <p>We do not collect payment information or sensitive personal data.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                3. How we use your information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Respond to enquiries you send via our contact form.</li>
                <li>
                  Understand how our website is used so we can improve it
                  (analytics, with consent only).
                </li>
                <li>Comply with our legal obligations.</li>
              </ul>
              <p>
                We will never sell your personal data or share it with third
                parties for marketing purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                4. Legal basis for processing
              </h2>
              <p>We process your data on the following legal bases:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Legitimate interest</strong> — responding to contact
                  form enquiries.
                </li>
                <li>
                  <strong>Consent</strong> — analytics cookies. You can withdraw
                  consent at any time by declining cookies or clearing your
                  browser data.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">5. Cookies</h2>
              <p>
                Cookies are small text files stored on your device. We use
                cookies for the following purposes:
              </p>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-ink">Cookie</th>
                      <th className="px-4 py-3 font-semibold text-ink">Purpose</th>
                      <th className="px-4 py-3 font-semibold text-ink">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">tenacity_cookie_consent</td>
                      <td className="px-4 py-3">Stores your cookie preference so we do not ask again.</td>
                      <td className="px-4 py-3">Essential</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">Analytics cookies</td>
                      <td className="px-4 py-3">Used to understand how visitors use our site. Not yet active — will only be set with your consent.</td>
                      <td className="px-4 py-3">Analytics (with consent)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                You can change your cookie preference at any time by clearing
                your browser&rsquo;s local storage or cookies, which will cause
                the consent banner to reappear on your next visit.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                6. How long we keep your data
              </h2>
              <p>
                Contact form enquiries are stored securely and retained only as
                long as necessary to respond to your message. You may request
                deletion at any time by emailing us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">7. Your rights</h2>
              <p>Under UK GDPR you have the right to:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Access the personal data we hold about you.</li>
                <li>Ask us to correct inaccurate data.</li>
                <li>Ask us to delete your data.</li>
                <li>Withdraw consent for analytics at any time.</li>
                <li>Lodge a complaint with the ICO at{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-ink underline underline-offset-2 hover:text-ink"
                  >
                    ico.org.uk
                  </a>
                  .
                </li>
              </ul>
              <p>
                To exercise any of these rights, email us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-brand-ink underline underline-offset-2 hover:text-ink"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                8. Third-party services
              </h2>
              <p>
                Our website is hosted on Vercel. Contact form submissions are
                processed via Resend. Both services have their own privacy
                policies. We do not share your data with any other third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-ink">
                9. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time. The &ldquo;last
                updated&rdquo; date at the top of this page will reflect any
                changes. Continued use of the site after an update constitutes
                acceptance of the revised policy.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </Section>
  );
}
