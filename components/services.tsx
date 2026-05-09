import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getServiceIcon } from "@/lib/site-content/icons"
import type { ServicesSectionContent } from "@/lib/site-content/types"
import { serviceSlugFromName } from "@/lib/services/slug"

export function Services({ content }: { content: ServicesSectionContent }) {
  return (
    <section id="services" className="py-20 px-8 sm:px-16 lg:px-24 xl:px-32 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">{content.title}</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((service, index) => {
            const Icon = getServiceIcon(service.icon)
            const slug = serviceSlugFromName(service.title)
            return (
              <Link key={`${service.title}-${index}`} href={`/services/${slug}`} className="block">
                <Card className="bg-card border-border hover:border-primary/50 transition-colors group h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">{service.description}</CardDescription>
                </CardContent>
              </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
