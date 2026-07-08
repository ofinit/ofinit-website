import { getGlobalCityRegistry, CompactLocation } from "./city-registry"

export type LocationType = "country" | "state" | "city"
export type RegionType = "International" | "Indian States" | "Indian Cities"

export interface LocationSEOData {
  slug: string
  name: string
  parentName?: string
  type: LocationType
  region: RegionType
  title: string
  description: string
  h1: string
  h2: string
  latitude: number
  longitude: number
  introText: string
  keywords: string[]
}

// Pre-defined static overrides (for backwards compatibility and key landing page control)
export const STATIC_OVERWRITES = [
  { slug: "usa", name: "United States", parentName: undefined, type: "country" as const, region: "International" as const, lat: 37.0902, lng: -95.7129 },
  { slug: "canada", name: "Canada", parentName: undefined, type: "country" as const, region: "International" as const, lat: 56.1304, lng: -106.3468 },
  { slug: "dubai", name: "Dubai", parentName: "United Arab Emirates", type: "city" as const, region: "International" as const, lat: 25.2048, lng: 55.2708 },
  { slug: "riyadh", name: "Riyadh", parentName: "Saudi Arabia", type: "city" as const, region: "International" as const, lat: 24.7136, lng: 46.6753 },
  { slug: "doha", name: "Doha", parentName: "Qatar", type: "city" as const, region: "International" as const, lat: 25.2854, lng: 51.5310 },
  { slug: "south-africa", name: "South Africa", parentName: undefined, type: "country" as const, region: "International" as const, lat: -30.5595, lng: 22.9375 },
  { slug: "nigeria", name: "Nigeria", parentName: undefined, type: "country" as const, region: "International" as const, lat: 9.0820, lng: 8.6753 },
  { slug: "kenya", name: "Kenya", parentName: undefined, type: "country" as const, region: "International" as const, lat: -0.0236, lng: 37.9062 },
  { slug: "egypt", name: "Egypt", parentName: undefined, type: "country" as const, region: "International" as const, lat: 26.8206, lng: 30.8025 },
  { slug: "bangalore", name: "Bangalore", parentName: "Karnataka", type: "city" as const, region: "Indian Cities" as const, lat: 12.9716, lng: 77.5946 },
  { slug: "mumbai", name: "Mumbai", parentName: "Maharashtra", type: "city" as const, region: "Indian Cities" as const, lat: 19.0760, lng: 72.8777 },
  { slug: "new-delhi", name: "New Delhi", parentName: "Delhi", type: "city" as const, region: "Indian Cities" as const, lat: 28.6139, lng: 77.2090 },
  { slug: "noida", name: "Noida", parentName: "Uttar Pradesh", type: "city" as const, region: "Indian Cities" as const, lat: 28.5355, lng: 77.3910 },
  { slug: "gurgaon", name: "Gurgaon", parentName: "Haryana", type: "city" as const, region: "Indian Cities" as const, lat: 28.4595, lng: 77.0266 },
  { slug: "hyderabad", name: "Hyderabad", parentName: "Telangana", type: "city" as const, region: "Indian Cities" as const, lat: 17.3850, lng: 78.4867 },
  { slug: "pune", name: "Pune", parentName: "Maharashtra", type: "city" as const, region: "Indian Cities" as const, lat: 18.5204, lng: 73.8567 },
  { slug: "chennai", name: "Chennai", parentName: "Tamil Nadu", type: "city" as const, region: "Indian Cities" as const, lat: 13.0827, lng: 80.2707 }
]

