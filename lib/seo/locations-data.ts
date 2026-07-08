import { INDIA_GST_STATES } from "@/lib/gst/country-states"

export type LocationType = "country" | "state" | "city"
export type RegionType = "International" | "Indian States" | "Indian Cities"

export interface LocationSEOData {
  slug: string
  name: string
  parentName?: string
  type: LocationType
  region: RegionType
  title: string
  description: string
  h1: string
  h2: string
  latitude: number
  longitude: number
  introText: string
  keywords: string[]
}

// Indian state-to-slug mapping helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Pre-defined high-priority targets
export const STATIC_LOCATIONS: LocationSEOData[] = [
  // --- International Targets ---
  {
    slug: "usa",
    name: "United States",
    type: "country",
    region: "International",
    title: "Custom Software & AI Development Company in USA | OfinIT",
    description: "Partner with OfinIT for premium custom software development, mobile app development, Next.js web solutions, and AI integration in the USA.",
    h1: "Premium Software Engineering & AI Integration in the United States",
    h2: "Scale your US startup or enterprise with offshore engineering excellence",
    latitude: 37.0902,
    longitude: -95.7129,
    introText: "We partner with US-based startups, SMEs, and enterprises to build scalable digital infrastructure. From California to New York, our offshore squads help teams accelerate product roadmaps, implement practical AI/RAG integrations, and manage secure AWS/GCP cloud environments.",
    keywords: ["software development company USA", "offshore developers US", "AI integration agency USA", "DevOps consulting US"]
  },
  {
    slug: "canada",
    name: "Canada",
    type: "country",
    region: "International",
    title: "Custom Software Development & DevOps Services in Canada | OfinIT",
    description: "Scale your Canadian business with OfinIT. Premium custom software, cross-platform mobile apps, Next.js web applications, and DevOps consulting in Canada.",
    h1: "Software Engineering & Cloud Infrastructure Services in Canada",
    h2: "Custom software and secure cloud systems engineered for Canadian businesses",
    latitude: 56.1304,
    longitude: -106.3468,
    introText: "Supporting teams in Toronto, Vancouver, Montreal, and beyond. We build secure, compliant custom applications and streamline deployment pipelines so your engineering team can focus on growth.",
    keywords: ["software development Canada", "hire Next.js developers Canada", "DevOps agency Canada", "mobile app developer Canada"]
  },
  {
    slug: "dubai",
    name: "Dubai",
    parentName: "United Arab Emirates",
    type: "city",
    region: "International",
    title: "Custom Software & AI Development Company in Dubai, UAE | OfinIT",
    description: "Leading technology partner in Dubai. Discover enterprise custom software development, mobile apps, AI solutions, and DevOps in the Gulf region.",
    h1: "Enterprise Software & AI Integration Services in Dubai",
    h2: "Empowering digital transformation and smart systems across the UAE",
    latitude: 25.2048,
    longitude: 55.2708,
    introText: "Dubai is leading the world in digital innovation. We deliver smart custom software solutions, enterprise automation, vector-search RAG models, and cloud setups tailored for GCC businesses and government entities.",
    keywords: ["software development company Dubai", "AI solutions Dubai", "mobile app developers Dubai", "digital transformation UAE"]
  },
  {
    slug: "riyadh",
    name: "Riyadh",
    parentName: "Saudi Arabia",
    type: "city",
    region: "International",
    title: "Custom Software Development & Digital Transformation in Riyadh | OfinIT",
    description: "Bespoke software development, AI automation, and cloud services in Riyadh. Powering Saudi Vision 2030 digital initiatives with secure engineering.",
    h1: "Bespoke Software Engineering & AI Automation in Riyadh",
    h2: "Accelerating Saudi Vision 2030 with high-trust cloud & software builds",
    latitude: 24.7136,
    longitude: 46.6753,
    introText: "Supporting Riyadh’s rapid technological growth. We build high-performance custom applications, localize systems to Saudi requirements, and build modern operations dashboards.",
    keywords: ["software development Riyadh", "digital transformation Saudi Arabia", "custom software KSA", "DevOps Riyadh"]
  },
  {
    slug: "doha",
    name: "Doha",
    parentName: "Qatar",
    type: "city",
    region: "International",
    title: "Custom Software & Web Development Agency in Doha, Qatar | OfinIT",
    description: "OfinIT is a trusted software engineering company in Doha. We build scalable corporate websites, mobile apps, and custom enterprise portals in Qatar.",
    h1: "Custom Software, Mobile Apps & Web Development in Doha",
    h2: "Scale your digital footprint in Qatar with cutting-edge engineering",
    latitude: 25.2854,
    longitude: 51.5310,
    introText: "We work with Qatari enterprises, startups, and public sectors to develop scalable web, mobile, and custom software systems designed to run reliably under high loads.",
    keywords: ["software development Doha", "web design Qatar", "mobile app development Doha", "IT consulting Qatar"]
  },
  {
    slug: "south-africa",
    name: "South Africa",
    type: "country",
    region: "International",
    title: "Custom Software & Mobile App Development in South Africa | OfinIT",
    description: "Bespoke software, React Native apps, Next.js web applications, and DevOps consulting in Johannesburg, Cape Town, and across South Africa.",
    h1: "Bespoke Software & Mobile App Development in South Africa",
    h2: "Scalable mobile experiences and enterprise backends designed for SA business",
    latitude: -30.5595,
    longitude: 22.9375,
    introText: "Serving businesses in Johannesburg, Cape Town, Durban, and Pretoria. We design native-quality mobile apps and offline-first field tools to support reliable workflows.",
    keywords: ["software development South Africa", "mobile app development Johannesburg", "React Native South Africa", "DevOps Cape Town"]
  },
  {
    slug: "nigeria",
    name: "Nigeria",
    type: "country",
    region: "International",
    title: "Software Development & AI Integration Services in Nigeria | OfinIT",
    description: "Scale your tech stack in Lagos and across Nigeria. Premium mobile app developers, web development, custom software, and DevOps consulting.",
    h1: "Custom Software & Scalable Web Development in Nigeria",
    h2: "Accelerating fintech and digital product engineering for Nigerian startups",
    latitude: 9.0820,
    longitude: 8.6753,
    introText: "Serving Nigeria's vibrant tech ecosystem from Lagos to Abuja. We specialize in building reliable APIs, transactional web backends, and user-friendly mobile experiences.",
    keywords: ["software development company Nigeria", "hire developers Lagos", "mobile app development Nigeria", "web development Lagos"]
  },
  {
    slug: "kenya",
    name: "Kenya",
    type: "country",
    region: "International",
    title: "Custom Software & Cloud DevOps Agency in Kenya | OfinIT",
    description: "OfinIT builds high-trust custom systems, mobile applications, and serverless architectures for businesses in Nairobi and across Kenya.",
    h1: "Custom Software Engineering & Cloud Infrastructure in Kenya",
    h2: "Empowering mobile money integrations, offline sync, and enterprise systems",
    latitude: -0.0236,
    longitude: 37.9062,
    introText: "Partner with us in Nairobi and East Africa. We design software architectures that support mobile payments, offline data sync, and performant user flows.",
    keywords: ["software development Nairobi", "mobile app developers Kenya", "cloud DevOps Kenya", "web design Nairobi"]
  },
  {
    slug: "egypt",
    name: "Egypt",
    type: "country",
    region: "International",
    title: "Custom Software & Web Development Company in Egypt | OfinIT",
    description: "High-performance software systems, Next.js web applications, mobile apps, and AI integration for enterprises and scale-ups in Egypt.",
    h1: "Custom Software Engineering & Mobile App Development in Egypt",
    h2: "Premium digital transformation solutions for Egyptian business hubs",
    latitude: 26.8206,
    longitude: 30.8025,
    introText: "Providing Cairo and Alexandria with solid engineering. We build secure customer portals, inventory/operations software, and optimize web applications for local audiences.",
    keywords: ["software development Egypt", "web development Cairo", "mobile app development Egypt", "IT solutions Alexandria"]
  },

  // --- Pre-defined Indian Cities ---
  {
    slug: "bangalore",
    name: "Bangalore",
    parentName: "Karnataka",
    type: "city",
    region: "Indian Cities",
    title: "Custom Software & AI Development Company in Bangalore | OfinIT",
    description: "OfinIT is a premier technology partner in Bangalore (Bengaluru). We deliver custom software development, Next.js websites, mobile apps, and AI systems.",
    h1: "Premium Custom Software & AI Systems in Bangalore",
    h2: "Engineering excellence for the Silicon Valley of India",
    latitude: 12.9716,
    longitude: 77.5946,
    introText: "Based in India's primary startup capital, Bangalore (Bengaluru). We help fast-growing tech startups and enterprises design and build solid products, run RAG evaluations, and manage automated cloud environments.",
    keywords: ["software development company Bangalore", "AI developers Bangalore", "custom software Bengaluru", "Nextjs developers Bangalore"]
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    parentName: "Maharashtra",
    type: "city",
    region: "Indian Cities",
    title: "Enterprise Software & Web Development Services in Mumbai | OfinIT",
    description: "Empower your corporate business in Mumbai. OfinIT specializes in custom enterprise software, UI/UX design, mobile apps, and DevOps services.",
    h1: "Enterprise Software Engineering & UI/UX Design in Mumbai",
    h2: "Secure, scalable custom platforms built for India's financial capital",
    latitude: 19.0760,
    longitude: 72.8777,
    introText: "Mumbai is the financial heartbeat of India. We design and build enterprise-grade software, secure payment architectures, client portals, and offer DevOps consulting to corporate and financial institutions.",
    keywords: ["software development Mumbai", "enterprise software company Mumbai", "web development agency Mumbai", "DevOps services Mumbai"]
  },
  {
    slug: "new-delhi",
    name: "New Delhi",
    parentName: "Delhi",
    type: "city",
    region: "Indian Cities",
    title: "Custom Software Development & Mobile Apps in New Delhi | OfinIT",
    description: "Leading technology partner in Delhi NCR. Custom software, mobile app development, and AI automation services in New Delhi.",
    h1: "Bespoke Software & Mobile App Development in New Delhi",
    h2: "Empowering tech startups and digital commerce in Delhi NCR",
    latitude: 28.6139,
    longitude: 77.2090,
    introText: "Serving New Delhi and the National Capital Region (NCR). We help brands build robust mobile platforms, automate processes, and scale up content-heavy marketing sites.",
    keywords: ["software development New Delhi", "app developers Delhi", "IT services Delhi NCR", "web development New Delhi"]
  },
  {
    slug: "noida",
    name: "Noida",
    parentName: "Uttar Pradesh",
    type: "city",
    region: "Indian Cities",
    title: "Web & Software Development Company in Noida | OfinIT",
    description: "Scale your operations in Noida. We build custom software solutions, React Native/Flutter mobile apps, and Next.js websites for growing businesses.",
    h1: "Custom Software Engineering & Cloud DevOps in Noida",
    h2: "Agile product engineering and robust IT deployments for Noida tech hubs",
    latitude: 28.5355,
    longitude: 77.3910,
    introText: "Supporting Noida's commercial and tech zones. We focus on building highly maintainable source code, automate deployment routines, and implement smart user journeys.",
    keywords: ["software development Noida", "web development company Noida", "app developers Noida", "DevOps services Noida"]
  },
  {
    slug: "gurgaon",
    name: "Gurgaon",
    parentName: "Haryana",
    type: "city",
    region: "Indian Cities",
    title: "Custom Software & AI Integration Services in Gurgaon | OfinIT",
    description: "OfinIT is Gurgaon's leading software development partner. Custom enterprise applications, DevOps consulting, and AI systems in Gurugram.",
    h1: "Custom Software & AI Automation Solutions in Gurgaon",
    h2: "Scale corporate productivity with high-performance software builds in Gurugram",
    latitude: 28.4595,
    longitude: 77.0266,
    introText: "Serving businesses in Gurugram's corporate offices. We specialize in building secure cloud backends, API-first integrations, and data systems to replace manual Excel sheets.",
    keywords: ["software development company Gurgaon", "AI integration Gurgaon", "web developers Gurugram", "custom software Gurgaon"]
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    parentName: "Telangana",
    type: "city",
    region: "Indian Cities",
    title: "Custom Software & Web Development Agency in Hyderabad | OfinIT",
    description: "Premier software development company in Hyderabad. Discover custom software, UI/UX design, mobile apps, and cloud engineering.",
    h1: "Enterprise Software & Cloud Engineering in Hyderabad",
    h2: "Dynamic web apps and secure local databases for Hyderabad tech ecosystems",
    latitude: 17.3850,
    longitude: 78.4867,
    introText: "Based near Hitec City, Hyderabad. We help SaaS scale-ups and established enterprises build clean components, version APIs, and setup CI/CD release trains.",
    keywords: ["software development Hyderabad", "web design company Hyderabad", "app developers Hyderabad", "DevOps consulting Hyderabad"]
  },
  {
    slug: "pune",
    name: "Pune",
    parentName: "Maharashtra",
    type: "city",
    region: "Indian Cities",
    title: "Custom Software & Mobile App Development Company in Pune | OfinIT",
    description: "Get custom software, React Native apps, Next.js web applications, and DevOps consulting in Pune. Engineered for performance and scale.",
    h1: "High-Performance Software & Product Engineering in Pune",
    h2: "Scaling product delivery for Pune's manufacturing and tech sectors",
    latitude: 18.5204,
    longitude: 73.8567,
    introText: "Pune is a thriving tech hub for software talent and engineering. We provide dedicated development teams, software design systems, and robust quality assurance setups.",
    keywords: ["software development company Pune", "web development Pune", "mobile app developer Pune", "IT company Pune"]
  },
  {
    slug: "chennai",
    name: "Chennai",
    parentName: "Tamil Nadu",
    type: "city",
    region: "Indian Cities",
    title: "Enterprise Software Development & AI Services in Chennai | OfinIT",
    description: "OfinIT is a trusted software engineering company in Chennai. Custom software development, Next.js web portals, and Cloud DevOps services.",
    h1: "Enterprise Software Engineering & Mobile Apps in Chennai",
    h2: "Reliable, security-first digital products engineered in Chennai",
    latitude: 13.0827,
    longitude: 80.2707,
    introText: "Chennai is a major economic engine. We design robust client-facing platforms, optimize Core Web Vitals for sites, and implement enterprise SSO/RBAC systems.",
    keywords: ["software development Chennai", "app development company Chennai", "web development Chennai", "DevOps services Chennai"]
  }
]

