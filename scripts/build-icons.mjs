// Collects every "prefix:name" icon referenced in src/ and writes only those icons to
// src/generated/icons.json (committed; src/icons.ts registers them at startup).
// Logic lives in scripts/lib/icons.mjs. Any error exits 1 with its cause.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIconCollections, collectIconNames } from './lib/icons.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'src/generated/icons.json')

try {
  const names = await collectIconNames(resolve(ROOT, 'src'))
  const collections = await buildIconCollections(names, ROOT)
  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify(collections)}\n`)
  console.info(
    `[icons] wrote ${collections.map((c) => `${c.prefix} (${Object.keys(c.icons).length})`).join(', ')}`,
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  if (error instanceof Error && error.cause) console.error('Caused by:', error.cause)
  process.exit(1)
}
