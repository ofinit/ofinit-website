import { Users, Target, Award, Zap } from "lucide-react"

export function About() {
  const stats = [
    { icon: Users, label: "Expert Team", value: "50+" },
    { icon: Target, label: "Projects Delivered", value: "200+" },
    { icon: Award, label: "Years Experience", value: "10+" },
    { icon: Zap, label: "Client Satisfaction", value: "98%" },
  ]

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="max-width-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">About OfinIT Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Transforming ideas into powerful digital solutions since 2014
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                OfinIT Solutions Pvt. Ltd. is a leading technology company specializing in creating innovative digital
                solutions for businesses worldwide. We combine cutting-edge technology with creative design to deliver
                exceptional results.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our team of experienced developers, designers, and strategists work collaboratively to bring your vision
                to life. From initial concept to final deployment, we ensure every project exceeds expectations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We pride ourselves on staying ahead of technology trends, ensuring our clients benefit from the latest
                innovations in web development, mobile apps, AI integration, and cloud infrastructure.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                To empower businesses with innovative technology solutions that drive growth, enhance efficiency, and
                create lasting value. We believe in building long-term partnerships based on trust, quality, and
                exceptional service.
              </p>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted technology partner for businesses seeking digital transformation. We envision a
                future where technology seamlessly integrates with business operations, enabling unprecedented growth
                and innovation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
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
