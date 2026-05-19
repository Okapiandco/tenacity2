import { defineType, defineField } from "sanity";

export const mailingListSignup = defineType({
  name: "mailingListSignup",
  title: "Mailing List Signups",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "subscribedAt" },
  },
});
