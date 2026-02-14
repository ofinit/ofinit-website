import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Eye, Edit, Plus, Briefcase } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"
import { getAllCaseStudies } from "@/app/actions/case-study-actions"

export default async function AdminDashboard() {
  const publishedPosts = blogPosts.filter((post) => post.status === "published")
  const draftPosts = blogPosts.filter((post) => post.status === "draft")

  const caseStudies = await getAllCaseStudies()
  const publishedCaseStudies = caseStudies.filter((study) => study.published)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your blog content and portfolio</p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/blogs/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Blog Post
            </Button>
          </Link>
          <Link href="/admin/case-studies/new">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              New Case Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{publishedPosts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Edit className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{draftPosts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Case Studies</p>
              <p className="text-2xl font-bold text-gray-900">{publishedCaseStudies.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Blog Posts</h2>
          <div className="space-y-4">
            {blogPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {post.category} • {post.publishedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.status === "published" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link href={`/admin/blogs/edit/${post.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link href="/admin/blogs">
              <Button variant="outline" className="w-full bg-transparent">
                View All Posts
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Case Studies</h2>
          <div className="space-y-4">
            {caseStudies.slice(0, 5).map((study) => (
              <div
                key={study.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{study.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {study.client} • {study.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      study.published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {study.published ? "published" : "draft"}
                  </span>
                  <Link href={`/admin/case-studies/edit/${study.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link href="/admin/case-studies">
              <Button variant="outline" className="w-full bg-transparent">
                View All Case Studies
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
