import { getStatIcon } from "@/lib/site-content/icons"
import type { AboutSectionContent } from "@/lib/site-content/types"

export function About({ content }: { content: AboutSectionContent }) {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="max-width-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">{content.title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{content.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">{content.whoTitle}</h3>
              {content.whoParagraphs.map((para, i) => (
                <p key={i} className="text-muted-foreground mb-4 last:mb-0 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">{content.missionTitle}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{content.missionText}</p>
              <h3 className="text-2xl font-bold mb-4">{content.visionTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">{content.visionText}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.stats.map((stat, index) => {
              const Icon = getStatIcon(stat.icon)
              return (
                <div key={`${stat.label}-${index}`} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
