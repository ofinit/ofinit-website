import { CategoryForm } from "@/components/admin/category-form"
import { getCategoryById } from "@/app/actions/category-actions"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-gray-600 mt-1">Update category information</p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
