"use server"

import { caseStudiesData, type CaseStudy } from "@/lib/case-studies-data"
import { revalidatePath } from "next/cache"

export async function getCaseStudies() {
  return caseStudiesData.filter((study) => study.published)
}

export async function getAllCaseStudies() {
  return caseStudiesData
}

export async function getCaseStudyById(id: string) {
  return caseStudiesData.find((study) => study.id === id)
}

export async function createCaseStudy(data: Omit<CaseStudy, "id" | "createdAt" | "updatedAt">) {
  const newCaseStudy: CaseStudy = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  caseStudiesData.push(newCaseStudy)
  revalidatePath("/admin/case-studies")
  revalidatePath("/case-studies")

  return { success: true, caseStudy: newCaseStudy }
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>) {
  const index = caseStudiesData.findIndex((study) => study.id === id)

  if (index === -1) {
    return { success: false, error: "Case study not found" }
  }

  caseStudiesData[index] = {
    ...caseStudiesData[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  revalidatePath("/admin/case-studies")
  revalidatePath("/case-studies")

  return { success: true, caseStudy: caseStudiesData[index] }
}

export async function deleteCaseStudy(id: string) {
  const index = caseStudiesData.findIndex((study) => study.id === id)

  if (index === -1) {
    return { success: false, error: "Case study not found" }
  }

  caseStudiesData.splice(index, 1)
  revalidatePath("/admin/case-studies")
  revalidatePath("/case-studies")

  return { success: true }
}
