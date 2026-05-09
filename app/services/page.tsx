import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadPublishedServices } from "@/lib/services/load"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function ServicesIndexPage() {
  const [site, services] = await Promise.all([loadPublicSiteContent(), loadPublishedServices()])

  return (
    <>
      <Header content={site.header} />
      <main className="min-h-screen pt-16">
        <section className="py-14 sm:py-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Services</h1>
              <p className="text-muted-foreground mt-3">
                Explore what we build—design, engineering, AI, and infrastructure services tailored to your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {services.map((s) => (
                <Card key={s.slug} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">{s.shortDescription}</CardDescription>
                    <div className="mt-5">
                      <Button variant="outline" asChild className="bg-transparent">
                        <Link href={`/services/${s.slug}`}>View details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer content={site.footer} />
    </>
  )
}

