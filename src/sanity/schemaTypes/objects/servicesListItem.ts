import { defineType, defineField } from "sanity";

export const servicesListItem = defineType({
  name: "servicesListItem",
  title: "Services list item",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "description" },
  },
});
