import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI Integration in Business Applications",
    excerpt:
      "Discover how artificial intelligence is transforming the way businesses operate and how you can leverage AI to gain a competitive advantage.",
    category: "AI & Machine Learning",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "/ai-business-integration-dashboard.jpg",
  },
  {
    id: 2,
    title: "Building Scalable Mobile Apps: Best Practices for 2024",
    excerpt:
      "Learn the essential strategies and technologies for creating mobile applications that can grow with your business needs.",
    category: "Mobile Development",
    date: "March 10, 2024",
    readTime: "7 min read",
    image: "/mobile-app-development.png",
  },
  {
    id: 3,
    title: "DevOps Automation: Streamlining Your Deployment Pipeline",
    excerpt:
      "Explore how modern DevOps practices can reduce deployment time, minimize errors, and improve team collaboration.",
    category: "DevOps",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "/devops-automation-pipeline.png",
  },
  {
    id: 4,
    title: "UI/UX Design Trends That Will Dominate in 2024",
    excerpt:
      "Stay ahead of the curve with these emerging design trends that are reshaping user experiences across digital platforms.",
    category: "Design",
    date: "February 28, 2024",
    readTime: "4 min read",
    image: "/modern-ux-design-trends.jpg",
  },
  {
    id: 5,
    title: "Microservices Architecture: When and Why to Use It",
    excerpt:
      "Understanding the benefits and challenges of microservices architecture and determining if it's the right choice for your project.",
    category: "Software Development",
    date: "February 22, 2024",
    readTime: "8 min read",
    image: "/microservices-architecture.png",
  },
  {
    id: 6,
    title: "Web Performance Optimization: Speed Matters",
    excerpt:
      "Learn proven techniques to improve your website's loading speed and deliver exceptional user experiences.",
    category: "Web Development",
    date: "February 15, 2024",
    readTime: "5 min read",
    image: "/web-performance-optimization.png",
  },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Insights & <span className="text-primary">Innovation</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stay updated with the latest trends, best practices, and insights from the world of technology and
                digital transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Mosaic Grid */}
        <section className="py-20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  <div className="bg-muted relative overflow-hidden aspect-video">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" className="w-full group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-8">
                Get the latest articles and insights delivered directly to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
