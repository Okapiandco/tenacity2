import { defineType, defineField } from "sanity";

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
    }),
    defineField({ name: "ctaLabel", type: "string" }),
    defineField({ name: "ctaHref", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Pricing page" }),
  },
});
