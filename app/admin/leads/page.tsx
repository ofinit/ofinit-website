import { loadAdminLeadsData, formatLeadDate } from "@/lib/leads/admin-leads"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const { rows, pending } = await loadAdminLeadsData()

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads & subscribers</h1>
            <p className="text-gray-600 mt-2">
              Contact inquiries, legacy newsletter rows, and confirmed blog subscribers (double opt-in).
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href="/api/admin/leads/export">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </a>
          </Button>
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
                        {formatLeadDate(lead.at)}
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

      {pending.length > 0 ? (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Newsletter — awaiting email confirmation</h2>
            <p className="text-sm text-gray-600">
              These addresses have not clicked the confirmation link yet. They are included in the CSV export.
            </p>
          </div>
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
                  {pending.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatLeadDate(p.requestedAt)}
                      </TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatLeadDate(p.tokenExpires)}
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
