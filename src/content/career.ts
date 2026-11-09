// Start dates behind the durations shown on the site ("4 lata", "3,5 roku").
// Durations are computed from these, so the copy does not go stale (audit A6).
export const careerSince = {
  modulesGarden: '2022-11',
  panelAlpha: '2023-05',
} as const

export type CareerKey = keyof typeof careerSince
