import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { buildSlugMap } from "@/lib/seo/locations-data"
import { LocationsDirectory, SimpleLocation } from "@/components/public/locations-directory"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Areas We Serve | OfinIT Solutions",
  description:
    "Explore OfinIT's global service coverage, supporting enterprises and startups in the USA, Canada, UAE, Saudi Arabia, Africa, and all states & major cities in India.",
  keywords: [
    "OfinIT locations",
    "software development agency India",
    "offshore engineering USA",
    "Gulf tech consulting",
    "software developers Bangalore",
  ],
}

export default async function LocationsDirectoryPage() {
  const site = await loadPublicSiteContent()
  const map = buildSlugMap()

  // Convert map to simple lightweight structures for client search
  const locations: SimpleLocation[] = []
  for (const [slug, item] of map.entries()) {
    locations.push({
      name: item.name,
      slug,
      parent: item.parent,
      country: item.country,
      region: item.region,
    })
  }

  return (
    <>
      <Header content={site.header} />
      <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 text-center py-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full mb-4">
            Global Delivery Coverage
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Areas We <span className="text-primary">Serve</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            OfinIT provides premium software engineering, custom platforms, mobile apps, and AI integration to clients globally. Explore our regional hubs.
          </p>
        </section>

        {/* Directory Search Component */}
        <section className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          <LocationsDirectory locations={locations} />
        </section>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
