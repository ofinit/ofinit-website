import { NextResponse, NextRequest } from "next/server"
import { getAllLocationSlugs, getGroupedLocations } from "@/lib/seo/locations-data"

const SITE_URL = "https://ofinit.com"
const CHUNK_SIZE = 6000

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("debug") === "1") {
    const { international, states, cities } = getGroupedLocations()
    return NextResponse.json({
      intlCount: international.length,
      statesCount: states.length,
      citiesCount: cities.length,
      statesList: states.map(s => s.name),
    })
  }

  const slugs = getAllLocationSlugs()
  const sitemapsCount = Math.ceil(slugs.length / CHUNK_SIZE)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  for (let i = 0; i < sitemapsCount; i++) {
    xml += `
  <sitemap>
    <loc>${SITE_URL}/sitemap-${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  }

  xml += `
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
