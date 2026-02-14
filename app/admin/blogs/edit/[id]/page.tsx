import { notFound } from "next/navigation"
import { BlogForm } from "@/components/admin/blog-form"
import { blogPosts } from "@/lib/blog-data"

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-600 mt-2">Update your blog post and SEO settings</p>
      </div>

      <BlogForm post={post} />
    </div>
  )
}
