export type BlogCoverTheme = {
  gradientFrom: string
  gradientTo: string
  accent: string
  category: string
  tagline: string
}

const BY_SLUG: Record<string, BlogCoverTheme> = {
  "future-ai-integration-business-applications": {
    gradientFrom: "#0f172a",
    gradientTo: "#4f46e5",
    accent: "#818cf8",
    category: "AI & Machine Learning",
    tagline: "AI integration strategy",
  },
  "building-scalable-mobile-apps-2024": {
    gradientFrom: "#042f2e",
    gradientTo: "#0d9488",
    accent: "#5eead4",
    category: "Mobile Development",
    tagline: "Scalable mobile architecture",
  },
  "ui-ux-design-b2b-saas-research-systems-handoff": {
    gradientFrom: "#4a044e",
    gradientTo: "#c026d3",
    accent: "#f0abfc",
    category: "UI/UX Design",
    tagline: "Research · Systems · Handoff",
  },
  "nextjs-business-websites-performance-seo": {
    gradientFrom: "#172554",
    gradientTo: "#2563eb",
    accent: "#93c5fd",
    category: "Web Development",
    tagline: "Performance & SEO",
  },
  "custom-software-vs-off-the-shelf-framework": {
    gradientFrom: "#0c4a6e",
    gradientTo: "#0891b2",
    accent: "#67e8f9",
    category: "Software Development",
    tagline: "Build vs buy framework",
  },
  "mobile-app-development-2025-cross-platform-offline": {
    gradientFrom: "#134e4a",
    gradientTo: "#059669",
    accent: "#6ee7b7",
    category: "Mobile Development",
    tagline: "Cross-platform · Offline",
  },
  "practical-ai-integration-operations-rag-roi": {
    gradientFrom: "#1e1b4b",
    gradientTo: "#7c3aed",
    accent: "#c4b5fd",
    category: "AI & Machine Learning",
    tagline: "RAG · Guardrails · ROI",
  },
  "devops-cicd-ship-faster-safely": {
    gradientFrom: "#431407",
    gradientTo: "#ea580c",
    accent: "#fdba74",
    category: "DevOps & Cloud",
    tagline: "CI/CD · Reliability",
  },
}

const DEFAULT_THEME: BlogCoverTheme = {
  gradientFrom: "#0f172a",
  gradientTo: "#3b82f6",
  accent: "#60a5fa",
  category: "OfinIT Insights",
  tagline: "Technology & delivery",
}

export function getBlogCoverTheme(slug: string): BlogCoverTheme {
  return BY_SLUG[slug] ?? DEFAULT_THEME
}
