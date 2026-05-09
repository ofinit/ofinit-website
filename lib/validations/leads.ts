import { z } from "zod"
import { isDisposableEmail } from "@/lib/disposable-email-domains"
import { contactMessageEntropyOk } from "@/lib/message-entropy"

export const contactLeadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("Enter a valid email").max(254),
    company: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().min(10, "Please add a bit more detail (at least 10 characters)").max(5000),
    consent: z.boolean().refine((v) => v === true, { message: "Please accept to continue" }),
    _gotcha: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (isDisposableEmail(val.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Please use a permanent work or company email address.",
      })
    }
    if (!contactMessageEntropyOk(val.message)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["message"],
        message: "Please add more specific details about your project (avoid one-word or repetitive text).",
      })
    }
  })

export type ContactLeadInput = z.infer<typeof contactLeadSchema>

export const newsletterSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email").max(254),
    consent: z.boolean().refine((v) => v === true, { message: "Please accept to receive emails" }),
    _gotcha: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (isDisposableEmail(val.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Please use a permanent email address to subscribe.",
      })
    }
  })
