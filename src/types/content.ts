export interface NavItem {
  id: string
  label: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface SkillItem {
  name: string
  icon?: string
  image?: string
}

export interface SkillGroup {
  description: string
  items: SkillItem[]
  layout?: 'icons' | 'tags' | 'compact'
}

export interface ExperienceEntry {
  company: string
  companyUrl?: string
  logo?: string
  role: string
  period: string
  project?: string
  projectUrl?: string
  summary: string
  highlights?: string[]
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
  links: ProjectLink[]
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

export interface SiteContent {
  meta: {
    title: string
    description: string
    lang: string
  }
  nav: NavItem[]
  hero: {
    name: string
    tagline: string
    subtitle?: string
    ctaPrimary: CtaLink
    ctaSecondary: CtaLink
  }
  about: {
    title: string
    paragraphs: string[]
  }
  experience: {
    title: string
    entries: ExperienceEntry[]
  }
  skills: {
    title: string
    groups: SkillGroup[]
  }
  projects: {
    title: string
    items: Project[]
  }
  contact: {
    title: string
    subtitle: string
    methods: ContactMethod[]
    ctaHeadline: string
    ctaPrimary: CtaLink
    ctaSecondary: CtaLink
  }
  footer: {
    servicesTitle: string
    services: string[]
    mediaTitle: string
    social: SocialLink[]
    copyright: string
  }
}
