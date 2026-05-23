/** Rich default markdown for public service detail pages (used in seed and when DB body is still the short template). */

const SHARED_CLOSING = `
## How we work

Every engagement starts with a short discovery call to understand goals, constraints, and success metrics. We then propose a clear scope, timeline, and team structure—whether you need a focused sprint or a longer partnership. You get regular demos, written updates, and direct access to the people doing the work.

## Engagement options

- **Fixed-scope project** — Best when requirements are well defined; fixed milestones and deliverables.
- **Dedicated squad** — Designers and engineers embedded with your team for a quarter or longer.
- **Advisory + build** — Architecture or UX review followed by implementation.

---

*Questions? Use the form on this page to tell us about your project—we typically respond within one business day.*
`

function body(slug: string, intro: string, sections: string): string {
  return `${intro}\n\n${sections}\n${SHARED_CLOSING}`
}

const BODIES: Record<string, string> = {
  "ui-ux-design": body(
    "ui-ux-design",
    `## Overview

We help product teams turn complex ideas into interfaces people actually enjoy using. Our UI/UX practice covers research, information architecture, interaction design, visual design, and developer-ready handoff—so design decisions stay grounded in real user needs and business goals.

Whether you are launching a new product, redesigning a legacy app, or adding a major feature, we work as an extension of your team with clear artifacts at every stage.`,
    `## Who this is for

- SaaS and B2B products that need clearer onboarding and workflows
- Marketing sites that must convert without feeling generic
- Mobile apps where touch targets, gestures, and offline states matter
- Internal tools where productivity and error reduction drive ROI

## What we deliver

### Discovery & planning

We interview stakeholders, review analytics, and map current journeys. Outputs typically include personas or jobs-to-be-done summaries, competitive notes, and a prioritized problem list. For larger programs we run collaborative workshops and align on measurable UX outcomes before pixels appear on screen.

### Design & implementation support

We produce wireframes, clickable prototypes, and high-fidelity UI in Figma (or your system). Design systems and component specs are documented for engineering—spacing, states, responsive rules, and accessibility notes (WCAG-oriented). We partner with your developers during build to answer questions and adjust flows when edge cases appear.

### Testing & validation

Moderated usability sessions, unmoderated tests, and A/B-ready variants help validate assumptions early. We synthesize findings into actionable recommendations rather than dense reports nobody reads.

### Launch & iteration

Post-launch we help interpret behavioral data, tune flows, and plan the next iteration. Retainers are available for continuous product design support.

## Typical outcomes

- Faster time-to-clarity for new features (fewer rebuilds in code)
- Higher completion rates on critical flows (signup, checkout, activation)
- A coherent visual language across web and mobile
- Design assets engineers can implement without guesswork`,
  ),

  "web-development": body(
    "web-development",
    `## Overview

We build fast, maintainable websites and web applications using modern stacks—typically **Next.js**, **React**, and **TypeScript** on the front end, with APIs and data layers chosen to match your scale and team. From marketing sites with strong SEO to authenticated dashboards and customer portals, we focus on performance, security, and content workflows your marketing team can actually use.

Our work ships with sensible defaults: responsive layouts, accessible components, analytics hooks, and deployment pipelines that fit Vercel, AWS, or your existing hosting.`,
    `## Who this is for

- Companies replacing WordPress or page builders with a faster, tailored site
- Startups needing an MVP web app with room to grow
- Teams that outgrew template themes and need custom integrations (CRM, payments, auth)

## What we deliver

### Discovery & technical planning

We clarify must-have features, integrations, and non-functional requirements (traffic, locales, compliance). You receive a sitemap or route map, data model sketch, and a phased delivery plan with realistic timelines.

### Design-aligned development

We implement from your designs or collaborate with our UX team. Component libraries (e.g. shadcn/ui) keep UI consistent. Content can be managed via CMS fields, markdown, or admin panels we build for you.

### Quality, performance & SEO

Core Web Vitals, semantic HTML, structured data, and metadata patterns are baked in—not bolted on later. We run automated checks and manual QA across browsers and devices.

### DevOps & handover

CI/CD, preview environments, environment variables, and documentation for your team. Optional ongoing maintenance and feature sprints.

## Typical outcomes

- Sub-second perceived load on key landing pages
- Editor-friendly content updates without developer tickets for every copy change
- A codebase your team can extend with clear patterns and tests where it matters`,
  ),

  "software-development": body(
    "software-development",
    `## Overview

We design and build **custom software**—internal platforms, customer-facing products, integrations, and automation—that fits how your business actually operates. Architecture is chosen for maintainability: clear boundaries, typed APIs, observability, and security practices appropriate to your industry.

We are comfortable across the stack: backend services, admin tools, background jobs, third-party integrations (payments, ERP, messaging), and the web/mobile surfaces that tie them together.`,
    `## Who this is for

- Organizations replacing spreadsheets and manual handoffs with a single source of truth
- Products that need multi-tenant logic, role-based access, or complex workflows
- Teams that need a reliable partner for a greenfield build or a structured rewrite

## What we deliver

### Discovery & solution design

Workshops and documentation to capture rules, edge cases, and integration points. We deliver user stories, architecture diagrams, and risk registers so stakeholders share one picture of scope.

### Iterative build

Two-week (or your preferred) sprints with demoable increments. APIs are versioned and documented; databases migrated safely. Code review, automated tests on critical paths, and staging environments mirror production.

### Integration & data

Connectors for CRMs, billing, email, storage, and webhooks. ETL/import tools and audit logs when compliance matters.

### Hardening & scale

Load testing, security review, monitoring/alerting, and runbooks. We help you plan capacity and on-call expectations before go-live.

## Typical outcomes

- Fewer manual errors and faster processing times in operations
- Software your team owns—with documentation and no vendor lock-in to opaque platforms
- A roadmap for phase 2 features grounded in real usage data`,
  ),

  "mobile-app-development": body(
    "mobile-app-development",
    `## Overview

We deliver **native-quality mobile experiences** on iOS and Android—using cross-platform frameworks like **React Native** or **Flutter** when one codebase makes sense, and native modules when platform capabilities demand it. From consumer apps to field-service tools, we handle offline behavior, push notifications, app store compliance, and analytics.

Mobile is not a shrunken website: we design for thumb reach, interruptions, and device permissions with the same rigor as your core product.`,
    `## Who this is for

- Businesses launching a mobile companion to an existing web product
- Teams needing offline-first apps for staff in the field
- Founders validating an app MVP with a path to scale

## What we deliver

### Product & UX for mobile

Platform-specific patterns (navigation, sheets, permissions), prototyping, and usability review on real devices—not only simulators.

### Engineering

Feature modules, secure storage for tokens, deep linking, and API integration shared with your backend. Performance profiling for startup time, memory, and battery-sensitive use cases.

### Store launch

App Store and Google Play assets, privacy labels, release trains, and crash monitoring (e.g. Sentry). We guide you through review feedback and phased rollouts.

### Growth & maintenance

OTA updates where supported, feature flags, and analytics funnels. Ongoing bugfix and OS compatibility updates.

## Typical outcomes

- Apps that pass store review with clear privacy and stability stories
- Shared business logic with your web stack where appropriate—less duplicate work
- Documented release process your team can repeat`,
  ),

  "ai-integration": body(
    "ai-integration",
    `## Overview

We help you apply **AI and automation** where they create measurable value—not hype. That includes LLM-powered assistants, document extraction, classification, recommendation, and workflow automation wired into your existing systems with proper guardrails, logging, and cost controls.

We prioritize **reliable pipelines**: retrieval-augmented generation (RAG) over your data, human-in-the-loop review for high-stakes decisions, and fallbacks when models are uncertain.`,
    `## Who this is for

- Support and operations teams drowning in repetitive tickets or document review
- Products that want natural-language search over proprietary knowledge bases
- Leaders exploring copilots without exposing sensitive data to public models

## What we deliver

### Use-case discovery

We map processes, data sources, and failure modes. You get a ranked list of pilots with expected ROI, privacy constraints, and success metrics—not a generic “AI strategy” deck.

### Prototype & evaluate

Small proofs of concept with real samples of your data. We measure accuracy, latency, and cost per transaction before committing to production architecture.

### Production integration

APIs, queues, vector stores, and admin tools to tune prompts and curated content. Authentication, rate limits, and audit trails align with your compliance needs.

### Monitoring & improvement

Feedback loops, regression tests on golden datasets, and spend dashboards. Model upgrades are planned—not surprises.

## Typical outcomes

- Shorter handling time on targeted workflows (with human oversight where required)
- Answers grounded in *your* documents, not the open internet
- Clear ownership of data flows and vendor choices (OpenAI, Azure, Anthropic, local models, etc.)`,
  ),

  "devops-services": body(
    "devops-services",
    `## Overview

We modernize how you **build, deploy, and operate** software—CI/CD pipelines, infrastructure as code, containers, Kubernetes where it earns its complexity, and observability that wakes the right person at the right time. The goal is faster, safer releases and less firefighting.

We meet you where you are: greenfield cloud setup, tightening an existing AWS/GCP/Azure estate, or migrating off legacy hosting without multi-day outages.`,
    `## Who this is for

- Teams still deploying manually or with fragile scripts
- Companies scaling traffic and needing autoscaling, caching, and DR plans
- Regulated environments that need audit-friendly change management

## What we deliver

### Assessment & roadmap

Inventory of repos, environments, secrets, and bottlenecks. Prioritized plan for pipeline automation, environment parity, and cost optimization.

### Pipeline & platform engineering

GitHub Actions, GitLab CI, or your standard. Build caches, test gates, security scans, and promotion flows dev → staging → production. Preview apps for pull requests when useful.

### Infrastructure as code

Terraform or Pulumi modules, networking, IAM least privilege, and secrets management. Kubernetes or serverless—chosen for operability, not résumés.

### Observability & reliability

Metrics, logs, traces, SLOs, and runbooks. Incident response playbooks and backup/restore drills.

## Typical outcomes

- Deployments in minutes instead of hours, with rollback paths
- Documented environments new engineers can reproduce
- Lower cloud waste from right-sizing and idle resource cleanup`,
  ),
}

export function getDefaultServiceBodyMd(slug: string, shortDescription: string): string {
  return BODIES[slug] ?? `## Overview\n\n${shortDescription}\n\n## What we deliver\n\nContact us to discuss scope, timeline, and team fit for your project.\n${SHARED_CLOSING}`
}

/** Legacy seed template was very short; replace with full default content on read. */
export function isThinServiceBody(bodyMd: string): boolean {
  const t = bodyMd.trim()
  if (t.length < 500) return true
  if (t.includes("## What we deliver") && t.includes("- Discovery & planning") && t.length < 900) {
    return true
  }
  return false
}

export function resolveServiceBodyMd(storedBodyMd: string, slug: string, shortDescription: string): string {
  if (isThinServiceBody(storedBodyMd)) {
    return getDefaultServiceBodyMd(slug, shortDescription)
  }
  return storedBodyMd
}
