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
  description: string
  tags: string[]
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
  imageAlt?: string
  placeholderIndex?: number
  badge?: 'wip'
  /** Featured projects render as a wide card with a screenshot and highlights. */
  featured?: boolean
  highlights?: string[]
  /** Short note shown next to the links, e.g. that the repository is private. */
  note?: string
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
  secondaryLink?: ProjectLink
}

export interface AiWorkflowStep {
  title: string
  body: string
  link?: ProjectLink
}

export interface AiProofItem {
  project: string
  url: string
  shows: string
}

export interface AiProof {
  lead: string
  items: AiProofItem[]
  counterLabel: string
  archiveLinks: ProjectLink[]
}

export interface AiWorkflow {
  index: string
  title: string
  subtitle: string
  proof: AiProof
  steps: AiWorkflowStep[]
  closing: string
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

export interface SummaryItem {
  label: string
  value: string
  /** Wiersz z linkiem jest pomijany na `/cv` (`CvView` filtruje `!item.href`; kontakt pokazuje osobno). */
  href?: string
}

export interface RouteMetaCopy {
  title: string
  description: string
}

export interface CvCopy {
  title: string
  intro: string
  print: string
  printHint: string
  summaryTitle: string
  experienceTitle: string
  productsTitle: string
  skillsTitle: string
  generated: string
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
    cv: RouteMetaCopy
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
    liveDemo: string
    sourceCode: string
    siteSource: string
    photoPlaceholder: string
    featuredProjectLabel: string
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
  summary: {
    title: string
    items: SummaryItem[]
  }
  cv: {
    href: string
  } & CvCopy
  about: {
    index: string
    title: string
    paragraphs: string[]
  }
  aiWorkflow: AiWorkflow
  skills: {
    index: string
    title: string
    subtitle: string
    coreTitle: string
    coreDescription: string
    competenciesLabel: string
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
    openSource: FeaturedProject
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
