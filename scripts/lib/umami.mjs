// Umami (cookieless analytics, self-hosted in kostecki-dev-infra, docs/umami.md). The tracker is
// served from this origin under /u/ (Traefik routes /u/script.js and /u/api/send to Umami), so the
// CSP stays script-src/connect-src 'self'. The website ID comes from the build environment
// (UMAMI_WEBSITE_ID, a GitHub Actions variable): without it the build has no tracker.

export const UMAMI_SCRIPT_SRC = '/u/script.js'
export const UMAMI_DOMAINS = 'kostecki.dev'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * The tracker <script> for Vite's transformIndexHtml, or null when no website ID is set.
 * A set but malformed ID throws: a typo must fail the build, not ship a tracker that counts nothing.
 *
 * @param {string | undefined} websiteId
 * @returns {{ tag: 'script', attrs: Record<string, string | boolean>, injectTo: 'head' } | null}
 */
export function umamiScriptTag(websiteId) {
  const id = websiteId?.trim()
  if (!id) return null
  if (!UUID.test(id)) {
    throw new Error(`UMAMI_WEBSITE_ID must be the Umami website UUID, got "${id}"`)
  }
  return {
    tag: 'script',
    attrs: {
      defer: true,
      src: UMAMI_SCRIPT_SRC,
      'data-website-id': id.toLowerCase(),
      // The tracker stays silent on localhost, previews and any other host.
      'data-domains': UMAMI_DOMAINS,
    },
    injectTo: 'head',
  }
}
