import { SiteContentForm } from "./site-content-form"

export default function AdminSiteContentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website content</h1>
        <p className="text-gray-600 mt-2">
          Edit the public homepage sections, header, and footer. Changes apply to the marketing site after you save.
        </p>
      </div>
      <SiteContentForm />
    </div>
  )
}
