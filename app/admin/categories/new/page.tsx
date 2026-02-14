import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <p className="text-gray-600 mt-1">Create a new blog post category</p>
      </div>

      <CategoryForm />
    </div>
  )
}
