import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim()
  const blog = new URL("/blog", request.url)

  if (!token) {
    blog.searchParams.set("newsletter", "invalid")
    return NextResponse.redirect(blog)
  }

  const sub = await prisma.newsletterSubscription.findUnique({
    where: { confirmToken: token },
  })

  if (!sub || sub.tokenExpires < new Date()) {
    blog.searchParams.set("newsletter", "invalid")
    return NextResponse.redirect(blog)
  }

  if (!sub.confirmedAt) {
    await prisma.newsletterSubscription.update({
      where: { id: sub.id },
      data: { confirmedAt: new Date() },
    })
  }

  blog.searchParams.set("newsletter", "confirmed")
  return NextResponse.redirect(blog)
}
