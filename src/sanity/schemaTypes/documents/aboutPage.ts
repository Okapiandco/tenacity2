import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Short bio",
      description: "Used on the home page About teaser.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bioPartOne",
      title: "Bio — part one",
      description: "Shown next to the first About-page photo.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bioPartTwo",
      title: "Bio — part two",
      description: "Shown next to the second About-page photo.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullBio",
      title: "Full bio (legacy)",
      description:
        "Older single-block bio. Kept for archive; please use Bio part one + part two instead.",
      type: "array",
      of: [{ type: "block" }],
      hidden: true,
    }),
    defineField({
      name: "portrait",
      title: "About photo — first",
      description: "Shown at the top of the About page next to Bio part one.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "bioImageTwo",
      title: "About photo — second",
      description: "Shown below next to Bio part two.",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About page" }),
  },
});
