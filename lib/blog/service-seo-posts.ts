import type { BlogPost } from "@/lib/blog-data"
import { serviceSlugFromName } from "@/lib/services/slug"

const AUTHOR = {
  name: "OfinIT Editorial",
  role: "Technology & Delivery",
  avatar: "/author-writing.png",
}

function cta(serviceName: string, slug: string): string {
  return `<p><strong>Ready to talk?</strong> Explore our <a href="/services/${slug}">${serviceName} service</a> or <a href="/#contact">start a project inquiry</a>—we typically reply within one business day.</p>`
}

function post(
  id: string,
  serviceName: string,
  title: string,
  slug: string,
  excerpt: string,
  category: string,
  keywords: string[],
  image: string,
  imageAlt: string,
  body: string,
  publishedAt: string,
  readTime: string,
  featured = false,
): BlogPost {
  const serviceSlug = serviceSlugFromName(serviceName)
  return {
    id,
    title,
    slug,
    excerpt,
    category,
    author: AUTHOR,
    publishedAt,
    readTime,
    image,
    imageAlt,
    metaTitle: `${title} | OfinIT Blog`,
    metaDescription: excerpt,
    metaKeywords: keywords,
    featured,
    status: "published",
    content: `${body}\n${cta(serviceName, serviceSlug)}`,
  }
}

