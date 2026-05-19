import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "introCopy",
      title: "Intro copy",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "recipientEmail",
      title: "Recipient email",
      description:
        "Email address that contact form submissions are sent to. Used server-side only, never exposed to visitors.",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact page" }),
  },
});
