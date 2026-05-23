"use client"

import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { normalizeMarkdown } from "@/lib/markdown/normalize"
import { cn } from "@/lib/utils"

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-10 mb-4 text-foreground scroll-mt-24 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground scroll-mt-24">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2 text-foreground">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-base leading-7 text-foreground/90 mb-4 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 mb-5 pl-6 list-disc space-y-2 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 mb-5 pl-6 list-decimal space-y-2 text-foreground/90">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-7 pl-1">{children}</li>,
  hr: () => <hr className="my-10 border-border" />,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic text-foreground/90">{children}</em>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/40 pl-4 my-6 italic text-muted-foreground">{children}</blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const url = href ?? "#"
    const internal = url.startsWith("/")
    const className = "text-primary font-medium underline-offset-4 hover:underline"
    if (internal) {
      return (
        <Link href={url} className={className}>
          {children}
        </Link>
      )
    }
    return (
      <a href={url} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
}

type PublicMarkdownProps = {
  markdown: string
  className?: string
}

export function PublicMarkdown({ markdown, className }: PublicMarkdownProps) {
  const normalized = normalizeMarkdown(markdown)

  return (
    <div className={cn("public-markdown max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {normalized}
      </ReactMarkdown>
    </div>
  )
}