/** SEO-focused articles aligned with OfinIT service lines (lead + organic discovery). */
export function getServiceSeoBlogPosts(): BlogPost[] {
  return [
    post(
      "svc-blog-ui-ux",
      "UI/UX Design",
      "UI/UX Design for B2B SaaS: Research, Systems, and Handoff That Scales",
      "ui-ux-design-b2b-saas-research-systems-handoff",
      "How structured UX research, design systems, and developer-ready specs reduce rework and improve activation for B2B products.",
      "UI/UX Design",
      ["UI UX design", "B2B SaaS design", "design systems", "product design agency", "Figma handoff"],
      "/placeholder.jpg",
      "UI UX design workshop and interface screens",
      `<p>Great B2B SaaS products are won in the workflows—not just the marketing site. Teams that invest in UI/UX early ship features users understand on day one, support fewer tickets, and see better trial-to-paid conversion.</p>
<h2>Start with jobs-to-be-done, not wireframes</h2>
<p>Interview power users and internal stakeholders, map the critical paths (onboarding, billing, reporting), and rank friction by revenue impact. A lightweight research sprint prevents expensive UI debates later.</p>
<h2>Design systems pay off on the third feature</h2>
<p>Tokens for color, type, spacing, and components in Figma (or your tool) keep marketing and product visually aligned. Document states: empty, loading, error, and permissions—engineering will need them.</p>
<h2>Prototype before you commit to build</h2>
<p>Clickable flows validate assumptions with five to eight users. Fix navigation and copy early; pixels are cheap, sprints are not.</p>
<h2>Handoff that engineers trust</h2>
<p>Annotated specs, responsive rules, and accessibility notes (focus order, labels, contrast) reduce back-and-forth. Pair designers with devs during implementation for edge cases.</p>`,
      "May 18, 2025",
      "7 min read",
      true,
    ),
    post(
      "svc-blog-web",
      "Web Development",
      "Next.js for Business Websites: Performance, SEO, and Content Teams",
      "nextjs-business-websites-performance-seo",
      "Why modern React frameworks like Next.js help marketing sites rank faster, load quicker, and stay editable without developer bottlenecks.",
      "Web Development",
      ["Next.js agency", "business website development", "Core Web Vitals", "SEO web development", "OfinIT"],
      "/placeholder.jpg",
      "Modern web development and analytics dashboard",
      `<p>Your website is still your highest-trust channel. Slow pages, poor mobile scores, and stale content hurt both SEO and sales. A well-built Next.js site addresses all three.</p>
<h2>Performance is a ranking signal</h2>
<p>Optimize images, fonts, and server rendering so Largest Contentful Paint stays in the green. Fast sites convert better on paid traffic too—not only organic.</p>
<h2>SEO built into the architecture</h2>
<p>Semantic HTML, metadata per route, structured data, and clean URLs should be defaults. Blog and service pages need unique titles and descriptions aligned with intent.</p>
<h2>Editors need safe, fast publishing</h2>
<p>Pair engineering with CMS fields or admin tools so marketing can update copy without deploys. Preview environments catch mistakes before production.</p>
<h2>Integrate leads where readers convert</h2>
<p>Place protected inquiry forms on service and blog pages, not only a distant contact link. Track referrers to see which content drives pipeline.</p>`,
      "May 12, 2025",
      "6 min read",
    ),
    post(
      "svc-blog-software",
      "Software Development",
      "Custom Software vs Off-the-Shelf: A Practical Decision Framework",
      "custom-software-vs-off-the-shelf-framework",
      "When bespoke platforms beat SaaS sprawl—and how to scope MVPs, integrations, and long-term ownership.",
      "Software Development",
      ["custom software development", "enterprise software", "MVP development", "system integration"],
      "/placeholder.jpg",
      "Custom software architecture planning",
      `<p>Buying another subscription is easy; fixing fragmented data across twelve tools is not. Custom software makes sense when your process is the competitive advantage.</p>
<h2>Signals you need a custom build</h2>
<ul>
<li>Unique workflow rules that no vendor will prioritize</li>
<li>Heavy integration with ERP, logistics, or legacy APIs</li>
<li>Compliance or data residency requirements</li>
<li>Revenue scale where license fees exceed build cost</li>
</ul>
<h2>Scope an MVP that proves ROI in 90 days</h2>
<p>Ship the smallest end-to-end slice—one user role, one integration, one report. Measure hours saved or error reduction, then expand.</p>
<h2>Own your roadmap</h2>
<p>Open code, documented APIs, and automated tests beat black-box platforms when you need to move fast without vendor roadmaps.</p>`,
      "May 5, 2025",
      "8 min read",
    ),
    post(
      "svc-blog-mobile",
      "Mobile App Development",
      "Mobile App Development in 2025: Cross-Platform, Offline, and Store Readiness",
      "mobile-app-development-2025-cross-platform-offline",
      "What to plan before you build—platform choice, offline sync, push, analytics, and App Store / Play compliance.",
      "Mobile Development",
      ["mobile app development", "React Native", "Flutter", "app store launch", "offline mobile apps"],
      "/mobile-app-development-architecture.jpg",
      "Mobile application architecture on devices",
      `<p>Mobile users expect speed, reliability, and respect for their battery and data. Shipping a web wrapper is rarely enough for field teams or consumer retention.</p>
<h2>Choose cross-platform with intent</h2>
<p>React Native and Flutter are mature for many B2B and B2C cases. Go native when you need deep OS features or maximum graphics performance.</p>
<h2>Design for offline and sync</h2>
<p>Queue actions locally, resolve conflicts clearly, and show sync status. Field apps fail when staff cannot work without perfect LTE.</p>
<h2>Plan store submission early</h2>
<p>Privacy nutrition labels, account deletion, and crash-free sessions matter for approval. Budget time for review feedback and staged rollouts.</p>`,
      "April 28, 2025",
      "9 min read",
    ),
    post(
      "svc-blog-ai",
      "AI Integration",
      "Practical AI Integration for Operations: RAG, Guardrails, and ROI",
      "practical-ai-integration-operations-rag-roi",
      "How to pilot LLM workflows on your data—with human review, cost controls, and measurable outcomes.",
      "AI & Machine Learning",
      ["AI integration", "RAG", "LLM business", "process automation", "enterprise AI"],
      "/ai-business-integration-dashboard.jpg",
      "AI integration dashboard for business operations",
      `<p>Leaders are under pressure to “do AI” without clear use cases. The wins are usually narrow: support triage, document extraction, internal search, or drafting—not replacing entire departments overnight.</p>
<h2>Anchor on a measurable workflow</h2>
<p>Pick a process with volume and clear success metrics—minutes saved, error rate, or cost per ticket. Run a four-week pilot on real samples.</p>
<h2>RAG beats generic chat for proprietary knowledge</h2>
<p>Index policies, manuals, and tickets in a vector store with access controls. Answers should cite sources and refuse when confidence is low.</p>
<h2>Keep humans in the loop</h2>
<p>High-stakes decisions need review queues, audit logs, and escalation paths. Automate drafts, not accountability.</p>`,
      "April 20, 2025",
      "7 min read",
      true,
    ),
    post(
      "svc-blog-devops",
      "DevOps Services",
      "DevOps and CI/CD: Ship Faster Without Breaking Production",
      "devops-cicd-ship-faster-safely",
      "Pipelines, infrastructure as code, observability, and rollback patterns for teams tired of manual deploy stress.",
      "DevOps & Cloud",
      ["DevOps services", "CI/CD", "Kubernetes", "infrastructure as code", "site reliability"],
      "/placeholder.jpg",
      "DevOps pipeline and cloud infrastructure",
      `<p>Manual deploys do not scale with customer expectations. A solid DevOps foundation reduces downtime, security incidents, and engineer burnout.</p>
<h2>Automate the path to production</h2>
<p>Tests, lint, security scans, and staged promotions should run on every merge. Preview URLs help reviewers see changes live.</p>
<h2>Infrastructure as code for repeatability</h2>
<p>Terraform or Pulumi modules document environments. Drift detection keeps staging close to prod.</p>
<h2>Observe what matters</h2>
<p>Metrics, logs, and traces tied to SLOs—not vanity dashboards. Run game days on backups and restores before you need them.</p>`,
      "April 14, 2025",
      "6 min read",
    ),
  ]
}
