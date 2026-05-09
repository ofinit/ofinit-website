import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import type { HeroContent } from "@/lib/site-content/types"

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative pt-32 pb-20 px-8 sm:px-16 lg:px-24 xl:px-32 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">{content.badge}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
            {content.headingBefore}
            <span className="text-primary">{content.headingAccent}</span>
            {content.headingAfter}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground text-balance mb-8 leading-relaxed max-w-2xl mx-auto">
            {content.subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group" asChild>
              <a href={content.primaryCtaHref}>
                {content.primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform inline" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={content.secondaryCtaHref}>{content.secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
