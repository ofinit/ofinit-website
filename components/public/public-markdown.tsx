"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function PublicMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}

