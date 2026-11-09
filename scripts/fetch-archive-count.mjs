// Counts the folders in context/archive of both public repos and writes
// src/generated/archive.json, which the AI workflow section reads. Also checks that
// every archive folder linked in src/content/{pl,en}.json still exists.
//
// Fallback order when the fetch fails: existing src/generated/archive.json, then a
// copy of the tracked src/generated/archive.fallback.json, then exit 1. Every fallback
// warns with the original error. A content error (bad URL, PL/EN mismatch, missing
// folder) is never a fallback case: it exits 1.
// GITHUB_TOKEN is optional. ARCHIVE_GITHUB_API overrides the API base (offline tests).

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ARCHIVE_REPOS,
  assertSameSelection,
  countArchiveFolders,
  missingFolders,
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
    throw new Error(`GitHub ${path} answered ${response.status} ${response.statusText}`)
  }
  return response
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
  const existing = await readFile(OUTPUT, 'utf8').catch(() => null)
  if (existing) {
    console.warn(
      `[archive] fetch failed, keeping the existing result from ${JSON.parse(existing).generatedAt}; link guard skipped`,
      error,
    )
    process.exit(0)
  }
  const fallback = await readFile(FALLBACK, 'utf8').catch(() => null)
  if (fallback) {
    await mkdir(dirname(OUTPUT), { recursive: true })
    await copyFile(FALLBACK, OUTPUT)
    console.warn(
      `[archive] fetch failed, using the tracked fallback from ${JSON.parse(fallback).generatedAt}; link guard skipped`,
      error,
    )
    process.exit(0)
  }
  console.error('[archive] fetch failed and there is no result or fallback to use', error)
  process.exit(1)
}

try {
  const missing = missingFolders(selected, listings)
  if (missing.length) {
    const names = missing.map(({ repo, folder }) => `${repo}/context/archive/${folder}`)
    throw new Error(`Linked archive folder(s) not found: ${names.join(', ')}`)
  }
  const repos = ARCHIVE_REPOS.map((repo) => ({ repo, count: countArchiveFolders(listings[repo]) }))
  const total = repos.reduce((sum, { count }) => sum + count, 0)
  const result = { generatedAt: new Date().toISOString(), total, repos }
  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify(result, null, 2)}\n`)
  console.info(`[archive] wrote ${total} archived changes to ${OUTPUT}`)
} catch (error) {
  console.error('[archive] archive check failed', error)
  process.exit(1)
}
