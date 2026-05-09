import { CaseStudyForm } from "@/components/admin/case-study-form"
import { getCaseStudyById } from "@/app/actions/case-study-actions"
import { notFound } from "next/navigation"

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const caseStudy = await getCaseStudyById(id)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Case Study</h1>
        <p className="text-gray-600 mt-2">Update case study details</p>
      </div>

      <CaseStudyForm caseStudy={caseStudy} />
    </div>
  )
}
