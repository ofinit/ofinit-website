export interface CaseStudy {
  id: string
  title: string
  client: string
  category: string
  description: string
  tags: string[]
  image: string
  imageAlt: string
  projectUrl?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: "1",
    title: "E-Commerce Platform Redesign",
    client: "RetailCo",
    category: "UI/UX Design & Web Development",
    description:
      "Complete redesign and development of a modern e-commerce platform with improved user experience and conversion rates.",
    tags: ["UI/UX", "React", "Next.js", "E-commerce"],
    image: "/modern-ecommerce-interface.png",
    imageAlt: "Modern e-commerce interface design",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI-Powered Customer Service Platform",
    client: "TechSupport Inc",
    category: "AI Integration & Software Development",
    description:
      "Built an intelligent customer service platform with AI chatbot integration, reducing response times and improving customer satisfaction.",
    tags: ["AI", "Machine Learning", "Node.js", "Python"],
    image: "/ai-chatbot-customer-service-dashboard.jpg",
    imageAlt: "AI chatbot customer service dashboard",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Healthcare Mobile App",
    client: "MediCare Solutions",
    category: "Mobile App Development",
    description:
      "Developed a comprehensive healthcare mobile app for iOS and Android with appointment scheduling, telemedicine, and health tracking features.",
    tags: ["React Native", "Mobile", "Healthcare", "API Integration"],
    image: "/healthcare-mobile-app.png",
    imageAlt: "Healthcare mobile app interface",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Cloud Infrastructure Migration",
    client: "FinanceHub",
    category: "DevOps Services",
    description:
      "Migrated legacy infrastructure to cloud-native architecture with automated CI/CD pipelines and improved scalability.",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    image: "/cloud-infrastructure-devops-dashboard.jpg",
    imageAlt: "Cloud infrastructure DevOps dashboard",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Enterprise Resource Planning System",
    client: "Manufacturing Pro",
    category: "Software Development",
    description:
      "Custom ERP system built to streamline operations, inventory management, and reporting for a manufacturing company.",
    tags: ["Enterprise", "Database", "API", "Analytics"],
    image: "/enterprise-erp-system-dashboard.jpg",
    imageAlt: "Enterprise ERP system dashboard",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "SaaS Product Design System",
    client: "CloudTech",
    category: "UI/UX Design",
    description:
      "Created a comprehensive design system for a SaaS product, ensuring consistency across all platforms and improving development speed.",
    tags: ["Design System", "Figma", "Component Library", "Documentation"],
    image: "/modern-design-system-components.jpg",
    imageAlt: "Modern design system components",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
