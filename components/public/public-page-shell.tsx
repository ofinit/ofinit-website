import Link from "next/link"
import { PublicMarkdown } from "./public-markdown"

export function PublicPageShell({
  title,
  slug,
  markdown,
}: {
  title: string
  slug: string
  markdown: string
}) {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto max-w-3xl px-6 sm:px-8 py-12 sm:py-16">
        <p className="text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-sm text-muted-foreground mb-10">Page: /{slug}</p>

        <PublicMarkdown markdown={markdown} />
      </div>
    </main>
  )
}

