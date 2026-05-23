import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogPostCard } from "@/components/blog-post-card"
import { Calendar, Clock, ArrowLeft, Share2, Tag, Home, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPostById,
  getPublishedBlogPostsForPublic,
  getAllBlogCategoriesFromPosts,
} from "@/lib/blog/queries"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { blogPostCanonicalUrl, blogPostHref } from "@/lib/blog/paths"
import { BlogPostBody } from "@/components/blog-post-body"
import { BlogDetailSidebar } from "@/components/blog-detail-sidebar"
import { BlogLeadSection } from "@/components/blog-lead-section"

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ slug: string }> }

async function lookupPost(param: string) {
  if (/^\d+$/.test(param)) {
    return getPublishedBlogPostById(param)
  }
  return getPublishedBlogPostBySlug(param)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: param } = await params
  const post = await lookupPost(param)

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
      canonical: post.canonicalUrl || blogPostCanonicalUrl(post),
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
  const { slug: param } = await params
  const post = await lookupPost(param)

  if (!post) {
    notFound()
  }

  if (/^\d+$/.test(param)) {
    redirect(blogPostHref(post), 308)
  }

  const site = await loadPublicSiteContent()
  const allPublished = await getPublishedBlogPostsForPublic()
  const relatedPosts = allPublished.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const recentPosts = allPublished.filter((p) => p.id !== post.id).slice(0, 4)
  const categories = await getAllBlogCategoriesFromPosts()

  const authorName = post.author.name
  const authorRole = post.author.role
  const dateIso = post.createdAt || new Date().toISOString()
  const canonical = post.canonicalUrl || blogPostCanonicalUrl(post)

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
      "@id": canonical,
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
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />

      <Header content={site.header} />
      <main className="min-h-screen pt-16">
        <section className="py-10 sm:py-12 bg-gradient-to-b from-background to-muted/20 border-b border-border/60">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <li className="text-foreground font-medium line-clamp-1">{post.title}</li>
              </ol>
            </nav>

            <Link href="/blog">
              <Button variant="ghost" className="mb-6 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance leading-tight max-w-4xl">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 text-pretty max-w-3xl leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={dateIso}>{post.publishedAt}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden"
                  aria-hidden="true"
                >
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-primary">{authorName.charAt(0)}</span>
                  )}
                </div>
                <span className="font-medium text-foreground">{authorName}</span>
                <span className="hidden sm:inline">· {authorRole}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-12 items-start">
              <div className="min-w-0">
                <figure className="aspect-video bg-muted rounded-xl overflow-hidden mb-10 shadow-md">
                  <img
                    src={post.image}
                    alt={post.imageAlt || `Featured image for ${post.title}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={1200}
                    height={675}
                  />
                </figure>

                <article itemScope itemType="https://schema.org/Article" className="max-w-none">
                  <meta itemProp="headline" content={post.title} />
                  <meta itemProp="description" content={post.excerpt} />
                  <meta itemProp="datePublished" content={dateIso} />
                  <meta itemProp="author" content={authorName} />
                  <BlogPostBody slug={post.slug} content={post.content} />
                </article>

                <div className="mt-10 pt-8 border-t flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" aria-label="Share this article">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <BlogLeadSection postTitle={post.title} />
              </div>

              <BlogDetailSidebar post={post} recentPosts={recentPosts} categories={categories} />
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30 border-t" aria-labelledby="related-articles">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
              <h2 id="related-articles" className="text-2xl sm:text-3xl font-bold mb-8">
                Related articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer content={site.footer} />
    </>
  )
}
