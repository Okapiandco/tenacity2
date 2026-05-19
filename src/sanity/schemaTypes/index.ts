import type { SchemaTypeDefinition } from "sanity";

import { imageWithAlt } from "./objects/imageWithAlt";
import { socialLink } from "./objects/socialLink";
import { servicesListItem } from "./objects/servicesListItem";

import { siteSettings } from "./documents/siteSettings";
import { homepage } from "./documents/homepage";
import { aboutPage } from "./documents/aboutPage";
import { pricingPage } from "./documents/pricingPage";
import { contactPage } from "./documents/contactPage";
import { service } from "./documents/service";
import { testimonial } from "./documents/testimonial";
import { mailingListSignup } from "./documents/mailingListSignup";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageWithAlt,
    socialLink,
    servicesListItem,
    siteSettings,
    homepage,
    aboutPage,
    pricingPage,
    contactPage,
    service,
    testimonial,
    mailingListSignup,
  ],
};
