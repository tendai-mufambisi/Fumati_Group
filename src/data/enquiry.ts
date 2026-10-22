import { z } from "zod";

/** Shared by the contact form (browser) and submitEnquiry (server). */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z.string().trim().min(7, "Please enter a phone or WhatsApp number.").max(30),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email.").max(120)]),
  service: z.string().trim().max(80),
  location: z.string().trim().max(120),
  budget: z.string().trim().max(60),
  message: z.string().trim().min(10, "Tell us a little about the project.").max(3000),
  // Honeypot: real people never see or fill this field.
  website: z.string().max(0).optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
