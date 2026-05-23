/**
 * Upsert SEO blog posts in production (no tsx). Runs on container start when RUN_DB_SETUP=1.
 */
import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

function loadPosts() {
  const path = join(__dirname, "..", "prisma", "seed-data", "blog-posts.json")
  return JSON.parse(readFileSync(path, "utf8"))
}

async function main() {
  const posts = loadPosts()
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      create: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        image: post.image,
        imageAlt: post.imageAlt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        ogTitle: post.ogTitle ?? null,
        ogDescription: post.ogDescription ?? null,
        ogImage: post.ogImage ?? null,
        twitterTitle: post.twitterTitle ?? null,
        twitterDescription: post.twitterDescription ?? null,
        twitterImage: post.twitterImage ?? null,
        canonicalUrl: post.canonicalUrl ?? null,
        featured: Boolean(post.featured),
        status: post.status ?? "published",
      },
      update: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        image: post.image,
        imageAlt: post.imageAlt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        featured: Boolean(post.featured),
        status: post.status ?? "published",
      },
    })
  }
  console.log(`[seed] Blog posts ready: ${posts.length} articles`)
}

main()
  .catch((e) => {
    console.error("[seed] Blog seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
