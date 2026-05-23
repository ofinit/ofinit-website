import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Tag, TrendingUp } from "lucide-react"
import { BlogNewsletterForm } from "@/components/blog-newsletter-form"
import type { BlogPost } from "@/lib/blog-data"
import { blogPostHref } from "@/lib/blog/paths"

type Props = {
  post: BlogPost
  recentPosts: BlogPost[]
  categories: string[]
}

export function BlogDetailSidebar({ post, recentPosts, categories }: Props) {
  const authorName = post.author.name
  const authorRole = post.author.role

  return (
    <aside className="space-y-6" aria-label="Blog sidebar">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">About the author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0"
              aria-hidden="true"
            >
              {post.author.avatar ? (
                <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-primary">{authorName.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-semibold">{authorName}</p>
              <p className="text-sm text-muted-foreground">{authorRole}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Expert in {post.category.toLowerCase()} with experience helping businesses ship reliable software and
            measurable outcomes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {recentPosts.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentPosts.map((recent) => (
                <li key={recent.id}>
                  <Link
                    href={blogPostHref(recent)}
                    className="block group rounded-lg p-2 -mx-2 hover:bg-muted/60 transition-colors"
                  >
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {recent.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={recent.createdAt}>{recent.publishedAt}</time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stay updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Subscribe for new articles on software delivery, AI, and growth.
          </p>
          <BlogNewsletterForm variant="compact" />
        </CardContent>
      </Card>
    </aside>
  )
}
