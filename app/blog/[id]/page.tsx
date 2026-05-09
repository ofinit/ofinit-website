import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, Tag, TrendingUp, Home, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPublishedBlogPostById, getPublishedBlogPostsForPublic, getAllBlogCategoriesFromPosts } from "@/lib/blog/queries"
import { loadPublicSiteContent } from "@/lib/site-content/load"

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPublishedBlogPostById(id)

  if (!post) {
    return { title: "Post Not Found" }
  }

  const keywords = Array.isArray(post.metaKeywords) ? post.metaKeywords : [post.category, "OfinIT"]

  return {
    title: post.metaTitle || `${post.title} | OfinIT Blog`,
    description: post.metaDescription || post.excerpt,
    keywords,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt,
      images: [{ url: post.ogImage || post.image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author.name],
      siteName: "OfinIT Solutions",
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || post.title,
      description: post.twitterDescription || post.excerpt,
      images: [post.twitterImage || post.image],
      creator: "@OfinIT",
    },
    alternates: {
      canonical: post.canonicalUrl || `https://ofinit.com/blog/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPublishedBlogPostById(id)

  if (!post) {
    notFound()
  }

  const site = await loadPublicSiteContent()
  const allPublished = await getPublishedBlogPostsForPublic()
  const relatedPosts = allPublished.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const recentPosts = allPublished.filter((p) => p.id !== post.id).slice(0, 4)
  const categories = await getAllBlogCategoriesFromPosts()

  const authorName = post.author.name
  const authorRole = post.author.role
  const dateIso = post.createdAt || new Date().toISOString()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: dateIso,
    dateModified: dateIso,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "OfinIT Solutions Pvt. Ltd.",
      logo: {
        "@type": "ImageObject",
        url: "https://ofinit.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ofinit.com/blog/${post.id}`,
    },
    articleSection: post.category,
    keywords: [post.category, "technology", "software development", "digital transformation"],
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ofinit.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://ofinit.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://ofinit.com/blog/${post.id}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />

      <Header content={site.header} />
      <main className="min-h-screen pt-16">
        <section className="py-12 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4" />
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4" />
                <li className="text-foreground font-medium line-clamp-1">{post.title}</li>
              </ol>
            </nav>

            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.excerpt}</p>
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={dateIso}>{post.publishedAt}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden"
                    aria-hidden="true"
                  >
                    {post.author.avatar ? (
                      <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold text-primary">{authorName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{authorName}</p>
                    <p className="text-sm text-muted-foreground">{authorRole}</p>
                  </div>
                </div>
                <Button variant="outline" size="icon" aria-label="Share article">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <figure className="aspect-video bg-muted rounded-lg overflow-hidden mb-8 shadow-lg">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.imageAlt || `Featured image for ${post.title}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={1200}
                    height={675}
                  />
                </figure>

                <article
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                  itemScope
                  itemType="https://schema.org/Article"
                >
                  <meta itemProp="headline" content={post.title} />
                  <meta itemProp="description" content={post.excerpt} />
                  <meta itemProp="datePublished" content={dateIso} />
                  <meta itemProp="author" content={authorName} />

                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <Button variant="outline" className="gap-2 bg-transparent" aria-label="Share this article">
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1" aria-label="Blog sidebar">
                <div className="sticky top-24 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About the Author</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden"
                          aria-hidden="true"
                        >
                          {post.author.avatar ? (
                            <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-semibold text-primary">{authorName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{authorName}</p>
                          <p className="text-sm text-muted-foreground">{authorRole}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expert in {post.category.toLowerCase()} with years of experience helping businesses leverage
                        technology for growth.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav aria-label="Blog categories">
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </nav>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recent Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav aria-label="Recent blog posts">
                        <ul className="space-y-4">
                          {recentPosts.map((recentPost) => (
                            <li key={recentPost.id}>
                              <Link
                                href={`/blog/${recentPost.id}`}
                                className="block group hover:bg-muted/50 p-2 rounded-lg transition-colors"
                              >
                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                  {recentPost.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <time dateTime={recentPost.createdAt || undefined}>{recentPost.publishedAt}</time>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Stay Updated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Subscribe to our newsletter for the latest insights and updates.
                      </p>
                      <Button className="w-full">Subscribe Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-20 bg-muted/30" aria-labelledby="related-articles">
            <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
              <h2 id="related-articles" className="text-3xl font-bold mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width={400}
                        height={225}
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Button variant="ghost" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-muted-foreground mb-8">
                Let&apos;s discuss how OfinIT can help you leverage the latest technologies to achieve your business
                goals.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/#contact">
                  <Button size="lg">Get in Touch</Button>
                </Link>
                <Link href="/case-studies">
                  <Button size="lg" variant="outline">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
