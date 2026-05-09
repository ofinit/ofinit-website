import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCaseStudies } from "@/app/actions/case-study-actions"
import { loadPublicSiteContent } from "@/lib/site-content/load"

export const dynamic = "force-dynamic"

export default async function CaseStudiesPage() {
  const [caseStudies, site] = await Promise.all([getCaseStudies(), loadPublicSiteContent()])

  return (
    <>
      <Header content={site.header} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              Success Stories
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">Our Case Studies</h1>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Explore how we've helped businesses transform their digital presence and achieve remarkable results
              through innovative technology solutions.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={study.image || "/placeholder.svg"}
                      alt={study.imageAlt}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Badge variant="outline">{study.category}</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{study.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Client: {study.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{study.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {study.projectUrl ? (
                      <Button variant="link" className="p-0 h-auto text-primary" asChild>
                        <a href={study.projectUrl} target="_blank" rel="noopener noreferrer">
                          View Project
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button variant="link" className="p-0 h-auto text-primary">
                        View Project
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">Ready to Create Your Success Story?</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                <Link href="/#contact">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer content={site.footer} />
    </>
  )
}
