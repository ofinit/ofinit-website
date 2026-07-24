import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactLeadForm } from "@/components/contact-lead-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { getServiceIcon } from "@/lib/site-content/icons"
import { serviceSlugFromName } from "@/lib/services/slug"
import { getLocationSEO, getAllLocationSlugs } from "@/lib/seo/locations-data"
import { MapPin, Shield, CheckCircle2, ChevronRight } from "lucide-react"
import { prisma } from "@/lib/db/prisma"

type Props = {
  params: Promise<{ slug: string }>
}

const PRE_RENDER_LOCATIONS = ["usa", "canada", "dubai", "riyadh", "doha", "south-africa", "nigeria", "kenya", "egypt", "bangalore", "mumbai", "new-delhi", "noida", "gurgaon", "hyderabad", "pune", "chennai"]

export async function generateStaticParams() {
  return PRE_RENDER_LOCATIONS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = getLocationSEO(slug)
  if (!loc) {
    return {
      title: "Location Not Found",
    }
  }

  // Load custom database overrides if configured
  const customSettingsRecord = await prisma.siteSetting.findUnique({
    where: { key: "location_custom_seo_settings" }
  })
  const overrides = (customSettingsRecord?.value as Record<string, any>) || {}
  const custom = overrides[`/locations/${slug}`]
  if (custom) {
    if (custom.title) loc.title = custom.title
    if (custom.description) loc.description = custom.description
    if (custom.keywords) loc.keywords = custom.keywords
  }

  return {
    title: loc.title,
    description: loc.description,
    keywords: loc.keywords,
    alternates: {
      canonical: `https://ofinit.com/locations/${loc.slug}`,
    },
    openGraph: {
      title: loc.title,
      description: loc.description,
      url: `https://ofinit.com/locations/${loc.slug}`,
      type: "website",
    },
  }
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const loc = getLocationSEO(slug)
  if (!loc) {
    notFound()
  }

  // Load custom database overrides if configured
  const customSettingsRecord = await prisma.siteSetting.findUnique({
    where: { key: "location_custom_seo_settings" }
  })
  const overrides = (customSettingsRecord?.value as Record<string, any>) || {}
  const custom = overrides[`/locations/${slug}`]
  if (custom) {
    if (custom.title) loc.title = custom.title
    if (custom.description) loc.description = custom.description
    if (custom.keywords) loc.keywords = custom.keywords
  }

  const site = await loadPublicSiteContent()

  // Find other locations for footer interlinking
  const allSlugs = getAllLocationSlugs()
  const otherLocations = allSlugs
    .filter((s) => s !== slug)
    .map((s) => getLocationSEO(s))
    .filter(Boolean)
    .slice(0, 6)

  // Local Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `OfinIT Solutions - ${loc.name}`,
    "image": "https://ofinit.com/logo.png",
    "url": `https://ofinit.com/locations/${loc.slug}`,
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
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00",
    },
    "sameAs": [
      site.footer.socialGithub || "https://github.com/ofinit",
      site.footer.socialLinkedin || "https://linkedin.com/company/ofinit",
    ],
  }

  return (
    <>
      {/* Insert Local JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header content={site.header} />

      <main className="min-h-screen pt-16">
        
        {/* Localized Hero Section */}
        <section className="relative overflow-hidden py-24 bg-gradient-to-b from-background via-muted/10 to-background border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading and Local Intro */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-primary uppercase bg-primary/10 rounded-full">
                  <MapPin className="h-3 w-3" />
                  OfinIT {loc.name}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {loc.h1}
                </h1>
                <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed">
                  {loc.h2}
                </p>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  {loc.introText}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    Security-First Build
                  </span>
                  <span className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    On-Time Delivery
                  </span>
                </div>
              </div>

              {/* Right Column: Lead Form Card */}
              <div className="lg:col-span-5 bg-card border rounded-2xl p-6 sm:p-8 shadow-lg relative">
                <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 blur-3xl pointer-events-none rounded-full" />
                <h3 className="text-2xl font-bold mb-2">Request a Consultation</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get a free project evaluation and custom quote from our {loc.name} delivery lead.
                </p>
                <ContactLeadForm
                  serviceName={`Services in ${loc.name}`}
                  messagePlaceholder={`Tell us about your project or digital transformation plans in ${loc.name}.`}
                  leadSource="service"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Services Showcase */}
        <section className="py-20 bg-muted/20 border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Technology Services</h2>
              <p className="text-muted-foreground">
                Engineered for maximum reliability and scalability, aligned with modern business goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.services.items.map((service, index) => {
                const Icon = getServiceIcon(service.icon)
                const slug = serviceSlugFromName(service.title)
                return (
                  <Link key={`${service.title}-${index}`} href={`/services/${slug}`} className="block group">
                    <Card className="bg-card border-border hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed text-sm pt-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 pb-6 flex items-center text-xs font-semibold text-primary group-hover:underline">
                        Learn more <ChevronRight className="h-3 w-3 ml-1" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Localized Value Props */}
        <section className="py-20 bg-background border-b">
          <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Partner with OfinIT in {loc.name}?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Localized Domain Expertise</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        We understand the local business constraints, compliance guidelines, and technical demands specific to the {loc.name} ecosystem.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Robust Offshore & Nearshore Delivery</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        Our hybrid development team balances top-tier engineering cost-effectiveness with transparent project coordination and clear delivery.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Modern Engineering Stacks</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        We avoid legacy software systems, preferring fast frameworks (React, Next.js), cloud solutions, and scalable database engines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/10 border rounded-2xl p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">Enterprise Compliance & Security</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Every software build is backed by a secure development lifecycle, data protection safeguards, and production rollouts handled by dedicated DevOps personnel.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 border-t pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    ISO 27001 and secure data architecture guidelines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    Data residency checks (local cloud storage setups)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    Robust OAuth, RBAC, and standard API encryption
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Interlinking directory list */}
        {otherLocations.length > 0 && (
          <section className="py-12 bg-muted/10">
            <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-32 text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Other Locations We Serve
              </h4>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                {otherLocations.map((ol) => (
                  <Link
                    key={ol!.slug}
                    href={`/locations/${ol!.slug}`}
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
