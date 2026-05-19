import { defineType, defineField } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first on the Services overview.",
      initialValue: 0,
    }),
    defineField({
      name: "icon",
      type: "string",
      description: "Pick the Lucide icon that best fits this service.",
      options: {
        list: [
          { title: "Users (Coaching & Mentoring)", value: "users" },
          { title: "Briefcase (Business Consultancy)", value: "briefcase" },
          { title: "Compass (Leadership)", value: "compass" },
          { title: "ClipboardCheck (Project Management)", value: "clipboard-check" },
          { title: "Handshake (Facilitation)", value: "handshake" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "One sentence shown on service cards.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      description: "Featured photo for this service's page.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "servicesList",
      title: "What this includes",
      type: "array",
      of: [{ type: "servicesListItem" }],
    }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription" },
  },
});
