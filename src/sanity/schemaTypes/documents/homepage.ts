import { defineType, defineField } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroDefinition",
      title: "Hero definition",
      type: "string",
      description: 'e.g. "Tenacity: noun"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubhead",
      title: "Hero sub-headline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero background image",
      type: "imageWithAlt",
    }),
    defineField({ name: "primaryCtaLabel", title: "Primary CTA label", type: "string" }),
    defineField({ name: "primaryCtaHref", title: "Primary CTA link", type: "string" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA label", type: "string" }),
    defineField({ name: "secondaryCtaHref", title: "Secondary CTA link", type: "string" }),
    defineField({
      name: "introParagraph",
      title: "Intro paragraph",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "introPhoto",
      title: "Intro photo (top)",
      description: "Shown alongside the lead intro quote.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "introPhotoTwo",
      title: "Intro photo (bottom)",
      description: "Shown alongside the remaining intro paragraphs.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "aboutTeaserImage",
      title: "About teaser image",
      description: 'Image shown next to the "Meet Becky" block on the homepage.',
      type: "imageWithAlt",
    }),
    defineField({
      name: "ctaBandQuote",
      title: "CTA band quote",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
