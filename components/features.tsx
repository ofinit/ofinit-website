import { CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { FeaturesSectionContent } from "@/lib/site-content/types"

export function Features({ content }: { content: FeaturesSectionContent }) {
  return (
    <section id="features" className="py-20 px-8 sm:px-16 lg:px-24 xl:px-32">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">{content.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{content.body}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {content.bullets.map((feature, index) => (
                <div key={`${feature}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-border">
              <Image
                src={content.imageSrc || "/professional-team-collaborating-on-software-develo.jpg"}
                alt={content.imageAlt}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
