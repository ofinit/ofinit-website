import { notFound } from "next/navigation"
import { PublicPageForm } from "@/components/admin/public-page-form"
import { getPublicPageForAdmin } from "@/app/actions/public-pages-actions"
import { PUBLIC_PAGE_SLUGS } from "@/lib/public-pages/types"

export const dynamic = "force-dynamic"

type Params = { slug: string }

function isPublicPageSlug(slug: string): slug is (typeof PUBLIC_PAGE_SLUGS)[number] {
  return (PUBLIC_PAGE_SLUGS as readonly string[]).includes(slug)
}

export default async function AdminEditPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  if (!isPublicPageSlug(slug)) notFound()

  const page = await getPublicPageForAdmin(slug)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
        <p className="text-gray-600 mt-2">
          Updating this page will update the public route <span className="font-mono">/{slug}</span>.
        </p>
      </div>

      <PublicPageForm page={page} />
    </div>
  )
}

