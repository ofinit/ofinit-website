import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { CtaSectionContent } from "@/lib/site-content/types"

export function CTA({ content }: { content: CtaSectionContent }) {
  return (
    <section className="py-20 px-8 sm:px-16 lg:px-24 xl:px-32 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">{content.title}</h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">{content.body}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group" asChild>
              <a href={content.primaryHref}>
                {content.primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform inline" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={content.secondaryHref}>{content.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
