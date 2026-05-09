import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Pencil, Trash2 } from "lucide-react"
import { deletePublicPageForAdmin, listPublicPagesForAdmin } from "@/app/actions/public-pages-actions"
import { PUBLIC_PAGE_SLUGS } from "@/lib/public-pages/types"

export const dynamic = "force-dynamic"

const TITLE_BY_SLUG: Record<(typeof PUBLIC_PAGE_SLUGS)[number], string> = {
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
  "cookie-policy": "Cookie Policy",
  careers: "Careers",
}

export default async function AdminPagesListPage() {
  const rows = await listPublicPagesForAdmin()
  const updatedBySlug = new Map(rows.map((r) => [r.slug, r]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-gray-600 mt-1">Edit public policy and company pages linked in the footer.</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          {PUBLIC_PAGE_SLUGS.map((slug) => {
            const row = updatedBySlug.get(slug)
            const title = row?.title ?? TITLE_BY_SLUG[slug]
            const updatedAt = row?.updatedAt

            return (
              <div key={slug} className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono">/{slug}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {updatedAt ? `Updated: ${updatedAt.toISOString().slice(0, 16).replace("T", " ")} UTC` : "Using default content (not saved yet)"}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link href={`/admin/pages/edit/${slug}`}>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  {row ? (
                    <form
                      action={async () => {
                        "use server"
                        await deletePublicPageForAdmin(slug)
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reset
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

