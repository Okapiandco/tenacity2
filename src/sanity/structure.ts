import type { StructureResolver } from "sanity/structure";

export const singletonTypes = new Set([
  "siteSettings",
  "homepage",
  "aboutPage",
  "pricingPage",
  "contactPage",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .id("homepage")
        .title("Homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .id("aboutPage")
        .title("About page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .id("pricingPage")
        .title("Pricing page")
        .child(
          S.document().schemaType("pricingPage").documentId("pricingPage"),
        ),
      S.listItem()
        .id("contactPage")
        .title("Contact page")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
