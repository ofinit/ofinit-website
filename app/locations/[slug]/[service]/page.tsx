import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactLeadForm } from "@/components/contact-lead-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { getServiceIcon } from "@/lib/site-content/icons"
import { serviceSlugFromName } from "@/lib/services/slug"
import { getLocationSEO, SERVICE_METADATA, buildSlugMap } from "@/lib/seo/locations-data"
import { MapPin, Shield, CheckCircle2, ChevronRight, CornerDownRight } from "lucide-react"

type Props = {
  params: Promise<{ slug: string; service: string }>
}

const PRE_RENDER_LOCATIONS = ["usa", "canada", "dubai", "riyadh", "doha", "south-africa", "nigeria", "kenya", "egypt", "bangalore", "mumbai", "new-delhi", "noida", "gurgaon", "hyderabad", "pune", "chennai"]

export async function generateStaticParams() {
  const paramsList: { slug: string; service: string }[] = []
  const services = Object.keys(SERVICE_METADATA)

  for (const slug of PRE_RENDER_LOCATIONS) {
    for (const service of services) {
      paramsList.push({ slug, service })
    }
  }

  return paramsList
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params
  const loc = getLocationSEO(slug)
  const svcMeta = SERVICE_METADATA[service]

  if (!loc || !svcMeta) {
    return {
      title: "Not Found",
    }
  }

  const title = `${svcMeta.title} in ${loc.name} | OfinIT`
  const description = `${svcMeta.description} Custom-tailored solutions for businesses and startups in ${loc.name}, ${loc.parentName || ""}. Get a free quote today.`
  const keywords = [
    `${svcMeta.name.toLowerCase()} ${loc.name.toLowerCase()}`,
    `${svcMeta.title.toLowerCase()} ${loc.name.toLowerCase()}`,
    `software development ${loc.name.toLowerCase()}`,
    ...loc.keywords,
  ]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://ofinit.com/locations/${loc.slug}/${service}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ofinit.com/locations/${loc.slug}/${service}`,
      type: "website",
    },
  }
}

export default async function ServiceLocationPage({ params }: Props) {
  const { slug, service } = await params
  const loc = getLocationSEO(slug)
  const svcMeta = SERVICE_METADATA[service]

  if (!loc || !svcMeta) {
    notFound()
  }

  const site = await loadPublicSiteContent()

  // Find other services for local interlinking
  const otherServices = Object.entries(SERVICE_METADATA)
    .filter(([key]) => key !== service)
    .map(([key, value]) => ({ slug: key, ...value }))

  // Find other locations for service interlinking
  const map = buildSlugMap()
  const otherLocationLinks = Array.from(map.keys())
    .filter((s) => s !== slug)
    .slice(0, 6)
    .map((s) => getLocationSEO(s))
    .filter(Boolean)

  // Local Schema.org Structured Data with Service Nested
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `OfinIT - ${svcMeta.name} in ${loc.name}`,
    "image": "https://ofinit.com/logo.png",
    "url": `https://ofinit.com/locations/${loc.slug}/${service}`,
    "telephone": site.footer.contactPhone || "+1 (234) 567-890",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": loc.name,
      "addressRegion": loc.parentName || "",
      "addressCountry": loc.region === "International" ? loc.name : "India",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": loc.latitude,
      "longitude": loc.longitude,
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": svcMeta.name,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": svcMeta.name,
            "description": svcMeta.description,
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header content={site.header} />

      <main className="min-h-screen pt-16">
        
        {/* Service Hero Section */}
        <section className="relative overflow-hidden py-24 bg-gradient-to-b from-background via-muted/15 to-background border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading and Local Service Intro */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-primary uppercase bg-primary/10 rounded-full">
                  <MapPin className="h-3 w-3" />
                  {svcMeta.name} &bull; {loc.name}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {svcMeta.h1} <span className="text-primary">{loc.name}</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
                  {svcMeta.description} Tailored for local performance and business success.
                </p>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  Our dedicated engineering squads design, build, and deploy premium systems that fit seamlessly into the {loc.name} commercial ecosystem. We ensure strict compliance, low latency, and modern code structures.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Secure & Auditable Code
                  </span>
                  <span className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Dedicated Project Manager
                  </span>
                </div>
              </div>

              {/* Right Column: Lead Form Card */}
              <div className="lg:col-span-5 bg-card border rounded-2xl p-6 sm:p-8 shadow-lg relative">
                <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 blur-3xl pointer-events-none rounded-full" />
                <h3 className="text-2xl font-bold mb-2">Request {svcMeta.name} Quote</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get a detailed technical quote and team composition proposal for your project in {loc.name}.
                </p>
                <ContactLeadForm
                  serviceName={`${svcMeta.name} in ${loc.name}`}
                  messagePlaceholder={`Describe your ${svcMeta.name} project goals, timeline, and tech constraints in ${loc.name}.`}
                  leadSource="service"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Detailed Service Value Proposition */}
        <section className="py-20 bg-background border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Premium {svcMeta.name} Implementation</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We follow a rigorous software development lifecycle (SDLC) that bridges client goals with advanced technical architectures. Our developers are certified, native english speakers, and work transparently on Git repositories.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Agile Sprint Cadences:</span>
                      <p className="text-sm text-muted-foreground mt-0.5">Demos and deployments to staging every 2 weeks ensure absolute visibility.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Automated QA Testing:</span>
                      <p className="text-sm text-muted-foreground mt-0.5">Continuous integration checking formatting, security vulnerability, and static types.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Modern Coding Standards:</span>
                      <p className="text-sm text-muted-foreground mt-0.5">Using modular, typed codes (React, Next.js, TypeScript) that are easy to transfer or maintain.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/10 border rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Enterprise Compliance Features</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Our systems are designed to protect user privacy and support local audit regulations, including India's DPDP Act, GDPR, and GCC cybersecurity frameworks.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    Data isolation & local database configurations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    Robust OAuth 2.0 / JWT security protocols
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    Full unit test coverages for business calculators
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Localized Interlinking Grid */}
        <section className="py-20 bg-muted/10 border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <h3 className="text-2xl font-bold mb-8 text-center">Explore Other Tech Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((svc) => (
                <Link key={svc.slug} href={`/locations/${loc.slug}/${svc.slug}`} className="block group">
                  <Card className="bg-card border hover:border-primary/50 transition-all h-full p-6 flex flex-col justify-between">
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CornerDownRight className="h-4 w-4 text-primary shrink-0" />
                        {svc.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm pt-2">
                        {svc.description}
                      </CardDescription>
                    </CardHeader>
                    <span className="text-xs font-semibold text-primary mt-4 inline-flex items-center group-hover:underline">
                      View Service in {loc.name} &rarr;
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Location interlinking footer */}
        {otherLocationLinks.length > 0 && (
          <section className="py-12 bg-card">
            <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                {svcMeta.name} in Other Regions
              </h4>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                {otherLocationLinks.map((ol) => (
                  <Link
                    key={ol!.slug}
                    href={`/locations/${ol!.slug}/${service}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{ol!.name}</span>
                    <span className="text-muted-foreground/30">&bull;</span>
                  </Link>
                ))}
                <Link href="/locations" className="text-primary hover:underline font-medium">
                  View All Directory &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer content={site.footer} />
    </>
  )
}
