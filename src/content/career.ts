// Start dates behind the durations shown on the site ("4 lata", "3,5 roku").
// Durations are computed from these, so the copy does not go stale (audit A6).
export const careerSince = {
  modulesGarden: '2022-07',
  panelAlpha: '2022-11',
} as const

export type CareerKey = keyof typeof careerSince

// Current organisation for JSON-LD `worksFor`. ModulesGarden and PanelAlpha are two projects of
// the same employer; LinkedIn and the GitHub profile list the current role under PanelAlpha.
export const employer = {
  name: 'PanelAlpha',
  url: 'https://panelalpha.com',
} as const
