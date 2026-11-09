// Counts the folders in context/archive of both public repos and writes
// src/generated/archive.json, which the AI workflow section reads. Also checks that
// every archive folder linked in src/content/{pl,en}.json still exists.
//
// Fallback order when the fetch fails: existing src/generated/archive.json, then a
// copy of the tracked src/generated/archive.fallback.json, then exit 1. Every fallback
// warns with the original error. A content error (bad URL, PL/EN mismatch, missing
// folder) is never a fallback case: it exits 1.
// GITHUB_TOKEN is optional. ARCHIVE_GITHUB_API overrides the API base (offline tests).

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ARCHIVE_REPOS,
  assertSameSelection,
  countArchiveFolders,
  missingFolders,
  parseArchiveResult,
  selectedArchiveFolders,
} from './lib/archive-count.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'src/generated/archive.json')
const FALLBACK = resolve(ROOT, 'src/generated/archive.fallback.json')
const API = process.env.ARCHIVE_GITHUB_API ?? 'https://api.github.com'
const TOKEN = process.env.GITHUB_TOKEN

async function github(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'kostecki-dev-build' }
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`
  const response = await fetch(`${API}${path}`, { headers, signal: AbortSignal.timeout(15000) })
  if (!response.ok) {
    const body = await response
      .text()
      .then((text) => text.slice(0, 200))
      .catch((error) => `<body unreadable: ${error.message}>`)
    const remaining = response.headers.get('x-ratelimit-remaining')
    const reset = response.headers.get('x-ratelimit-reset')
    throw new Error(
      `GitHub ${path} answered ${response.status} ${response.statusText}: ${body} (rate limit remaining=${remaining}, reset=${reset})`,
    )
  }
  return response
}

/**
 * Reads and validates a previous result. A missing file is normal (null); an unreadable or invalid
 * one is warned about with its cause and skipped, so the fallback chain continues.
 */
async function readResult(path, label) {
  let text
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') console.warn(`[archive] cannot read the ${label}, skipping it`, error)
    return null
  }
  try {
    return parseArchiveResult(text)
  } catch (error) {
    console.warn(`[archive] the ${label} is invalid, skipping it`, error)
    return null
  }
}

/** Writes through a temp file and a rename, so an interrupted build never leaves a truncated result. */
async function writeResult(result) {
  await mkdir(dirname(OUTPUT), { recursive: true })
  const temp = `${OUTPUT}.tmp`
  await writeFile(temp, `${JSON.stringify(result, null, 2)}\n`)
  await rename(temp, OUTPUT)
}

async function readLocale(name) {
  return JSON.parse(await readFile(resolve(ROOT, `src/content/${name}.json`), 'utf8'))
}

/** Lists both archives. All or nothing: one failing repo fails the whole fetch. */
async function fetchListings() {
  const entries = await Promise.all(
    ARCHIVE_REPOS.map(async (repo) => {
      const response = await github(`/repos/${repo}/contents/context/archive`)
      return [repo, await response.json()]
    }),
  )
  return Object.fromEntries(entries)
}

// Content errors must stop the build, so this runs outside the fetch try/catch.
let selected
try {
  const pl = selectedArchiveFolders(await readLocale('pl'))
  const en = selectedArchiveFolders(await readLocale('en'))
  assertSameSelection(pl, en)
  selected = pl
} catch (error) {
  console.error('[archive] invalid archive links in src/content', error)
  process.exit(1)
}

let listings = null
try {
  listings = await fetchListings()
} catch (error) {
  const existing = await readResult(OUTPUT, 'existing result')
  if (existing) {
    console.warn(
      `[archive] fetch failed, keeping the existing result from ${existing.generatedAt}; link guard skipped`,
      error,
    )
    process.exit(0)
  }
  const fallback = await readResult(FALLBACK, 'tracked fallback')
  if (fallback) {
    await writeResult(fallback)
    console.warn(
      `[archive] fetch failed, using the tracked fallback from ${fallback.generatedAt}; link guard skipped`,
      error,
    )
    process.exit(0)
  }
  console.error('[archive] fetch failed and there is no result or fallback to use', error)
  process.exit(1)
}

try {
  // Counting first validates the response shape, so a non-array body gets the descriptive error.
  const repos = ARCHIVE_REPOS.map((repo) => ({ repo, count: countArchiveFolders(listings[repo]) }))
  const missing = missingFolders(selected, listings)
  if (missing.length) {
    const names = missing.map(({ repo, folder }) => `${repo}/context/archive/${folder}`)
    throw new Error(`Linked archive folder(s) not found: ${names.join(', ')}`)
  }
  const total = repos.reduce((sum, { count }) => sum + count, 0)
  const result = { generatedAt: new Date().toISOString(), total, repos }
  await writeResult(result)
  console.info(`[archive] wrote ${total} archived changes to ${OUTPUT}`)
} catch (error) {
  console.error('[archive] archive check failed', error)
  process.exit(1)
}
