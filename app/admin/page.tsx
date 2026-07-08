import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getAllCaseStudies } from "@/app/actions/case-study-actions"
import { listBlogPostsForAdmin } from "@/app/actions/blog-actions"
import { getHistoricalAnalytics, getRealtimeAnalytics } from "@/lib/analytics/tracker"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"
import { Card } from "@/components/ui/card"

export default async function AdminDashboard() {
  const blogPosts = await listBlogPostsForAdmin()
  const caseStudies = await getAllCaseStudies()
  
  // Fetch real-time active users and 30-day history metrics
  const analyticsData = await getHistoricalAnalytics(30)
  const activeUsers = getRealtimeAnalytics()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your blog content, SEO metrics, and portfolio statistics.</p>
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

      {/* Recharts Analytics Panel */}
      <AnalyticsCharts data={analyticsData} activeUsers={activeUsers} />

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
