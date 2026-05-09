"use server"

import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db/prisma"
import type { CaseStudy } from "@/lib/case-studies-data"

function rowToCaseStudy(row: {
  id: string
  title: string
  client: string
  category: string
  description: string
  tags: unknown
  image: string
  imageAlt: string
  projectUrl: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}): CaseStudy {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    category: row.category,
    description: row.description,
    tags: row.tags as string[],
    image: row.image,
    imageAlt: row.imageAlt,
    projectUrl: row.projectUrl ?? undefined,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getCaseStudies() {
  const rows = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  })
  return rows.map(rowToCaseStudy)
}

export async function getAllCaseStudies() {
  const rows = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map(rowToCaseStudy)
}

export async function getCaseStudyById(id: string) {
  const row = await prisma.caseStudy.findUnique({ where: { id } })
  return row ? rowToCaseStudy(row) : undefined
}

export async function createCaseStudy(data: Omit<CaseStudy, "id" | "createdAt" | "updatedAt">) {
  const id = randomUUID()
  const now = new Date()
  const row = await prisma.caseStudy.create({
    data: {
      id,
      title: data.title,
      client: data.client,
      category: data.category,
      description: data.description,
      tags: data.tags,
      image: data.image,
      imageAlt: data.imageAlt,
      projectUrl: data.projectUrl ?? null,
      published: data.published,
      createdAt: now,
      updatedAt: now,
    },
  })

  revalidatePath("/admin/case-studies")
  revalidatePath("/case-studies")

  return { success: true as const, caseStudy: rowToCaseStudy(row) }
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>) {
  const existing = await prisma.caseStudy.findUnique({ where: { id } })
  if (!existing) {
    return { success: false as const, error: "Case study not found" }
  }

  const row = await prisma.caseStudy.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.client !== undefined ? { client: data.client } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
      ...(data.image !== undefined ? { image: data.image } : {}),
      ...(data.imageAlt !== undefined ? { imageAlt: data.imageAlt } : {}),
      ...(data.projectUrl !== undefined ? { projectUrl: data.projectUrl ?? null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  })

  revalidatePath("/admin/case-studies")
  revalidatePath("/case-studies")

  return { success: true as const, caseStudy: rowToCaseStudy(row) }
}

export async function deleteCaseStudy(id: string) {
  try {
    await prisma.caseStudy.delete({ where: { id } })
    revalidatePath("/admin/case-studies")
    revalidatePath("/case-studies")
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Case study not found" }
  }
}
