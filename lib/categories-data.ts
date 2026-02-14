export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
}

export const categories: Category[] = [
  {
    id: "1",
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    description: "Articles about artificial intelligence and machine learning",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Web Development",
    slug: "web-development",
    description: "Web development tutorials and best practices",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Mobile app development guides and tips",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "DevOps",
    slug: "devops",
    description: "DevOps practices and automation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Design principles and user experience",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Software Architecture",
    slug: "software-architecture",
    description: "Software architecture patterns and best practices",
    createdAt: new Date().toISOString(),
  },
]

export function getCategories(): Category[] {
  return categories
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug)
}
