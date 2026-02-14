import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, Tag, TrendingUp, Home, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Blog post data (in a real app, this would come from a database or CMS)
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI Integration in Business Applications",
    excerpt:
      "Discover how artificial intelligence is transforming the way businesses operate and how you can leverage AI to gain a competitive advantage.",
    category: "AI & Machine Learning",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "/ai-business-integration.jpg",
    author: "Rajesh Kumar",
    authorRole: "AI Solutions Architect",
    content: `
      <p>Artificial Intelligence is no longer a futuristic concept—it's here, and it's transforming how businesses operate across every industry. From automating routine tasks to providing deep insights through data analysis, AI integration has become a critical competitive advantage.</p>

      <h2>Why AI Integration Matters</h2>
      <p>In today's fast-paced business environment, companies that leverage AI effectively can make faster decisions, reduce operational costs, and deliver superior customer experiences. AI-powered applications can process vast amounts of data in real-time, identify patterns humans might miss, and continuously improve their performance through machine learning.</p>

      <h2>Key Areas of AI Integration</h2>
      <h3>1. Customer Service Automation</h3>
      <p>AI-powered chatbots and virtual assistants can handle customer inquiries 24/7, providing instant responses and freeing up human agents to focus on complex issues. Natural Language Processing (NLP) enables these systems to understand context and sentiment, delivering more personalized interactions.</p>

      <h3>2. Predictive Analytics</h3>
      <p>Machine learning models can analyze historical data to predict future trends, helping businesses forecast demand, optimize inventory, and identify potential risks before they become problems.</p>

      <h3>3. Process Automation</h3>
      <p>Robotic Process Automation (RPA) combined with AI can automate complex workflows, reducing errors and increasing efficiency. From invoice processing to data entry, AI can handle repetitive tasks with remarkable accuracy.</p>

      <h2>Getting Started with AI Integration</h2>
      <p>The key to successful AI integration is starting with clear business objectives. Identify specific problems you want to solve or processes you want to improve. Begin with pilot projects that demonstrate value quickly, then scale successful implementations across your organization.</p>

      <p>At OfinIT, we help businesses navigate their AI journey, from strategy development to implementation and ongoing optimization. Our team of AI experts can assess your needs and design custom solutions that deliver measurable results.</p>

      <h2>The Future is Now</h2>
      <p>As AI technology continues to evolve, the possibilities for business applications are expanding rapidly. Companies that embrace AI integration today will be better positioned to compete in tomorrow's digital economy. The question is no longer whether to integrate AI, but how quickly you can do it effectively.</p>
    `,
  },
  {
    id: "2",
    title: "Building Scalable Mobile Apps: Best Practices for 2024",
    excerpt:
      "Learn the essential strategies and technologies for creating mobile applications that can grow with your business needs.",
    category: "Mobile Development",
    date: "March 10, 2024",
    readTime: "7 min read",
    image: "/mobile-app-development.jpg",
    author: "Priya Sharma",
    authorRole: "Mobile Development Lead",
    content: `
      <p>Building a mobile app is one thing; building a mobile app that can scale to millions of users while maintaining performance and reliability is another challenge entirely. In 2024, scalability isn't just a nice-to-have—it's essential for success.</p>

      <h2>Architecture Matters</h2>
      <p>The foundation of any scalable mobile app is its architecture. Modern mobile apps should follow clean architecture principles, separating concerns and making the codebase maintainable as it grows. Consider using MVVM or Clean Architecture patterns that promote testability and flexibility.</p>

      <h2>Cross-Platform vs Native</h2>
      <p>The debate between cross-platform and native development continues, but in 2024, frameworks like React Native and Flutter have matured significantly. For most businesses, cross-platform development offers the best balance of performance, development speed, and cost-effectiveness.</p>

      <h2>Backend Infrastructure</h2>
      <p>Your mobile app is only as scalable as your backend. Implement microservices architecture, use cloud-native technologies, and design APIs that can handle increasing loads. Consider serverless architectures for specific functions to optimize costs and scalability.</p>

      <h2>Performance Optimization</h2>
      <p>Users expect apps to be fast and responsive. Implement lazy loading, optimize images, use efficient data structures, and minimize network requests. Monitor performance metrics continuously and address bottlenecks proactively.</p>

      <h2>Security at Scale</h2>
      <p>As your user base grows, so does your security responsibility. Implement robust authentication, encrypt sensitive data, and follow security best practices from day one. Regular security audits become increasingly important as you scale.</p>

      <p>At OfinIT, we specialize in building mobile applications that are designed for scale from the ground up. Our experienced team can help you make the right architectural decisions and implement best practices that ensure your app can grow with your business.</p>
    `,
  },
  {
    id: "3",
    title: "DevOps Automation: Streamlining Your Deployment Pipeline",
    excerpt:
      "Explore how modern DevOps practices can reduce deployment time, minimize errors, and improve team collaboration.",
    category: "DevOps",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "/devops-automation.jpg",
    author: "Amit Patel",
    authorRole: "DevOps Engineer",
    content: `
      <p>In today's fast-paced development environment, the ability to deploy code quickly and reliably is crucial. DevOps automation transforms the deployment process from a manual, error-prone task into a streamlined, repeatable workflow.</p>

      <h2>The Power of CI/CD</h2>
      <p>Continuous Integration and Continuous Deployment (CI/CD) pipelines are the backbone of modern DevOps. By automating the build, test, and deployment process, teams can release features faster while maintaining quality and stability.</p>

      <h2>Infrastructure as Code</h2>
      <p>Managing infrastructure through code (IaC) brings version control, repeatability, and consistency to your infrastructure. Tools like Terraform and CloudFormation allow you to define your entire infrastructure in code, making it easy to replicate environments and track changes.</p>

      <h2>Monitoring and Observability</h2>
      <p>Automation doesn't end with deployment. Implement comprehensive monitoring and logging to detect issues early. Use tools that provide real-time insights into application performance, infrastructure health, and user experience.</p>

      <h2>Container Orchestration</h2>
      <p>Kubernetes has become the standard for container orchestration, providing automated deployment, scaling, and management of containerized applications. Combined with Docker, it enables consistent environments from development to production.</p>

      <h2>Getting Started</h2>
      <p>Begin by automating your most time-consuming manual processes. Start with automated testing, then move to automated deployments for non-production environments. Gradually expand automation as your team becomes comfortable with the tools and processes.</p>

      <p>OfinIT's DevOps experts can help you design and implement automation strategies that fit your organization's needs, reducing deployment time and improving reliability across your entire software delivery lifecycle.</p>
    `,
  },
  {
    id: "4",
    title: "UI/UX Design Trends That Will Dominate in 2024",
    excerpt:
      "Stay ahead of the curve with these emerging design trends that are reshaping user experiences across digital platforms.",
    category: "Design",
    date: "February 28, 2024",
    readTime: "4 min read",
    image: "/ux-design-trends.jpg",
    author: "Sneha Reddy",
    authorRole: "Lead UI/UX Designer",
    content: `
      <p>The world of UI/UX design is constantly evolving, and 2024 brings exciting new trends that prioritize user experience, accessibility, and visual appeal. Here are the key trends shaping digital design this year.</p>

      <h2>Minimalist Maximalism</h2>
      <p>This seemingly contradictory trend combines clean, minimalist layouts with bold, expressive elements. Think simple interfaces with striking typography, vibrant colors, and purposeful animations that guide user attention without overwhelming.</p>

      <h2>AI-Powered Personalization</h2>
      <p>Interfaces are becoming smarter, adapting to individual user preferences and behaviors. AI-driven personalization creates unique experiences for each user, from customized content recommendations to adaptive layouts.</p>

      <h2>Immersive 3D Elements</h2>
      <p>With improved browser capabilities and faster internet speeds, 3D elements are becoming more common in web design. From subtle depth effects to fully interactive 3D experiences, this trend adds a new dimension to digital interfaces.</p>

      <h2>Accessibility First</h2>
      <p>Inclusive design is no longer optional. Designers are prioritizing accessibility from the start, ensuring interfaces work for users of all abilities. This includes proper color contrast, keyboard navigation, screen reader support, and clear visual hierarchies.</p>

      <h2>Micro-interactions</h2>
      <p>Small, delightful animations and feedback mechanisms enhance user engagement. From button hover effects to loading animations, these subtle interactions make interfaces feel more responsive and alive.</p>

      <h2>Dark Mode Evolution</h2>
      <p>Dark mode has evolved beyond simple color inversion. Modern dark themes are carefully crafted with appropriate contrast, reduced eye strain, and aesthetic appeal that rivals traditional light themes.</p>

      <p>At OfinIT, our design team stays at the forefront of these trends, creating interfaces that are not only beautiful but also functional, accessible, and aligned with your brand identity.</p>
    `,
  },
  {
    id: "5",
    title: "Microservices Architecture: When and Why to Use It",
    excerpt:
      "Understanding the benefits and challenges of microservices architecture and determining if it's the right choice for your project.",
    category: "Software Development",
    date: "February 22, 2024",
    readTime: "8 min read",
    image: "/microservices-architecture.jpg",
    author: "Vikram Singh",
    authorRole: "Software Architect",
    content: `
      <p>Microservices architecture has become increasingly popular, but it's not a one-size-fits-all solution. Understanding when and why to use microservices is crucial for making the right architectural decisions for your project.</p>

      <h2>What Are Microservices?</h2>
      <p>Microservices architecture breaks down applications into small, independent services that communicate through well-defined APIs. Each service focuses on a specific business capability and can be developed, deployed, and scaled independently.</p>

      <h2>Benefits of Microservices</h2>
      <h3>Scalability</h3>
      <p>Scale individual services based on demand rather than scaling the entire application. This leads to more efficient resource utilization and cost savings.</p>

      <h3>Technology Flexibility</h3>
      <p>Different services can use different technologies, allowing teams to choose the best tool for each specific task. This flexibility enables innovation and prevents technology lock-in.</p>

      <h3>Faster Development</h3>
      <p>Small, focused teams can work on different services simultaneously, speeding up development and enabling faster feature releases.</p>

      <h3>Resilience</h3>
      <p>If one service fails, others can continue operating. This isolation improves overall system reliability and makes it easier to identify and fix issues.</p>

      <h2>When to Use Microservices</h2>
      <p>Microservices are ideal for large, complex applications with multiple teams, applications that need to scale different components independently, and systems that require high availability and resilience. They're also beneficial when you need technology flexibility or want to enable continuous deployment.</p>

      <h2>When NOT to Use Microservices</h2>
      <p>For small applications with limited complexity, the overhead of microservices may not be justified. If you have a small team or limited DevOps capabilities, managing multiple services can be challenging. Start with a monolithic architecture and evolve to microservices as your needs grow.</p>

      <h2>Making the Transition</h2>
      <p>If you're moving from a monolith to microservices, do it gradually. Identify bounded contexts, extract services incrementally, and ensure you have proper monitoring and orchestration in place before breaking apart your monolith.</p>

      <p>OfinIT's experienced architects can help you evaluate whether microservices are right for your project and guide you through the implementation process, ensuring you get the benefits while avoiding common pitfalls.</p>
    `,
  },
  {
    id: "6",
    title: "Web Performance Optimization: Speed Matters",
    excerpt:
      "Learn proven techniques to improve your website's loading speed and deliver exceptional user experiences.",
    category: "Web Development",
    date: "February 15, 2024",
    readTime: "5 min read",
    image: "/web-performance.jpg",
    author: "Ananya Iyer",
    authorRole: "Frontend Developer",
    content: `
      <p>Website performance directly impacts user experience, conversion rates, and search engine rankings. In today's fast-paced digital world, users expect websites to load instantly, and even a one-second delay can significantly impact your bottom line.</p>

      <h2>Why Performance Matters</h2>
      <p>Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load. Furthermore, Google uses page speed as a ranking factor, meaning faster sites get better search visibility. Performance optimization isn't just about user experience—it's about business success.</p>

      <h2>Key Optimization Techniques</h2>
      <h3>Image Optimization</h3>
      <p>Images often account for the majority of page weight. Use modern formats like WebP, implement lazy loading, and serve responsive images sized appropriately for different devices. Consider using a CDN for faster image delivery.</p>

      <h3>Code Splitting</h3>
      <p>Don't load all your JavaScript at once. Use code splitting to load only what's needed for the current page, then lazy load additional functionality as needed. Modern frameworks like Next.js make this easy with automatic code splitting.</p>

      <h3>Caching Strategies</h3>
      <p>Implement effective caching at multiple levels—browser caching, CDN caching, and server-side caching. Use cache-control headers appropriately and consider service workers for offline functionality.</p>

      <h3>Minimize HTTP Requests</h3>
      <p>Each HTTP request adds latency. Combine files where appropriate, use CSS sprites for icons, and inline critical CSS. Consider using HTTP/2 or HTTP/3 for better multiplexing.</p>

      <h3>Server-Side Rendering</h3>
      <p>For content-heavy sites, server-side rendering (SSR) or static site generation (SSG) can dramatically improve initial page load times and SEO. Next.js and similar frameworks make this straightforward.</p>

      <h2>Measuring Performance</h2>
      <p>Use tools like Google Lighthouse, WebPageTest, and Chrome DevTools to measure performance. Focus on Core Web Vitals—Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).</p>

      <h2>Continuous Optimization</h2>
      <p>Performance optimization isn't a one-time task. Monitor performance regularly, set performance budgets, and make optimization part of your development workflow. Automated testing can catch performance regressions before they reach production.</p>

      <p>At OfinIT, we build performance into every website from the ground up. Our team uses the latest optimization techniques and best practices to ensure your site delivers exceptional speed and user experience across all devices.</p>
    `,
  },
]

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | OfinIT Blog`,
    description: post.excerpt,
    keywords: [post.category, "OfinIT", "technology solutions", "software development", "digital transformation"],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      siteName: "OfinIT Solutions",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      creator: "@OfinIT",
    },
    alternates: {
      canonical: `https://ofinit.com/blog/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const recentPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 4)
  const categories = Array.from(new Set(blogPosts.map((p) => p.category)))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "OfinIT Solutions Pvt. Ltd.",
      logo: {
        "@type": "ImageObject",
        url: "https://ofinit.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ofinit.com/blog/${post.id}`,
    },
    articleSection: post.category,
    keywords: [post.category, "technology", "software development", "digital transformation"],
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ofinit.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://ofinit.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://ofinit.com/blog/${post.id}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4" />
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4" />
                <li className="text-foreground font-medium line-clamp-1">{post.title}</li>
              </ol>
            </nav>

            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.excerpt}</p>
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-lg font-semibold text-primary">{post.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                  </div>
                </div>
                <Button variant="outline" size="icon" aria-label="Share article">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <figure className="aspect-video bg-muted rounded-lg overflow-hidden mb-8 shadow-lg">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={`Featured image for ${post.title}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={1200}
                    height={675}
                  />
                </figure>

                <article
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                  itemScope
                  itemType="https://schema.org/Article"
                >
                  <meta itemProp="headline" content={post.title} />
                  <meta itemProp="description" content={post.excerpt} />
                  <meta itemProp="datePublished" content={new Date(post.date).toISOString()} />
                  <meta itemProp="author" content={post.author} />

                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <Button variant="outline" className="gap-2 bg-transparent" aria-label="Share this article">
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1" aria-label="Blog sidebar">
                <div className="sticky top-24 space-y-8">
                  {/* Author Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About the Author</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <span className="text-2xl font-semibold text-primary">{post.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{post.author}</p>
                          <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expert in {post.category.toLowerCase()} with years of experience helping businesses leverage
                        technology for growth.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav aria-label="Blog categories">
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </nav>
                    </CardContent>
                  </Card>

                  {/* Recent Posts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recent Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav aria-label="Recent blog posts">
                        <ul className="space-y-4">
                          {recentPosts.map((recentPost) => (
                            <li key={recentPost.id}>
                              <Link
                                href={`/blog/${recentPost.id}`}
                                className="block group hover:bg-muted/50 p-2 rounded-lg transition-colors"
                              >
                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                  {recentPost.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <time dateTime={new Date(recentPost.date).toISOString()}>{recentPost.date}</time>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </CardContent>
                  </Card>

                  {/* Newsletter CTA */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Stay Updated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Subscribe to our newsletter for the latest insights and updates.
                      </p>
                      <Button className="w-full">Subscribe Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20 bg-muted/30" aria-labelledby="related-articles">
            <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
              <h2 id="related-articles" className="text-3xl font-bold mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={`Featured image for ${relatedPost.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width={400}
                        height={225}
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Button variant="ghost" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-muted-foreground mb-8">
                Let's discuss how OfinIT can help you leverage the latest technologies to achieve your business goals.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/#contact">
                  <Button size="lg">Get in Touch</Button>
                </Link>
                <Link href="/case-studies">
                  <Button size="lg" variant="outline">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
