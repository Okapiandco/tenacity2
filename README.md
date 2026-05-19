# Tenacity Business Growth Consultancy

Marketing website for [Tenacity Business Growth Consultancy](https://tenacity.co.uk), Becky Phillips's UK business growth consultancy.

## What this is

A small, fast, photography-led marketing site that Becky can edit herself. The site is built with Next.js 16 and deploys to Vercel. All content (text, photos, services, testimonials, contact details) lives in [Sanity](https://sanity.io) and is edited in a Studio embedded at `/studio`.

### Stack

- **Next.js 16** — App Router, TypeScript, React 19.2
- **Tailwind CSS v4** — CSS-first theme tokens in `src/app/globals.css`
- **Sanity Studio 5** — embedded at `/studio`, schemas in `src/sanity/schemaTypes/`
- **next-sanity 12** — `defineLive` for real-time preview, `urlFor()` image loader
- **Resend + Zod** — contact form delivery (`/api/contact`) with in-memory rate limit and honeypot
- **Framer Motion** — gentle reveal-on-scroll animations (respects `prefers-reduced-motion`)
- **Lucide** — service icons

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID (from sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `SANITY_API_READ_TOKEN` | Viewer token, needed on the server for private datasets + live preview |
| `SANITY_API_WRITE_TOKEN` | Editor token, only used by `scripts/seed.ts` |
| `RESEND_API_KEY` | API key from resend.com |
| `CONTACT_TO_EMAIL` | Fallback address if `contactPage.recipientEmail` is empty in Sanity |
| `RESEND_FROM_EMAIL` | Verified sender. Defaults to `onboarding@resend.dev` until you verify `tenacity.co.uk` in Resend |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used by sitemap, OG images, JSON-LD) |

### CORS

Once you have a Sanity project ID, add these origins in Sanity Manage → API → CORS Origins (tick "Allow credentials"):
- `http://localhost:3000` (local dev)
- Your Vercel preview URL
- Your production URL

Without these the Studio can't authenticate and the live preview fails the preflight check.

## Sanity Studio — how Becky edits content

### Logging in

1. Go to **https://tenacity.co.uk/studio** (or `/studio` on the preview URL).
2. Sign in with the Google or GitHub account you used when the project was set up in Sanity. The first time only, Becky accepts an invite from Sanity.

### Editing text

The left sidebar groups everything by page:

- **Site settings** — global name, logo, contact email, footer text, social links
- **Homepage** — hero, dictionary-definition line, intro paragraph, CTA band quote, CTAs
- **About page** — short bio (used on the home-page teaser), full bio (used on `/about`), portrait, gallery
- **Pricing page** — heading, body, CTA label/link
- **Contact page** — intro copy, hero image, *recipient email* (the address form enquiries are sent to)
- **Services** — 5 services, each with title, icon, short description, hero image, full body, "what this includes" list, CTA
- **Testimonials** — add as many as you like; tick **Featured** to make a testimonial show up on the home page

1. Click a document in the sidebar.
2. Edit any field.
3. Click **Publish** (bottom right). Changes go live within seconds.

> `TODO: screenshot of the Studio editor with a field being changed`

### Swapping a photo

1. Open the document that shows the photo (for example **Homepage** for the intro photo).
2. Click the photo to open it, then **Remove** or **Upload**.
3. Drop the new file in.
4. **Always fill in the Alternative text field** — this is required for accessibility and shows up for screen readers and if the image fails to load.
5. Publish.

> `TODO: screenshot of the media browser with alt text highlighted`

### Adding a testimonial

1. In the sidebar, click **Testimonials → + Create**.
2. Fill in the quote, name, role (optional), company (optional), photo (optional).
3. Tick **Featured** if you want it to appear on the home page carousel.
4. Publish.

The home page testimonials section hides itself automatically while there are none, and reappears once the first is published.

> `TODO: screenshot of the testimonial form`

### Publishing

Nothing is live until you hit **Publish**. Until then the change is saved as a draft that only you (and anyone logged into Studio) can see.

To undo, click the **⋮** menu on a document and choose **Revert changes**.

> `TODO: screenshot of Publish button and revision history`

## Deploying

### First time

1. Push this repo to GitHub.
2. Create a new Vercel project, connect the GitHub repo.
3. Add all env vars in Vercel dashboard for both **Production** and **Preview** environments.
4. In Sanity Manage → API → CORS Origins, add both the Vercel production URL and the Vercel preview domain (`*.vercel.app`) with credentials.
5. Once the domain `tenacity.co.uk` is pointed at Vercel, update `NEXT_PUBLIC_SITE_URL` to `https://tenacity.co.uk` and verify the domain in Resend so emails can send from `noreply@tenacity.co.uk`.

### Ongoing

- **`main` branch** → deploys to production automatically on push.
- **Any other branch / PR** → deploys a Vercel preview URL.

## Folder structure

```
tenacity/
├── public/                         Logo + Becky's source photos
├── sanity.config.ts                Studio config (singletons, desk structure)
├── scripts/
│   └── seed.ts                     One-off content seeder (pnpm tsx scripts/seed.ts)
└── src/
    ├── app/
    │   ├── (site)/                 Marketing routes (header/footer chrome)
    │   │   ├── page.tsx            Home
    │   │   ├── about/page.tsx
    │   │   ├── services/
    │   │   │   ├── page.tsx        Services overview
    │   │   │   └── [slug]/page.tsx Service detail (static generated per slug)
    │   │   ├── pricing/page.tsx
    │   │   └── contact/page.tsx
    │   ├── api/contact/route.ts    Zod-validated form handler, Resend send
    │   ├── studio/[[...tool]]/     Embedded Sanity Studio
    │   ├── sitemap.ts              /sitemap.xml
    │   ├── robots.ts               /robots.txt
    │   ├── opengraph-image.tsx     /opengraph-image (branded OG PNG)
    │   ├── layout.tsx              Root layout: fonts, metadata, JSON-LD, SanityLive
    │   └── globals.css             Tailwind + brand tokens
    ├── components/
    │   ├── contact/ContactForm.tsx
    │   ├── home/                   Home-page sections
    │   ├── layout/                 Header, Footer, Nav
    │   ├── seo/StructuredData.tsx
    │   ├── services/ServiceCardGrid.tsx
    │   └── ui/                     Button, Card, Container, Dot, Heading, PT, Reveal, SanityImage, Section, ServiceIcon
    ├── lib/
    │   ├── cn.ts                   clsx + tailwind-merge helper
    │   └── contact-schema.ts       Shared Zod schema
    └── sanity/
        ├── env.ts                  Env var assertion
        ├── structure.ts            Sidebar grouping + singleton lockdown
        ├── schemaTypes/            Documents + reusable object types
        └── lib/                    client.ts, live.ts (defineLive), image.ts (urlFor)
```

## Re-running the seed

The seed script is idempotent via `createOrReplace` and content-addressed asset dedupe. If you change the source copy (e.g. Draft Web Copy.docx) and want to overwrite everything:

```bash
pnpm tsx scripts/seed.ts
```

## Design rules (please keep these)

- White background everywhere, no dark mode
- UK English throughout (colour, organisation, programme, specialise)
- No em dashes in UI copy, use commas, colons, or "and"
- Never use stock photos, Becky's own photos only
- Every image must have alt text
- Contrast target is WCAG 2.2 AA, which means `text-brand-ink` (not the lighter `text-brand`) for small text on white
