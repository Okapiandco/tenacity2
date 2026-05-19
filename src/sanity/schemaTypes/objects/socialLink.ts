import { defineType, defineField } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      type: "string",
      options: {
        list: [
          { title: "LinkedIn", value: "linkedin" },
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "X (Twitter)", value: "x" },
          { title: "Threads", value: "threads" },
          { title: "YouTube", value: "youtube" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
