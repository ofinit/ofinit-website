import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/blog-data"
import { blogPostHref } from "@/lib/blog/paths"

type Props = {
  post: BlogPost
}

/** Blog listing / related card — image flush to top (no card padding above media). */
export function BlogPostCard({ post }: Props) {
  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col py-0 gap-0">
      <Link
        href={blogPostHref(post)}
        className="block relative aspect-video overflow-hidden bg-muted shrink-0"
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={post.image}
          alt={post.imageAlt || post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={640}
          height={360}
        />
      </Link>
      <CardHeader className="px-6 pt-5 pb-0">
        <Badge variant="secondary" className="w-fit mb-3">
          {post.category}
        </Badge>
        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
          <Link href={blogPostHref(post)}>{post.title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.publishedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full group/btn" asChild>
          <Link href={blogPostHref(post)}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
