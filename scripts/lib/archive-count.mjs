// Pure logic for scripts/fetch-archive-count.mjs: counting archive folders and
// guarding the archive links chosen in the page content. No I/O here.

/** Repositories whose `context/archive` folders are counted and linked. */
export const ARCHIVE_REPOS = [
  'sebastian-kostecki/root-keeper',
  'sebastian-kostecki/household-treasurer',
]

/**
 * @typedef {{ repo: string, folder: string }} SelectedFolder
 * @typedef {{ name: string, type: string }} ListingEntry
 */

const FOLDER_URL = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/tree\/main\/context\/archive\/([\w.-]+)$/

/**
 * Counts directory entries in a GitHub contents API listing (README.md and other files are ignored).
 * @param {unknown} listing parsed JSON response of `GET /repos/<repo>/contents/context/archive`
 * @returns {number}
 */
export function countArchiveFolders(listing) {
  if (!Array.isArray(listing)) {
    throw new Error(`Expected the archive listing to be an array, got ${typeof listing}`)
  }
  return listing.filter((entry) => entry?.type === 'dir').length
}

/**
 * Extracts the archive folders chosen in `aiWorkflow.proof.items[].url`.
 * @param {any} content parsed locale dictionary (pl.json or en.json)
 * @returns {SelectedFolder[]} empty when the content has no `proof`
 */
export function selectedArchiveFolders(content) {
  const items = content?.aiWorkflow?.proof?.items
  if (!items) return []
  return items.map((/** @type {{ url: string }} */ item) => {
    const match = FOLDER_URL.exec(item.url)
    if (!match) {
      throw new Error(
        `Proof URL is not an archive folder URL (https://github.com/<owner>/<repo>/tree/main/context/archive/<folder>): ${item.url}`,
      )
    }
    const repo = String(match[1])
    const folder = String(match[2])
    if (!ARCHIVE_REPOS.includes(repo)) {
      throw new Error(`Proof URL points to a repository outside the archive list: ${item.url}`)
    }
    return { repo, folder }
  })
}

/**
 * Returns the selected folders that are absent from their repository's listing.
 * @param {SelectedFolder[]} selected
 * @param {Record<string, ListingEntry[]>} listings archive listing per repository
 * @returns {SelectedFolder[]}
 */
export function missingFolders(selected, listings) {
  return selected.filter(
    ({ repo, folder }) =>
      !(listings[repo] ?? []).some((entry) => entry.type === 'dir' && entry.name === folder),
  )
}

/**
 * Throws when the PL and EN content select different archive folders (or order).
 * @param {SelectedFolder[]} pl
 * @param {SelectedFolder[]} en
 */
export function assertSameSelection(pl, en) {
  const key = (/** @type {SelectedFolder} */ item) => `${item.repo}/${item.folder}`
  const plKeys = pl.map(key)
  const enKeys = en.map(key)
  if (plKeys.length === enKeys.length && plKeys.every((value, i) => value === enKeys[i])) return
  throw new Error(
    `PL/EN mismatch in aiWorkflow.proof.items.\n  PL: ${plKeys.join(', ') || '(none)'}\n  EN: ${enKeys.join(', ') || '(none)'}`,
  )
}

/**
 * @typedef {{ generatedAt: string, total: number, repos: { repo: string, count: number }[] }} ArchiveResult
 */

/**
 * Parses and validates the text of `archive.json` / `archive.fallback.json`, so a truncated or
 * hand-edited file is rejected instead of reaching the page (e.g. as `NaN`).
 * @param {string} text file contents
 * @returns {ArchiveResult}
 */
export function parseArchiveResult(text) {
  const data = JSON.parse(text)
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Archive result is not a JSON object')
  }
  if (typeof data.generatedAt !== 'string') {
    throw new Error('Archive result has no string "generatedAt"')
  }
  if (typeof data.total !== 'number' || !Number.isFinite(data.total)) {
    throw new Error('Archive result has no finite numeric "total"')
  }
  if (!Array.isArray(data.repos)) {
    throw new Error('Archive result has no "repos" array')
  }
  return data
}
