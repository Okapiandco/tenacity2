import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({
      name: "featured",
      type: "boolean",
      description: "Featured testimonials appear on the homepage carousel.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "photo" },
  },
});
