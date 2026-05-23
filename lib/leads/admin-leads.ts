import { prisma } from "@/lib/db/prisma"

export type AdminLeadRow = {
  id: string
  at: Date
  source: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  message: string | null
}

export type PendingNewsletterRow = {
  id: string
  requestedAt: Date
  email: string
  tokenExpires: Date
}

export async function loadAdminLeadsData(): Promise<{
  rows: AdminLeadRow[]
  pending: PendingNewsletterRow[]
}> {
  const [contacts, legacyNewsletter, confirmedSubs, pendingSubs] = await Promise.all([
    prisma.leadSubmission.findMany({
      where: { source: "contact" },
      orderBy: { createdAt: "desc" },
      take: 400,
    }),
    prisma.leadSubmission.findMany({
      where: { source: "newsletter" },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.newsletterSubscription.findMany({
      where: { confirmedAt: { not: null } },
      orderBy: { confirmedAt: "desc" },
      take: 400,
    }),
    prisma.newsletterSubscription.findMany({
      where: { confirmedAt: null },
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
  ])

  const rows: AdminLeadRow[] = [
    ...contacts.map((c) => ({
      id: c.id,
      at: c.createdAt,
      source: "contact",
      name: c.name,
      email: c.email,
      company: c.company,
      phone: c.phone,
      message: c.message,
    })),
    ...legacyNewsletter.map((c) => ({
      id: c.id,
      at: c.createdAt,
      source: "newsletter (legacy)",
      name: c.name,
      email: c.email,
      company: c.company,
      phone: c.phone,
      message: c.message ?? "—",
    })),
    ...confirmedSubs.map((s) => ({
      id: `nl-${s.id}`,
      at: s.confirmedAt!,
      source: "newsletter",
      name: null,
      email: s.email,
      company: null,
      phone: null,
      message: "Confirmed (double opt-in)",
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 500)

  const pending: PendingNewsletterRow[] = pendingSubs.map((p) => ({
    id: p.id,
    requestedAt: p.createdAt,
    email: p.email,
    tokenExpires: p.tokenExpires,
  }))

  return { rows, pending }
}

export function formatLeadDate(at: Date): string {
  return at.toISOString().slice(0, 16).replace("T", " ")
}
