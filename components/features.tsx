import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

const features = [
  "Agile development methodology",
  "Scalable cloud architecture",
  "Modern tech stack",
  "24/7 support & maintenance",
  "Security-first approach",
  "Performance optimization",
  "Dedicated project managers",
  "Transparent communication",
  "On-time delivery guarantee",
  "Post-launch support",
  "Cost-effective solutions",
  "Industry best practices",
]

export function Features() {
  return (
    <section id="features" className="py-20 px-8 sm:px-16 lg:px-24 xl:px-32">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">Why Choose OfinIT?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We combine technical expertise with business acumen to deliver solutions that drive real results. Our team
              of experienced developers, designers, and DevOps engineers work together to bring your vision to life.
              With a proven track record of successful projects across various industries, we understand the unique
              challenges businesses face in their digital transformation journey.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-border">
              <Image
                src="/professional-team-collaborating-on-software-develo.jpg"
                alt="Professional team working on software development"
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
