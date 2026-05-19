import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Tenacity Business Growth Consultancy",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      type: "imageWithAlt",
    }),
    defineField({
      name: "contactEmail",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      type: "string",
    }),
    defineField({
      name: "socials",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "footerText",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
