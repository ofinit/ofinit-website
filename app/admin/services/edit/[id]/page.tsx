import { notFound } from "next/navigation"
import { ServiceForm } from "@/components/admin/service-form"
import { getServiceByIdForAdmin } from "@/app/actions/service-actions"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceByIdForAdmin(id)
  if (!service) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-2">Update your service detail page</p>
      </div>

      <ServiceForm service={service} />
    </div>
  )
}

