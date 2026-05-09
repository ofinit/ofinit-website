import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { blogPosts } from "../lib/blog-data"
import { categories } from "../lib/categories-data"
import { caseStudiesData } from "../lib/case-studies-data"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "admin123", 10)
  await prisma.adminUser.upsert({
    where: { email: "admin@ofinit.com" },
    create: {
      email: "admin@ofinit.com",
      passwordHash,
    },
    update: { passwordHash },
  })

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? null,
        createdAt: new Date(cat.createdAt),
      },
      update: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? null,
      },
    })
  }

  for (const post of blogPosts) {
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
        featured: post.featured,
        status: post.status,
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
        ogTitle: post.ogTitle ?? null,
        ogDescription: post.ogDescription ?? null,
        ogImage: post.ogImage ?? null,
        twitterTitle: post.twitterTitle ?? null,
        twitterDescription: post.twitterDescription ?? null,
        twitterImage: post.twitterImage ?? null,
        canonicalUrl: post.canonicalUrl ?? null,
        featured: post.featured,
        status: post.status,
      },
    })
  }

  for (const study of caseStudiesData) {
    await prisma.caseStudy.upsert({
      where: { id: study.id },
      create: {
        id: study.id,
        title: study.title,
        client: study.client,
        category: study.category,
        description: study.description,
        tags: study.tags,
        image: study.image,
        imageAlt: study.imageAlt,
        projectUrl: study.projectUrl ?? null,
        published: study.published,
        createdAt: new Date(study.createdAt),
        updatedAt: new Date(study.updatedAt),
      },
      update: {
        title: study.title,
        client: study.client,
        category: study.category,
        description: study.description,
        tags: study.tags,
        image: study.image,
        imageAlt: study.imageAlt,
        projectUrl: study.projectUrl ?? null,
        published: study.published,
        updatedAt: new Date(),
      },
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
