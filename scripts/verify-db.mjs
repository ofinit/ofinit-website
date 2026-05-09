import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
try {
  const [adminUsers, blogPosts, categories, caseStudies, gstRows] = await Promise.all([
    prisma.adminUser.count(),
    prisma.blogPost.count(),
    prisma.category.count(),
    prisma.caseStudy.count(),
    prisma.gstInvoiceRecord.count(),
  ])
  console.log(
    JSON.stringify(
      {
        ok: true,
        adminUsers,
        blogPosts,
        categories,
        caseStudies,
        gstInvoiceRecords: gstRows,
      },
      null,
      2,
    ),
  )
} catch (e) {
  console.error(JSON.stringify({ ok: false, error: String(e.message || e) }))
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
