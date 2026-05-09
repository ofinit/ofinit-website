import { z } from "zod"

export const contactLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(254),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Please add a bit more detail (at least 10 characters)").max(5000),
  consent: z.boolean().refine((v) => v === true, { message: "Please accept to continue" }),
  _gotcha: z.string().optional(),
})

export type ContactLeadInput = z.infer<typeof contactLeadSchema>

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(254),
  consent: z.boolean().refine((v) => v === true, { message: "Please accept to receive emails" }),
  _gotcha: z.string().optional(),
})
