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
  icon: string
}

export interface SkillGroup {
  description: string
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
    ctaPrimary: CtaLink
    ctaSecondary: CtaLink
  }
  about: {
    title: string
    paragraphs: string[]
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
