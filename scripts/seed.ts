/**
 * Run with: pnpm tsx scripts/seed.ts
 *
 * Reads env from .env.local, uploads images from public/ to Sanity, and
 * createOrReplaces every singleton + service document with Becky's copy
 * (from Draft Web Copy.docx, cleaned of em dashes per client rule).
 */

import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET,
  SANITY_API_WRITE_TOKEN,
} = process.env;

if (
  !NEXT_PUBLIC_SANITY_PROJECT_ID ||
  !NEXT_PUBLIC_SANITY_DATASET ||
  !SANITY_API_WRITE_TOKEN
) {
  throw new Error(
    "Missing env. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN are set in .env.local",
  );
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-02-01",
  token: SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// ---------- Portable Text helpers ----------

type Mark = "strong" | "em";
type Span = { _type: "span"; _key: string; text: string; marks: Mark[] };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: [];
  listItem?: "bullet" | "number";
  level?: number;
  children: Span[];
};

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

function span(text: string, marks: Mark[] = []): Span {
  return { _type: "span", _key: key(), text, marks };
}

function para(...children: (string | Span)[]): Block {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: children.map((c) => (typeof c === "string" ? span(c) : c)),
  };
}

// ---------- Image uploads ----------

type ImageRef = {
  _type: "imageWithAlt";
  _key?: string;
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

async function uploadImage(filename: string, alt: string): Promise<ImageRef> {
  const filePath = path.join(process.cwd(), "public", filename);
  const buf = await readFile(filePath);
  const asset = await client.assets.upload("image", buf, { filename });
  console.log(`  uploaded ${filename} -> ${asset._id}`);
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

function galleryItem(img: ImageRef): ImageRef {
  return { ...img, _key: key() };
}

// ---------- Copy (cleaned of em dashes per client rule) ----------

const HOMEPAGE_HEADLINE =
  "We help business owners and individuals identify and overcome challenges and give them the confidence and direction to move beyond them.";

const HOMEPAGE_INTRO = [
  "Leadership can be a lonely place, so we aim to offer the kind of support that a director needs, whether you are an early-stage founder, next-gen entrepreneur or seasoned professional.",
  "Consider us a vital sounding board, critical friend, your business partner on demand and accountability partner.",
  "With years of experience in small business ownership and management we know and understand your pain points and can guide you through them. Whether to simply add a fresh perspective, create clarity to enable purposeful decision making, working together on a practical solution or digging deeper into the strategy, we are by your side whenever you need us.",
].join("\n\n");

const ABOUT_SHORT_BIO: Block[] = [
  para(
    "Becky Phillips is a three-time entrepreneur with over 30 years of local, national and international business experience. After starting her career in London across tourism, hotels and events, she discovered her passion for recruitment and founded ESP Recruitment in 1998, growing it into a leading agency in both the UK and Middle East. She later served as President of ILEA, speaking and representing the industry globally.",
  ),
  para(
    "Post-pandemic, Becky moved into the public sector as Strategic Lead for Dorset Careers Hub, managing teams, stakeholders and major programmes that helped young people into work. She then delivered start-up support, leadership development, coaching and mentoring with Evolve Advisory before returning to self-employment.",
  ),
  para(
    "Known for her relaxed professionalism, pragmatism and empathy, Becky quickly gets to the heart of a business challenge. She brings clarity, confidence and a \u201Cback to basics, just do it\u201D approach that creates immediate and lasting impact for small business owners and leaders.",
  ),
];

// Client copy retained verbatim \u2014 flag "is characteristics" for review.
const ABOUT_FULL_BIO: Block[] = [
  para(
    "Tenacity is led by Becky Phillips, a business studies graduate and three-time entrepreneur with over 30 years of local, national and international business management experience. Poole born and raised, her career and first company started in London. Opportunities internationally lead her to launch her second venture in Dubai, where she spent 10 years building a client base, team and strong reputation.",
  ),
  para(
    "Becky has learnt so much from leading small businesses, but recent experience in government and private sector organisations has given her vital insight into the processes and structure that is characteristics of the corporate world - knowledge she now sees transfers effectively into the small-business space.",
  ),
  para(
    "Becky is at her best working with owner managers and leaders. Known for her relaxed professionalism, pragmatism and empathy, she quickly gets to the root cause of a challenge and turns barriers into opportunities. Her \"back to basics, just do it\" approach, combined with support in evidence-based decision making, creates clarity, confidence and momentum, driving meaningful and lasting impact for both people and businesses.",
  ),
];

// ---------- Service copy ----------

const COACHING_BODY: Block[] = [
  para(
    "If you are feeling a little bit stuck or overwhelmed in business or your career, you are truly not alone. Often just sharing your thoughts with someone outside of your close circle is all it takes to get the vital perspective needed to overcome obstacles and achieve your goals.",
  ),
  para(
    "We balance warmth, knowledge, experience and professionalism, in a confidential and safe environment to ensure you feel at ease and can be yourself and be heard. We are expert when it comes to active listening, and ask the right questions at the right time, quickly getting to the root cause of your concern. We give you space to reflect and think, without distractions and then together, with purpose, we talk through your options and work out a realistic plan.",
  ),
  para(
    "Coaching gets fast results and has immediate impact in many aspects of your life, giving you the direction, confidence and drive to succeed.",
  ),
];

const CONSULTANCY_BODY: Block[] = [
  para(
    "Running a business can be hugely rewarding, but it can be full-on, leading to competing priorities and throwing the occasional curveball. It\u2019s easy to lose sight of the bigger picture when you\u2019re deep in the day-to-day. Our consultancy service gives you the clarity and direction needed to move forward with purpose.",
  ),
  para(
    "We take the time to understand you and your business from the inside out: the challenges, the opportunities, the people and the pressures, and work with you to create practical, achievable solutions. Whether you need a strategic reset, support navigating change, or simply a trusted partner to sense-check ideas, we bring experience, and a calm yet objective approach.",
  ),
  para(
    "Our goal is to help you build momentum, strengthen your foundations and unlock sustainable growth.",
  ),
];

const LEADERSHIP_BODY: Block[] = [
  para(
    "Success in business isn\u2019t about having all the answers; it\u2019s about self-awareness, creating and operating in an environment where you can evolve and thrive. We support leaders, teams and individuals at every stage of the journey to build confidence, capability and resilience, while helping them communicate better, collaborate more effectively and work towards shared goals.",
  ),
  para(
    "Through tailored development programmes, workshops and one-to-one support, we help you understand your leadership style, identify strengths and blind spots, and develop the skills needed to succeed and inspire and empower colleagues, clients or stakeholders. With new knowledge and increased self-motivation you\u2019ll feel equipped, supported and ready to take your organisation forward.",
  ),
];

const PROJECTS_BODY: Block[] = [
  para(
    "\u201CI don\u2019t have time.\u201D Capacity challenges are a major concern for most small business leaders today. But when a project matters, sometimes you just need an extra pair of hands, someone who can bring structure, clarity and calm to the process.",
  ),
  para(
    "We step in to manage projects with precision and purpose, ensuring that timelines, budgets and expectations stay firmly on track. From initial scoping and planning through to delivery and evaluation, we take care of the detail while keeping you fully informed and in control.",
  ),
  para(
    "Our approach is collaborative and transparent, balancing strategic oversight with hands-on support. Whether it\u2019s a new initiative, an office move, an event, a programme of work or a complex organisational change, we help you deliver with confidence and achieve the outcomes you set out to reach.",
  ),
  para(
    span("Services we offer: ", ["strong"]),
    span(
      "Working flexibly to suit your own workload and budget, we offer part time or interim solutions across a range of business functions either directly or through our trusted associates.",
    ),
  ),
];

const FACILITATION_BODY: Block[] = [
  para(
    "Sometimes progress requires an impartial voice, someone who can create space for honest conversation, navigate differing viewpoints and guide people towards shared understanding. Our facilitation and mediation services provide exactly that.",
  ),
  para(
    "We design and lead sessions that encourage open dialogue, constructive challenge and meaningful collaboration, whether you\u2019re tackling a specific issue, planning for the future or bringing stakeholders together. With a calm, neutral presence and a focus on positive outcomes, we help you move past barriers, surface new ideas and reach decisions that feel fair, informed and actionable. It\u2019s about unlocking the collective wisdom in the room and turning it into forward momentum.",
  ),
];

const CONTACT_INTRO: Block[] = [
  para(
    "We\u2019d love to find out more about you and how we can help. Drop us a note below and we\u2019ll be in touch to arrange an introductory call.",
  ),
];

const PRICING_BODY: Block[] = [
  para(
    "Our services are aimed at micro and small business owners and individuals, and therefore we operate a fair pricing policy to ensure that we are accessible, with no compromise to the scope, quality and professionalism of our services.",
  ),
  para(
    "We\u2019d love to find out more about you and how we can help, enquire here to arrange an introductory call from which we can provide a proposal and quote.",
  ),
];

// ---------- Run ----------

async function run() {
  console.log("Uploading images to Sanity assets...");

  const logo = await uploadImage(
    "tenacity-logo.png",
    "Tenacity Business Growth Consultancy wordmark",
  );
  const introPhoto = await uploadImage(
    "20260416_113424.jpg",
    "Becky Phillips writing in a notebook beside her laptop",
  );
  const portrait = await uploadImage(
    "IMG_0942.jpeg",
    "Becky Phillips outdoors, close portrait",
  );
  const galleryAvenue = await uploadImage(
    "IMG_4324 (1).JPG",
    "Becky walking along a tree-lined avenue with a colleague",
  );
  const galleryField = await uploadImage(
    "IMG_4338.JPG",
    "Becky leaning on a wooden fence beside a green field",
  );
  const galleryPresenting = await uploadImage(
    "IMG_4362.JPG",
    "Becky presenting at a lectern in front of a brick wall",
  );
  const galleryFieldWide = await uploadImage(
    "IMG_4343 (1).JPG",
    "Becky by a fence looking out across a field of green crops",
  );
  const coachingHero = await uploadImage(
    "IMG_4284.JPG",
    "Becky laughing with a young professional across a coffee-table meeting",
  );
  const consultancyHero = await uploadImage(
    "IMG_4262.JPG",
    "Becky focused on her laptop in a light-filled co-working space",
  );
  const leadershipHero = await uploadImage(
    "IMG_4320.JPG",
    "Becky in conversation with a colleague while walking through a field",
  );
  const projectsHero = await uploadImage(
    "IMG_4354.JPG",
    "Becky standing confidently against a corrugated wall, hands on hips",
  );
  const facilitationHero = await uploadImage(
    "IMG_4279.JPG",
    "Becky facilitating a one-to-one conversation over coffee",
  );
  const contactHero = await uploadImage(
    "IMG_4300.JPG",
    "Becky smiling while taking a phone call outside",
  );

  console.log("\nWriting singletons...");

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Tenacity Business Growth Consultancy",
    logo,
    contactEmail: "becky@tenacity.co.uk",
    socials: [],
    footerText:
      "Tenacity Business Growth Consultancy supports small business owners and leaders across the UK.",
  });

  await client.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    heroDefinition: "Tenacity: noun",
    heroHeadline: HOMEPAGE_HEADLINE,
    primaryCtaLabel: "Book a call",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "How we help",
    secondaryCtaHref: "/services",
    introParagraph: HOMEPAGE_INTRO,
    introPhoto,
    ctaBandQuote:
      "Leadership can be a lonely place, so we aim to offer the kind of support that a director needs, whether you are an early-stage founder, next-gen entrepreneur or seasoned professional.",
  });

  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    shortBio: ABOUT_SHORT_BIO,
    fullBio: ABOUT_FULL_BIO,
    portrait,
    gallery: [
      galleryItem(galleryAvenue),
      galleryItem(galleryField),
      galleryItem(galleryPresenting),
      galleryItem(galleryFieldWide),
    ],
  });

  await client.createOrReplace({
    _id: "pricingPage",
    _type: "pricingPage",
    heading: "Fair, accessible pricing",
    body: PRICING_BODY,
    ctaLabel: "Enquire about pricing",
    ctaHref: "/contact",
  });

  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    introCopy: CONTACT_INTRO,
    heroImage: contactHero,
    recipientEmail: "becky@tenacity.co.uk",
  });

  console.log("\nWriting service documents...");

  await client.createOrReplace({
    _id: "service.coaching",
    _type: "service",
    title: "Coaching & Mentoring",
    slug: { _type: "slug", current: "coaching" },
    order: 1,
    icon: "users",
    shortDescription:
      "Confidential, thoughtful coaching that helps you find perspective, move past obstacles and achieve your goals.",
    heroImage: coachingHero,
    body: COACHING_BODY,
    servicesList: [
      { _key: key(), _type: "servicesListItem", label: "Business Coaching & Mentoring" },
      { _key: key(), _type: "servicesListItem", label: "Next-gen Founders Coaching" },
      { _key: key(), _type: "servicesListItem", label: "Employability Coaching" },
      { _key: key(), _type: "servicesListItem", label: "Career Coaching" },
      {
        _key: key(),
        _type: "servicesListItem",
        label: "Your Accountability Partner",
        description:
          "A monthly check-in and planning service to keep business owners focused, motivated, and moving forward.",
      },
    ],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  await client.createOrReplace({
    _id: "service.consultancy",
    _type: "service",
    title: "Business Consultancy",
    slug: { _type: "slug", current: "consultancy" },
    order: 2,
    icon: "briefcase",
    shortDescription:
      "Clarity and direction to move forward with purpose, from strategic reset to sense-checking ideas.",
    heroImage: consultancyHero,
    body: CONSULTANCY_BODY,
    servicesList: [
      { _key: key(), _type: "servicesListItem", label: "General Business Consultancy" },
      { _key: key(), _type: "servicesListItem", label: "Growth advice" },
      {
        _key: key(),
        _type: "servicesListItem",
        label: "Function specific support",
        description: "People, Sales and Marketing, Operations, IT, Finance.",
      },
      { _key: key(), _type: "servicesListItem", label: "Next-gen start-up support" },
      {
        _key: key(),
        _type: "servicesListItem",
        label: "The Tenacity Deep-Dive (3 hours)",
        description:
          "A practical, back-to-basics review for small business owners who need clarity, direction, and a renewed sense of control. We uncover what is working, what is holding the business back, and where the biggest opportunities lie. Insightful, honest, and actionable.",
      },
    ],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  await client.createOrReplace({
    _id: "service.leadership",
    _type: "service",
    title: "Leadership & Team Development",
    slug: { _type: "slug", current: "leadership" },
    order: 6,
    icon: "compass",
    shortDescription:
      "Build confidence, capability and resilience for leaders, teams and individuals at every stage.",
    heroImage: leadershipHero,
    body: LEADERSHIP_BODY,
    servicesList: [
      {
        _key: key(),
        _type: "servicesListItem",
        label: "Half-day training sessions",
        description: "Stand-alone workshops tailored to your team.",
      },
      {
        _key: key(),
        _type: "servicesListItem",
        label: "Lead with Tenacity",
        description:
          "A fully tailored development programme for leaders who want to develop skills, confidence, and profits. Relatable and practical, they take away tools and learning they can use immediately.",
      },
      {
        _key: key(),
        _type: "servicesListItem",
        label: "The Tenacity Roundtable",
        description:
          "A facilitated peer-group experience for business leaders who want shared learning, challenge, and community.",
      },
    ],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  await client.createOrReplace({
    _id: "service.projects",
    _type: "service",
    title: "Project Management",
    slug: { _type: "slug", current: "projects" },
    order: 3,
    icon: "clipboard-check",
    shortDescription:
      "Structure, clarity and calm delivery for the projects that matter most.",
    heroImage: projectsHero,
    body: PROJECTS_BODY,
    servicesList: [],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  await client.createOrReplace({
    _id: "service.facilitation",
    _type: "service",
    title: "Facilitation & Mediation",
    slug: { _type: "slug", current: "facilitation" },
    order: 4,
    icon: "handshake",
    shortDescription:
      "An impartial voice that turns differing views into shared understanding and forward momentum.",
    heroImage: facilitationHero,
    body: FACILITATION_BODY,
    servicesList: [
      { _key: key(), _type: "servicesListItem", label: "Speakers" },
      { _key: key(), _type: "servicesListItem", label: "Panel hosts" },
      { _key: key(), _type: "servicesListItem", label: "Emcees" },
      { _key: key(), _type: "servicesListItem", label: "Interviewers" },
      { _key: key(), _type: "servicesListItem", label: "Facilitators" },
      { _key: key(), _type: "servicesListItem", label: "Meeting chairs" },
      { _key: key(), _type: "servicesListItem", label: "Mediators" },
    ],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  // TODO: copy from client — placeholder body for Career & Employability Coaching
  await client.createOrReplace({
    _id: "service.career",
    _type: "service",
    title: "Career & Employability Coaching",
    slug: { _type: "slug", current: "career" },
    order: 5,
    icon: "compass",
    shortDescription:
      "Coaching for individuals navigating career transitions, employability skills, and finding direction in their working life.",
    heroImage: coachingHero,
    body: [
      para(
        "Coaching for individuals navigating career transitions, employability skills, and finding direction in their working life. Get in touch to find out how Becky can help.",
      ),
    ],
    servicesList: [],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  });

  console.log("\nSeed complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
