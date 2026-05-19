import { z } from "zod";

export const HEAR_ABOUT_OPTIONS = [
  "Google search",
  "LinkedIn",
  "Referral from a friend or colleague",
  "Event or workshop",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "Please add a few details about your enquiry").max(4000),
  hearAbout: z.string().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactPayload = z.infer<typeof contactSchema>;
