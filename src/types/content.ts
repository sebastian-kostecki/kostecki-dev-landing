export interface NavItem {
  to: string
  label: string
  index: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface SkillItem {
  name: string
  icon?: string
  image?: string
  level?: string
}

export interface SkillCategory {
  name: string
  items: SkillItem[]
}

export interface ProjectLink {
  title: string
  url: string
  primary?: boolean
}

export interface Project {
  title: string
  subtitle: string
  image: string | null
  placeholderIndex?: number
  badge?: 'wip'
  tags: string[]
  links: ProjectLink[]
}

export interface CommercialWorkContext {
  employer: string
  role: string
  period: string
}

export interface FeaturedProject {
  eyebrow: string
  title: string
  context: CommercialWorkContext
  description: string
  contributionTitle: string
  responsibilities: string[]
  tags: string[]
  link?: ProjectLink
}

export interface CommercialProjectItem {
  title: string
  description: string
}

export interface CommercialProjectGroup {
  eyebrow: string
  title: string
  context: CommercialWorkContext
  description: string
  authorship: string
  compactLabel: string
  tags: string[]
  items: CommercialProjectItem[]
}

export interface PersonalProjects {
  index: string
  title: string
  subtitle: string
  items: Project[]
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'linkedin' | 'github'
  label: string
  value: string
  href: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface RouteMetaCopy {
  title: string
  description: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    lang: string
  }
  routes: {
    home: RouteMetaCopy
    projects: RouteMetaCopy
    skills: RouteMetaCopy
    contact: RouteMetaCopy
    notFound: RouteMetaCopy
  }
  ui: {
    skipToContent: string
    languageLabel: string
    downloadCv: string
    expand: string
    collapse: string
    homeLabel: string
    navLabel: string
    projectCardLabel: string
    wipBadge: string
    projectScreenshotAlt: string
    openMenu: string
    closeMenu: string
    seeAllProjects: string
    exploreAllSkills: string
    viewMyWork: string
    liveDemo: string
    sourceCode: string
    backHome: string
    notFoundTitle: string
    notFoundBody: string
    brandName: string
    footerTagline: string
    footerStack: string
  }
  nav: NavItem[]
  hero: {
    label: string
    name: string
    valueProp: string
    valuePropAccent: string
    subtitle?: string
    ctaPrimary: CtaLink
  }
  cv: {
    href: string
  }
  about: {
    index: string
    title: string
    paragraphs: string[]
  }
  skills: {
    index: string
    title: string
    subtitle: string
    coreTitle: string
    coreDescription: string
    core: SkillItem[]
    categories: SkillCategory[]
  }
  projects: {
    homePreview: {
      index: string
      title: string
      subtitle: string
    }
    index: string
    title: string
    subtitle: string
    featured: FeaturedProject
    commercialGroup: CommercialProjectGroup
    personal: PersonalProjects
  }
  contact: {
    index: string
    title: string
    subtitle: string
    methods: ContactMethod[]
    ctaHeadline: string
  }
  footer: {
    servicesTitle: string
    services: string[]
    mediaTitle: string
    social: SocialLink[]
    copyright: string
  }
}
