import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Code, Smartphone, Brain, Server, Palette } from "lucide-react"

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces designed with user experience at the forefront. From wireframes to high-fidelity prototypes.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern frameworks and best practices for optimal performance.",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Enterprise-grade software solutions tailored to your business needs with scalable architecture.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
  },
  {
    icon: Brain,
    title: "AI Integration",
    description:
      "Leverage artificial intelligence and machine learning to automate processes and gain valuable insights.",
  },
  {
    icon: Server,
    title: "DevOps Services",
    description: "Streamline your deployment pipeline with CI/CD, cloud infrastructure, and monitoring solutions.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 px-8 sm:px-16 lg:px-24 xl:px-32 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Our Services</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Comprehensive technology solutions to power your digital transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
