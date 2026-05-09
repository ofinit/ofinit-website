import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogNewsletterForm } from "@/components/blog-newsletter-form"
import Link from "next/link"
import { getPublishedBlogPostsForPublic } from "@/lib/blog/queries"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { Suspense } from "react"
import { BlogNewsletterToast } from "@/components/blog-newsletter-toast"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const [blogPosts, site] = await Promise.all([getPublishedBlogPostsForPublic(), loadPublicSiteContent()])

  return (
    <>
      <Header content={site.header} />
      <Suspense fallback={null}>
        <BlogNewsletterToast />
      </Suspense>
      <main className="min-h-screen pt-16">
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Insights & <span className="text-primary">Innovation</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stay updated with the latest trends, best practices, and insights from the world of technology and
                digital transformation.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            {blogPosts.length === 0 ? (
              <p className="text-center text-muted-foreground">No articles yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                    <div className="bg-muted relative overflow-hidden aspect-video">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="ghost" className="w-full group/btn">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-8">
                Get the latest articles and insights delivered directly to your inbox.
              </p>
              <BlogNewsletterForm />
            </div>
          </div>
        </section>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
