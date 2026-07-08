import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getGroupedLocations, getAllLocationSlugs } from "@/lib/seo/locations-data"
import { Eye, MapPin, Globe, Compass, Landmark } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminLocationsPage() {
  const { international, states, cities } = getGroupedLocations()
  const totalCount = getAllLocationSlugs().length
  
  // Slice lists for table performance, show top 20 featured
  const featuredIntl = international.slice(0, 20)
  const featuredCities = cities.slice(0, 20)
  const featuredStates = states.slice(0, 20)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Locations</h1>
          <p className="text-gray-600 mt-2">Manage and preview target local/international lead generation pages.</p>
        </div>
        <Link href="/locations" target="_blank">
          <Button variant="outline" className="gap-2 bg-white">
            <Eye className="w-4 h-4" />
            View Directory
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Location Slugs</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{totalCount.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Compass className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500 font-medium">International Markets</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{international.length.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Globe className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500 font-medium">Indian Tech Hubs</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{cities.length.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <MapPin className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-gray-500 font-medium">Indian States</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{states.length.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <Landmark className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Sections for Regions */}
      <div className="space-y-8">
        
        {/* Section: International */}
        <Card className="overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Featured International Targets (Showing {featuredIntl.length} of {international.length.toLocaleString()})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Coordinates (Lat / Lng)</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {featuredIntl.map((loc) => (
                  <tr key={loc.slug} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {loc.name}
                      {loc.parentName && <span className="text-xs text-gray-500 block">{loc.parentName}</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">/locations/{loc.slug}</td>
                    <td className="px-6 py-4 capitalize">{loc.type}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/locations/${loc.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Eye className="w-3.5 h-3.5" />
                            General
                          </Button>
                        </Link>
                        <Link href={`/locations/${loc.slug}/ai-integration`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Compass className="w-3.5 h-3.5" />
                            AI Landing
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {international.length > featuredIntl.length && (
            <div className="bg-gray-50/50 px-6 py-3 border-t text-xs text-muted-foreground text-center">
              Plus {international.length - featuredIntl.length} more international target pages generated at runtime.
            </div>
          )}
        </Card>

        {/* Section: Indian Cities */}
        <Card className="overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              Featured Indian Tech Hubs & Cities (Showing {featuredCities.length} of {cities.length.toLocaleString()})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">City / Hub</th>
                  <th className="px-6 py-3">State / Parent</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Coordinates (Lat / Lng)</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {featuredCities.map((loc) => (
                  <tr key={loc.slug} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                    <td className="px-6 py-4 text-gray-600">{loc.parentName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">/locations/{loc.slug}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/locations/${loc.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Eye className="w-3.5 h-3.5" />
                            General
                          </Button>
                        </Link>
                        <Link href={`/locations/${loc.slug}/software-development`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Compass className="w-3.5 h-3.5" />
                            Software
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cities.length > featuredCities.length && (
            <div className="bg-gray-50/50 px-6 py-3 border-t text-xs text-muted-foreground text-center">
              Plus {(cities.length - featuredCities.length).toLocaleString()} more city pages generated dynamically at runtime.
            </div>
          )}
        </Card>

        {/* Section: Indian States */}
        <Card className="overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-emerald-600" />
              Featured Indian States (Showing {featuredStates.length} of {states.length.toLocaleString()})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {featuredStates.map((loc) => (
                  <tr key={loc.slug} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">/locations/{loc.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/locations/${loc.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Eye className="w-3.5 h-3.5" />
                            General
                          </Button>
                        </Link>
                        <Link href={`/locations/${loc.slug}/web-development`} target="_blank">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary/80">
                            <Compass className="w-3.5 h-3.5" />
                            Web Landing
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {states.length > featuredStates.length && (
            <div className="bg-gray-50/50 px-6 py-3 border-t text-xs text-muted-foreground text-center">
              Plus {states.length - featuredStates.length} more state pages generated dynamically at runtime.
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
