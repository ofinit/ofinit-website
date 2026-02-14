import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { getCategories, deleteCategory } from "@/app/actions/category-actions"

export default async function CategoriesPage() {
  const { categories } = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Categories</h1>
          <p className="text-gray-600 mt-1">Manage your blog post categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found. Create your first category to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && <p className="text-gray-600 text-sm mt-1">{category.description}</p>}
                    <p className="text-gray-400 text-xs mt-1">Slug: {category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/categories/edit/${category.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await deleteCategory(category.id)
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
