import { resolveBlogContent } from "@/lib/blog/enrich-post"

type Props = {
  slug: string
  content: string
}

export function BlogPostBody({ slug, content }: Props) {
  const html = resolveBlogContent(slug, content)

  return (
    <div
      className="blog-article"
      itemProp="articleBody"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
