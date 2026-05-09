import type { PublicSiteContent } from "./types"

export function getDefaultSiteContent(): PublicSiteContent {
  return {
    header: {
      logoAngleOpen: "<",
      logoText: "OfinIT",
      logoAngleClose: "/>",
      navLinks: [
        { label: "Services", href: "/#services" },
        { label: "Why Us", href: "/#features" },
        { label: "About", href: "/#about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/#contact" },
      ],
      ctaLabel: "Get Started",
      ctaHref: "/#contact",
    },
    footer: {
      description:
        "Your trusted partner for digital transformation. We deliver cutting-edge web, mobile, and AI solutions that drive business growth. With a team of expert developers, designers, and DevOps engineers, we transform complex challenges into elegant, scalable solutions. From startups to enterprises, we've helped businesses worldwide achieve their digital ambitions.",
      socialGithub: "#",
      socialLinkedin: "#",
      socialTwitter: "#",
      servicesHeading: "Services",
      servicesLinks: [
        { label: "UI/UX Design", href: "#" },
        { label: "Web Development", href: "#" },
        { label: "Software Development", href: "#" },
        { label: "Mobile App Development", href: "#" },
        { label: "AI Integration", href: "#" },
        { label: "DevOps", href: "#" },
      ],
      companyHeading: "Company",
      companyLinks: [
        { label: "About Us", href: "/#about" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "/#contact" },
      ],
      policiesHeading: "Policies",
      policiesLinks: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cancel & Refund Policy", href: "/cancel-refund-policy" },
        { label: "Cookie Policy", href: "#" },
      ],
      contactHeading: "Contact",
      contactEmail: "info@ofinit.com",
      contactPhone: "+1 (234) 567-890",
      contactAddressLine1: "123 Tech Street",
      contactAddressLine2: "San Francisco, CA 94105",
    },
    hero: {
      badge: "Building the Future of Technology",
      headingBefore: "Transform Your Business with ",
      headingAccent: "Cutting-Edge",
      headingAfter: " Solutions",
      subheading:
        "We engineer digital excellence. Beautiful interfaces, intelligent systems, and scalable infrastructure that propel your business forward.",
      primaryCtaLabel: "Start Your Project",
      primaryCtaHref: "/#contact",
      secondaryCtaLabel: "View Our Work",
      secondaryCtaHref: "/case-studies",
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive technology solutions to power your digital transformation",
      items: [
        {
          icon: "Palette",
          title: "UI/UX Design",
          description:
            "Beautiful, intuitive interfaces designed with user experience at the forefront. From wireframes to high-fidelity prototypes.",
        },
        {
          icon: "Globe",
          title: "Web Development",
          description:
            "Custom websites and web applications built with modern frameworks and best practices for optimal performance.",
        },
        {
          icon: "Code",
          title: "Software Development",
          description: "Enterprise-grade software solutions tailored to your business needs with scalable architecture.",
        },
        {
          icon: "Smartphone",
          title: "Mobile App Development",
          description:
            "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
        },
        {
          icon: "Brain",
          title: "AI Integration",
          description:
            "Leverage artificial intelligence and machine learning to automate processes and gain valuable insights.",
        },
        {
          icon: "Server",
          title: "DevOps Services",
          description: "Streamline your deployment pipeline with CI/CD, cloud infrastructure, and monitoring solutions.",
        },
      ],
    },
    features: {
      title: "Why Choose OfinIT?",
      body: `We combine technical expertise with business acumen to deliver solutions that drive real results. Our team of experienced developers, designers, and DevOps engineers work together to bring your vision to life. With a proven track record of successful projects across various industries, we understand the unique challenges businesses face in their digital transformation journey.`,
      imageSrc: "/professional-team-collaborating-on-software-develo.jpg",
      imageAlt: "Professional team working on software development",
      bullets: [
        "Agile development methodology",
        "Scalable cloud architecture",
        "Modern tech stack",
        "24/7 support & maintenance",
        "Security-first approach",
        "Performance optimization",
        "Dedicated project managers",
        "Transparent communication",
        "On-time delivery guarantee",
        "Post-launch support",
        "Cost-effective solutions",
        "Industry best practices",
      ],
    },
    about: {
      title: "About OfinIT Solutions",
      subtitle: "Transforming ideas into powerful digital solutions since 2014",
      whoTitle: "Who We Are",
      whoParagraphs: [
        "OfinIT Solutions Pvt. Ltd. is a leading technology company specializing in creating innovative digital solutions for businesses worldwide. We combine cutting-edge technology with creative design to deliver exceptional results.",
        "Our team of experienced developers, designers, and strategists work collaboratively to bring your vision to life. From initial concept to final deployment, we ensure every project exceeds expectations.",
        "We pride ourselves on staying ahead of technology trends, ensuring our clients benefit from the latest innovations in web development, mobile apps, AI integration, and cloud infrastructure.",
      ],
      missionTitle: "Our Mission",
      missionText:
        "To empower businesses with innovative technology solutions that drive growth, enhance efficiency, and create lasting value. We believe in building long-term partnerships based on trust, quality, and exceptional service.",
      visionTitle: "Our Vision",
      visionText:
        "To be the most trusted technology partner for businesses seeking digital transformation. We envision a future where technology seamlessly integrates with business operations, enabling unprecedented growth and innovation.",
      stats: [
        { icon: "Users", label: "Expert Team", value: "50+" },
        { icon: "Target", label: "Projects Delivered", value: "200+" },
        { icon: "Award", label: "Years Experience", value: "10+" },
        { icon: "Zap", label: "Client Satisfaction", value: "98%" },
      ],
    },
    cta: {
      title: "Ready to Build Something Amazing?",
      body: "Let's discuss your project and explore how our expertise can help you achieve your goals. Get in touch with our team today for a free consultation.",
      primaryLabel: "Schedule a Call",
      primaryHref: "/#contact",
      secondaryLabel: "View Case Studies",
      secondaryHref: "/case-studies",
    },
  }
}
