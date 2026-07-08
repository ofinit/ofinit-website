import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { getGroupedLocations } from "@/lib/seo/locations-data"
import { Globe, Map, Building2 } from "lucide-react"

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
  const { international, states, cities } = getGroupedLocations()

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

        {/* Directory Grid */}
        <section className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 space-y-16">
          
          {/* International Markets */}
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">International Markets</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {international.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {loc.name}
                    </span>
                    {loc.parentName && (
                      <p className="text-xs text-muted-foreground">{loc.parentName}</p>
                    )}
                  </div>
                  <span className="text-xs text-primary mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Indian Cities */}
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Indian Tech & Business Hubs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {loc.name}
                    </span>
                    {loc.parentName && (
                      <p className="text-xs text-muted-foreground">{loc.parentName}</p>
                    )}
                  </div>
                  <span className="text-xs text-primary mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Indian States */}
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <Map className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Indian States Served</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {loc.name}
                    </span>
                  </div>
                  <span className="text-xs text-primary mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </section>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
