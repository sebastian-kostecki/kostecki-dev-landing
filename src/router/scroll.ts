import type { RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'

/** Id of the home page "Współpraca" section; `kostecki.dev/#wspolpraca` is shared publicly. */
export const COLLABORATION_ANCHOR = 'wspolpraca'

// A hash scrolls to its element (the section's own top padding clears the fixed header);
// every other navigation starts at the top of the page.
export const scrollBehavior = ((to: RouteLocationNormalized) =>
  to.hash ? { el: to.hash } : { top: 0 }) satisfies RouterScrollBehavior
