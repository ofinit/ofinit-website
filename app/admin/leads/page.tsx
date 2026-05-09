import { prisma } from "@/lib/db/prisma"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await prisma.leadSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads & subscribers</h1>
        <p className="text-gray-600 mt-2">
          Contact form submissions and blog newsletter signups from the public site.
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
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    No submissions yet.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {lead.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lead.source === "newsletter" ? "secondary" : "default"}>
                        {lead.source}
                      </Badge>
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
  )
}
