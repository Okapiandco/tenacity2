import { defineType, defineField } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Plain-English description of what is in the image. Required for accessibility.",
      validation: (Rule) => Rule.required().min(3).error("Alt text is required"),
    }),
  ],
});
