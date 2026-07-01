export interface NavItem {
  id: string
  label: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface MetricItem {
  value: string
  label: string
}

export interface SkillItem {
  name: string
  icon?: string
  image?: string
}

export interface SkillCategory {
  name: string
  items: SkillItem[]
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
  ui: {
    skipToContent: string
    languageLabel: string
    downloadCv: string
    expand: string
    collapse: string
    homeLabel: string
    navLabel: string
  }
  nav: NavItem[]
  hero: {
    label: string
    name: string
    valueProp: string
    subtitle?: string
    metrics: MetricItem[]
    ctaPrimary: CtaLink
  }
  cv: {
    // Empty href => CV buttons are hidden (graceful handling until the file exists).
    href: string
  }
  about: {
    command: string
    title: string
    paragraphs: string[]
  }
  experience: {
    command: string
    title: string
    entries: ExperienceEntry[]
  }
  skills: {
    command: string
    title: string
    coreDescription: string
    core: SkillItem[]
    categories: SkillCategory[]
  }
  projects: {
    command: string
    title: string
    items: Project[]
  }
  contact: {
    command: string
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