// Indian Major Cities Helper Dictionary for dynamic resolution
export const INDIAN_CITIES_DICT: { name: string; state: string; lat: number; lng: number }[] = [
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Guwahati", state: "Assam", lat: 26.1158, lng: 91.7086 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { name: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278 }
]

// Master dynamic lookup function
export function getLocationSEO(slug: string): LocationSEOData | null {
  // 1. Try static list
  const found = STATIC_LOCATIONS.find((loc) => loc.slug === slug)
  if (found) return found

  // 2. Try Indian Cities Dict
  const cityMatch = INDIAN_CITIES_DICT.find((c) => slugify(c.name) === slug)
  if (cityMatch) {
    return {
      slug,
      name: cityMatch.name,
      parentName: cityMatch.state,
      type: "city",
      region: "Indian Cities",
      title: `Custom Software & Web Development Company in ${cityMatch.name} | OfinIT`,
      description: `Premium software engineering, custom platforms, Next.js web applications, and AI integrations for businesses in ${cityMatch.name}, ${cityMatch.state}.`,
      h1: `Custom Software & Digital Product Engineering in ${cityMatch.name}`,
      h2: `Scaling local businesses in ${cityMatch.state} with expert development`,
      latitude: cityMatch.lat,
      longitude: cityMatch.lng,
      introText: `OfinIT provides businesses in ${cityMatch.name} with premium software engineering teams. We specialize in building secure customer portals, optimizing web applications for Core Web Vitals, and implementing automated DevOps pipelines to support scalable local workflows.`,
      keywords: [
        `software development company ${cityMatch.name.toLowerCase()}`,
        `web developers ${cityMatch.name.toLowerCase()}`,
        `app development ${cityMatch.name.toLowerCase()}`,
        `IT services ${cityMatch.name.toLowerCase()}`
      ]
    }
  }

  // 3. Try Indian States from country-states.ts
  const stateMatch = INDIA_GST_STATES.find((s) => slugify(s.name) === slug)
  if (stateMatch) {
    // Default coordinates based on generic region or center coordinates
    return {
      slug,
      name: stateMatch.name,
      parentName: "India",
      type: "state",
      region: "Indian States",
      title: `Custom Software & AI Development in ${stateMatch.name} | OfinIT`,
      description: `Enterprise software development, cloud infrastructure, and AI integration services across ${stateMatch.name}, India.`,
      h1: `Custom Software & Cloud Engineering Services in ${stateMatch.name}`,
      h2: `Empowering enterprises and startups across ${stateMatch.name} with reliable IT solutions`,
      latitude: 20.5937,
      longitude: 78.9629,
      introText: `We partner with enterprises and high-growth businesses throughout the state of ${stateMatch.name}. Our developers build custom applications, design modern UI/UX systems, and provide reliable support and cloud architecture setup.`,
      keywords: [
        `software development ${stateMatch.name.toLowerCase()}`,
        `custom software ${stateMatch.name.toLowerCase()}`,
        `DevOps services ${stateMatch.name.toLowerCase()}`,
        `web development ${stateMatch.name.toLowerCase()}`
      ]
    }
  }

  return null
}

// Helper to get ALL location slugs for pre-rendering
export function getAllLocationSlugs(): string[] {
  const staticSlugs = STATIC_LOCATIONS.map((l) => l.slug)
  const citySlugs = INDIAN_CITIES_DICT.map((c) => slugify(c.name))
  const stateSlugs = INDIA_GST_STATES.map((s) => slugify(s.name))
  
  // Return unique list
  return Array.from(new Set([...staticSlugs, ...citySlugs, ...stateSlugs]))
}

// Get grouped locations for the directory index page
export function getGroupedLocations() {
  const allSlugs = getAllLocationSlugs()
  const resolved = allSlugs.map((s) => getLocationSEO(s)).filter(Boolean) as LocationSEOData[]

  return {
    international: resolved.filter((r) => r.region === "International"),
    states: resolved.filter((r) => r.region === "Indian States"),
    cities: resolved.filter((r) => r.region === "Indian Cities")
  }
}
