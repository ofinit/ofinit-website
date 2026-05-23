import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadPublishedServices, loadServiceBySlug } from "@/lib/services/load"
import { PublicMarkdown } from "@/components/public/public-markdown"
import { ServiceLeadSection } from "@/components/service-lead-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const svc = await loadServiceBySlug(slug)
  if (!svc) return { title: "Service Not Found" }
  return {
    title: `${svc.name} | OfinIT Services`,
    description: svc.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [site, svc, allServices] = await Promise.all([
    loadPublicSiteContent(),
    loadServiceBySlug(slug),
    loadPublishedServices(),
  ])
  if (!svc) notFound()

  const otherServices = allServices.filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <>
      <Header content={site.header} />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto max-w-4xl px-6 sm:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/services" className="hover:text-foreground">
                  Services
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{svc.name}</span>
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{svc.name}</h1>
                <Badge variant="secondary">Service</Badge>
              </div>
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">{svc.shortDescription}</p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="#inquiry">Get a quote</Link>
            </Button>
          </div>

          <div className="mt-10">
            <PublicMarkdown markdown={svc.bodyMd} />
          </div>

          <ServiceLeadSection serviceName={svc.name} />

          {otherServices.length > 0 ? (
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-semibold mb-2">Explore other services</h2>
              <p className="text-sm text-muted-foreground mb-6">Related capabilities from OfinIT</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {otherServices.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="group block">
                    <Card className="h-full transition-colors hover:border-primary/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base group-hover:text-primary transition-colors">{s.name}</CardTitle>
                        <CardDescription className="line-clamp-3 text-sm">{s.shortDescription}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link href="/services">
                  View all services
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </section>
          ) : null}
        </div>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
