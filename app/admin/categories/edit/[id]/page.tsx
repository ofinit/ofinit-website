import { CategoryForm } from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/categories-data"
import { notFound } from "next/navigation"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = getCategoryById(params.id)

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
