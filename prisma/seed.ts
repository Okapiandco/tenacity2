import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // ─── Admin user ──────────────────────────────────────────────────────────
  const email = process.env.SEED_ADMIN_EMAIL ?? "jim@okapiandco.co.uk";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, password: hashed, name: "Jim" },
    update: {},
  });
  console.log(`Admin user: ${email}`);

  // ─── Site settings ────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    create: {
      id: "settings",
      title: "Tenacity Business Growth Consultancy",
      contactEmail: "becky@tenacity.co.uk",
      footerText: "© Tenacity Business Growth Consultancy. All rights reserved.",
      socials: {
        create: [
          { icon: "linkedin", url: "https://www.linkedin.com/company/tenacity-business-growth", order: 0 },
        ],
      },
    },
    update: {},
  });
  console.log("Site settings done");

  // ─── Pages ────────────────────────────────────────────────────────────────
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    create: { slug: "home", title: "Home" },
    update: {},
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    create: { slug: "about", title: "About" },
    update: {},
  });

  const pricingPage = await prisma.page.upsert({
    where: { slug: "pricing" },
    create: { slug: "pricing", title: "Pricing" },
    update: {},
  });

  const contactPage = await prisma.page.upsert({
    where: { slug: "contact" },
    create: { slug: "contact", title: "Contact" },
    update: {},
  });

  console.log("Pages done");

  // ─── Home sections ────────────────────────────────────────────────────────
  const existingHomeSections = await prisma.section.count({ where: { pageId: homePage.id } });
  if (existingHomeSections === 0) {
    await prisma.section.createMany({
      data: [
        {
          pageId: homePage.id,
          type: "hero",
          order: 0,
          enabled: true,
          content: {
            definition: "tenacity /tɪˈnæs.ɪ.ti/: the quality of being very determined",
            headline: "Supporting UK small business owners and leaders",
            subhead: "Coaching, consultancy and leadership support — helping you find clarity, confidence and direction.",
            backgroundImage: "",
            primaryCtaLabel: "Work with us",
            primaryCtaHref: "/contact",
            secondaryCtaLabel: "Our services",
            secondaryCtaHref: "/services",
          },
        },
        {
          pageId: homePage.id,
          type: "intro",
          order: 1,
          enabled: true,
          content: {
            paragraph: "At Tenacity, we believe every small business owner and leader deserves access to the kind of expert support that helps them thrive.\n\nWhether you need coaching to unlock your potential, consultancy to grow your business, or skilled facilitation to align your team — we are here to help you move forward with clarity and confidence.",
            photoBottom: "",
          },
        },
        {
          pageId: homePage.id,
          type: "service_cards",
          order: 2,
          enabled: true,
          content: {},
        },
        {
          pageId: homePage.id,
          type: "about_teaser",
          order: 3,
          enabled: true,
          content: {
            shortBio: "Becky Phillips is a three-time entrepreneur with over 30 years of business experience, supporting small business owners and leaders across the UK.\n\nShe founded Tenacity to help people find clarity, confidence and direction — turning ambition into action.",
            image: "",
          },
        },
        {
          pageId: homePage.id,
          type: "cta_band",
          order: 4,
          enabled: true,
          content: {
            quote: "The best investment you can make is in yourself and your business.",
          },
        },
      ],
    });
    console.log("Home sections done");
  }

  // ─── About sections ───────────────────────────────────────────────────────
  const existingAboutSections = await prisma.section.count({ where: { pageId: aboutPage.id } });
  if (existingAboutSections === 0) {
    await prisma.section.createMany({
      data: [
        {
          pageId: aboutPage.id,
          type: "hero",
          order: 0,
          enabled: true,
          content: {
            headline: "Becky Phillips",
            backgroundImage: "/becky-coaching.jpg",
          },
        },
      ],
    });
    console.log("About sections done");
  }

  // ─── Services ─────────────────────────────────────────────────────────────
  const services = [
    {
      slug: "coaching",
      title: "Coaching",
      order: 0,
      icon: "users",
      shortDescription: "One-to-one coaching to help you gain clarity, build confidence and move forward.",
      heroImageUrl: "/tenacity-coaching.jpg",
      body: "Our coaching programmes are designed to help small business owners and leaders unlock their full potential. Through a series of structured one-to-one sessions, we work with you to identify what is holding you back, clarify your goals and develop the mindset and strategies you need to move forward.\n\nWhether you are navigating a difficult period, preparing for growth or simply feeling stuck, coaching provides the space, challenge and support you need to make real progress.",
      servicesList: [
        { label: "Initial discovery session", description: "A no-obligation conversation to explore your goals and how we can help." },
        { label: "Structured coaching programme", description: "A tailored series of sessions designed around your specific needs." },
        { label: "Ongoing accountability", description: "Regular check-ins to keep you focused and on track." },
        { label: "Practical tools and frameworks", description: "Proven approaches to help you think more clearly and act more decisively." },
      ],
      ctaLabel: "Book a discovery call",
      ctaHref: "/contact",
    },
    {
      slug: "consultancy",
      title: "Consultancy",
      order: 1,
      icon: "briefcase",
      shortDescription: "Expert guidance to help your business grow with purpose and direction.",
      heroImageUrl: null,
      body: "Our consultancy service provides expert, hands-on support to help your business grow. We work alongside you to understand your business, identify the opportunities and challenges ahead and develop a clear, practical plan for moving forward.\n\nUnlike traditional consultants who deliver a report and disappear, we stay involved to help you implement, adjust and achieve real results.",
      servicesList: [
        { label: "Business review and diagnosis", description: "A thorough assessment of where your business is now and where it needs to go." },
        { label: "Strategy development", description: "A clear, actionable plan tailored to your goals and resources." },
        { label: "Implementation support", description: "Hands-on help to put your plan into action." },
      ],
      ctaLabel: "Talk to us",
      ctaHref: "/contact",
    },
    {
      slug: "leadership-development",
      title: "Leadership Development",
      order: 2,
      icon: "compass",
      shortDescription: "Develop the leadership skills and mindset to inspire and lead effectively.",
      heroImageUrl: null,
      body: "Great leadership is not just about managing people — it is about inspiring them. Our leadership development programmes help you to develop the skills, confidence and self-awareness you need to lead with purpose and authenticity.\n\nWhether you are new to leadership, growing your team or navigating a period of change, we will help you become the leader your business needs.",
      servicesList: [
        { label: "Leadership skills assessment", description: "Understand your current strengths and the areas to develop." },
        { label: "Bespoke development programme", description: "A tailored programme built around your specific leadership context." },
        { label: "Team leadership support", description: "Practical tools for motivating, communicating with and developing your team." },
      ],
      ctaLabel: "Start your leadership journey",
      ctaHref: "/contact",
    },
    {
      slug: "project-management",
      title: "Project Management",
      order: 3,
      icon: "clipboard-check",
      shortDescription: "Practical support to plan, manage and deliver your projects on time.",
      heroImageUrl: null,
      body: "Many small businesses struggle to manage projects effectively — running over time, over budget or simply losing momentum. Our project management support helps you to plan, manage and deliver your projects with confidence.\n\nWe bring structure, clarity and accountability to even the most complex projects, so you can focus on what you do best.",
      servicesList: [
        { label: "Project scoping and planning", description: "Define your project clearly and create a realistic, actionable plan." },
        { label: "Risk identification and management", description: "Identify potential problems early and put plans in place to address them." },
        { label: "Progress tracking and reporting", description: "Stay in control with clear, regular updates on progress against plan." },
      ],
      ctaLabel: "Get in touch",
      ctaHref: "/contact",
    },
    {
      slug: "facilitation",
      title: "Facilitation",
      order: 4,
      icon: "handshake",
      shortDescription: "Skilled facilitation for workshops, team days and strategic planning sessions.",
      heroImageUrl: null,
      body: "Sometimes you need an experienced, neutral facilitator to help your team think, discuss and decide effectively. Our facilitation service provides skilled, structured support for workshops, team days, strategy sessions and away days.\n\nWe create an environment where everyone can contribute, difficult conversations can happen and real decisions get made.",
      servicesList: [
        { label: "Workshop design and facilitation", description: "Carefully structured sessions that achieve your specific objectives." },
        { label: "Strategic planning days", description: "Help your team align around a shared vision and plan." },
        { label: "Team away days", description: "Engaging, productive sessions that bring your team together." },
        { label: "Conflict resolution", description: "Skilled, neutral support to help resolve difficult situations." },
      ],
      ctaLabel: "Plan your session",
      ctaHref: "/contact",
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      create: { ...svc, servicesList: svc.servicesList },
      update: {},
    });
  }
  console.log("Services done");

  // Unused page variables suppressed
  void pricingPage;
  void contactPage;

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
