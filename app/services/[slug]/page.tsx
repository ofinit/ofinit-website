import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadServiceBySlug } from "@/lib/services/load"
import { PublicMarkdown } from "@/components/public/public-markdown"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const [site, svc] = await Promise.all([loadPublicSiteContent(), loadServiceBySlug(slug)])
  if (!svc) notFound()

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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{svc.name}</h1>
                <Badge variant="secondary">Service</Badge>
              </div>
              <p className="text-muted-foreground mt-3">{svc.shortDescription}</p>
            </div>
            <Button asChild>
              <Link href="/#contact">Talk to us</Link>
            </Button>
          </div>

          <div className="mt-10">
            <PublicMarkdown markdown={svc.bodyMd} />
          </div>
        </div>
      </main>
      <Footer content={site.footer} />
    </>
  )
}