export const SERVICE_METADATA: Record<string, { name: string; title: string; description: string; h1: string }> = {
  "ui-ux-design": {
    name: "UI/UX Design",
    title: "UI/UX Design Studio",
    description: "Premium user experience design and UI interface spec engineering.",
    h1: "UI/UX Design & Figma Prototyping Services in"
  },
  "web-development": {
    name: "Web Development",
    title: "Web Development Agency",
    description: "Modern Next.js, React, and TypeScript web development solutions.",
    h1: "Web Development & Next.js Engineering in"
  },
  "software-development": {
    name: "Software Development",
    title: "Custom Software Company",
    description: "Enterprise software systems, APIs, database integration, and workflow automation.",
    h1: "Custom Software & Systems Development in"
  },
  "mobile-app-development": {
    name: "Mobile App Development",
    title: "Mobile App Development Agency",
    description: "Native-quality React Native and Flutter mobile apps on iOS and Android.",
    h1: "Mobile App Development & App Store Launch in"
  },
  "ai-integration": {
    name: "AI Integration",
    title: "AI Integration & Machine Learning Agency",
    description: "Practical vector-search RAG models, prompt tuning, and operations automation.",
    h1: "AI Integration & Large Language Model (LLM) Services in"
  },
  "devops-services": {
    name: "DevOps Services",
    title: "DevOps & Cloud Infrastructure Consulting",
    description: "Infrastructure as Code (IaC), CI/CD release trains, and serverless scaling.",
    h1: "Cloud DevOps & Infrastructure Automation in"
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Generate unique conflict-free slugs mapping for all 15,000+ locations
let slugToLocationMap: Map<string, CompactLocation & { type: LocationType; region: RegionType }> | null = null

export function buildSlugMap() {
  if (slugToLocationMap) return slugToLocationMap

  const map = new Map<string, CompactLocation & { type: LocationType; region: RegionType }>()
  
  // Track slug frequencies to identify conflicts
  const slugCounts = new Map<string, number>()
  const rawList = getGlobalCityRegistry()

  // First pass: count frequencies of base slugs
  for (const item of rawList) {
    const s = slugify(item.name)
    slugCounts.set(s, (slugCounts.get(s) || 0) + 1)
  }

  // Second pass: map locations to unique conflict-free slugs
  for (const item of rawList) {
    const baseSlug = slugify(item.name)
    const count = slugCounts.get(baseSlug) || 1
    
    // If conflict exists and it's not a root country, append the parent name to differentiate
    const slug = (count > 1 && item.name !== item.parent)
      ? `${baseSlug}-${slugify(item.parent)}`
      : baseSlug

    // Determine type & region
    let type: LocationType = "city"
    let region: RegionType = "Indian Cities"

    if (item.country === "United States" || item.country === "Canada") {
      region = "International"
    } else if (item.country !== "India") {
      region = "International"
      if (item.name === item.parent) {
        type = "country"
      }
    } else {
      // India states list check
      const states = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"]
      if (states.includes(item.name)) {
        type = "state"
        region = "Indian States"
      }
    }

    map.set(slug, {
      ...item,
      type,
      region
    })
  }

  // Apply predefined static overrides for backwards compatibility
  for (const overwrite of STATIC_OVERWRITES) {
    const existing = map.get(overwrite.slug)
    map.set(overwrite.slug, {
      name: overwrite.name,
      parent: overwrite.parentName || overwrite.name,
      country: overwrite.region === "International" ? overwrite.name : "India",
      type: overwrite.type,
      region: overwrite.region,
      lat: overwrite.lat,
      lng: overwrite.lng
    })
  }

  slugToLocationMap = map
  return map
}

// Master dynamic lookup function
export function getLocationSEO(slug: string): LocationSEOData | null {
  const map = buildSlugMap()
  const loc = map.get(slug)
  if (!loc) return null

  // Localized meta and text generators
  const shortDesc = `Premium custom software development, mobile app development, Next.js web applications, and AI integrations in ${loc.name}, ${loc.parent}.`
  const keywordList = [
    `software development company ${loc.name.toLowerCase()}`,
    `web developers ${loc.name.toLowerCase()}`,
    `app development ${loc.name.toLowerCase()}`,
    `AI integration ${loc.name.toLowerCase()}`
  ]

  return {
    slug,
    name: loc.name,
    parentName: loc.parent,
    type: loc.type,
    region: loc.region,
    title: `Custom Software & AI Development Company in ${loc.name} | OfinIT`,
    description: shortDesc,
    h1: `Premium Software Engineering & AI Integration in ${loc.name}`,
    h2: `Scaling local businesses in ${loc.parent} with custom developer squads`,
    latitude: loc.lat,
    longitude: loc.lng,
    introText: `We partner with businesses in ${loc.name} and across the ${loc.parent} region. From custom backend systems to high-performance Next.js portals and secure vector-database RAG setups, our engineering squad accelerates digital transformation safely and on-time.`,
    keywords: keywordList
  }
}

// Helper to get ALL location slugs for pre-rendering
export function getAllLocationSlugs(): string[] {
  const map = buildSlugMap()
  return Array.from(map.keys())
}

// Get grouped locations for the directory index page
export function getGroupedLocations() {
  const map = buildSlugMap()
  const resolved: (LocationSEOData & { country: string })[] = []
  
  for (const [slug, item] of map.entries()) {
    resolved.push({
      slug,
      name: item.name,
      parentName: item.parent,
      type: item.type,
      region: item.region,
      title: "",
      description: "",
      h1: "",
      h2: "",
      latitude: item.lat,
      longitude: item.lng,
      introText: "",
      keywords: [],
      country: item.country
    })
  }

  return {
    international: resolved.filter((r) => r.region === "International"),
    states: resolved.filter((r) => r.region === "Indian States"),
    cities: resolved.filter((r) => r.region === "Indian Cities")
  }
}
