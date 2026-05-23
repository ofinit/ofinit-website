import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogNewsletterForm } from "@/components/blog-newsletter-form"
import { BlogPostCard } from "@/components/blog-post-card"
import { getPublishedBlogPostsForPublic } from "@/lib/blog/queries"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { Suspense } from "react"
import { BlogNewsletterToast } from "@/components/blog-newsletter-toast"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog & Insights | OfinIT",
  description:
    "Articles on UI/UX, web development, custom software, mobile apps, AI integration, and DevOps—practical guides to help your team ship and grow.",
  keywords: [
    "OfinIT blog",
    "web development",
    "UI UX",
    "custom software",
    "mobile apps",
    "AI integration",
    "DevOps",
  ],
}

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
                  <BlogPostCard key={post.id} post={post} />
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
