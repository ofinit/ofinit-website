import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-gray-600 mt-2">Add a new blog post with comprehensive SEO optimization</p>
      </div>

      <BlogForm />
    </div>
  )
}
