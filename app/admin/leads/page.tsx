import { prisma } from "@/lib/db/prisma"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

type LeadRow = {
  id: string
  at: Date
  source: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  message: string | null
}

export default async function AdminLeadsPage() {
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

  const rows: LeadRow[] = [
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

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leads & subscribers</h1>
          <p className="text-gray-600 mt-2">
            Contact inquiries, legacy newsletter rows, and confirmed blog subscribers (double opt-in).
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Company</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden xl:table-cell max-w-[280px]">Message / notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {lead.at.toISOString().slice(0, 16).replace("T", " ")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.source.includes("newsletter") ? "secondary" : "default"}>{lead.source}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{lead.name ?? "—"}</TableCell>
                      <TableCell>
                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{lead.company ?? "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{lead.phone ?? "—"}</TableCell>
                      <TableCell className="hidden xl:table-cell max-w-[280px]">
                        <span className="line-clamp-3 text-sm text-muted-foreground">{lead.message ?? "—"}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {pendingSubs.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Newsletter — awaiting email confirmation</h2>
          <p className="text-sm text-gray-600 mb-4">These addresses have not clicked the confirmation link yet.</p>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requested</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Link expires (UTC)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubs.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {p.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                      </TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {p.tokenExpires.toISOString().slice(0, 16).replace("T", " ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
