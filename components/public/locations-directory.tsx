"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Globe, Landmark, Building2, ChevronRight } from "lucide-react"

export interface SimpleLocation {
  name: string
  slug: string
  parent: string
  country: string
  region: string
}

interface DirectoryProps {
  locations: SimpleLocation[]
}

export function LocationsDirectory({ locations }: DirectoryProps) {
  const [query, setQuery] = useState("")

  // Filter locations dynamically based on input
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return locations
      .filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.parent.toLowerCase().includes(q) ||
          loc.country.toLowerCase().includes(q)
      )
      .slice(0, 100) // limit search results to 100 for DOM performance
  }, [query, locations])

  // Get curated highlights (pre-defined main target locations)
  const highlights = useMemo(() => {
    const mainSlugs = ["usa", "canada", "dubai", "riyadh", "doha", "south-africa", "nigeria", "kenya", "egypt", "bangalore", "mumbai", "new-delhi", "noida", "gurgaon", "hyderabad", "pune", "chennai"]
    return locations.filter((loc) => mainSlugs.includes(loc.slug))
  }, [locations])

  // Get list of unique states
  const states = useMemo(() => {
    return locations.filter((loc) => loc.region === "Indian States")
  }, [locations])

  return (
    <div className="space-y-16">
      {/* Interactive Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search from 15,000+ target countries, states, or cities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-base rounded-full shadow-md bg-card border-border focus-visible:ring-primary w-full"
          />
        </div>
        {query && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Showing top {filtered.length} matching locations
          </p>
        )}
      </div>

      {/* Search Results */}
      {query ? (
        <Card className="p-6 border border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Results for "{query}"
          </h3>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">No locations found. Try checking the spelling.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((loc) => (
                <Link
                  key={`${loc.slug}-${loc.region}`}
                  href={`/locations/${loc.slug}`}
                  className="p-3 bg-card border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block">
                      {loc.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {loc.parent} &bull; {loc.country}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </Card>
      ) : null}

      {/* Featured Primary Locations */}
      <div>
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Featured Global Markets</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highlights.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="p-4 border rounded-xl hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base block">
                  {loc.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {loc.parent !== loc.name ? `${loc.parent}, ` : ""}{loc.country}
                </span>
              </div>
              <span className="text-xs text-primary mt-4 font-semibold inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Location Profile &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Indian States served */}
      <div>
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <Landmark className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Indian States Directory</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {loc.name}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
