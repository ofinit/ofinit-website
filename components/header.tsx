import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { SiteHeaderContent } from "@/lib/site-content/types"

export function Header({ content }: { content: SiteHeaderContent }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">{content.logoAngleOpen}</span>
            <span className="text-xl font-bold text-foreground">{content.logoText}</span>
            <span className="text-xl font-bold text-blue-600">{content.logoAngleClose}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {content.navLinks.map((link) =>
              link.href.startsWith("/") && !link.href.startsWith("/#") ? (
                <Link
                  key={link.label + link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label + link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href={content.ctaHref}>{content.ctaLabel}</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
