import { CaseStudyForm } from "@/components/admin/case-study-form"

export default function NewCaseStudyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Case Study</h1>
        <p className="text-gray-600 mt-2">Create a new portfolio case study</p>
      </div>

      <CaseStudyForm />
    </div>
  )
}
