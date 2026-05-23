import { getBlogCoverTheme } from "@/lib/blog/cover-theme"
import { buildBlogCoverSvg } from "@/lib/blog/cover-svg"

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const decoded = decodeURIComponent(slug)
  const svg = buildBlogCoverSvg(getBlogCoverTheme(decoded))

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}
