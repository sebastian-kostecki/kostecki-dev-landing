// Runs scripts/fetch-archive-count.mjs against a local fake GitHub API that always fails,
// so the fallback decision is tested end to end without network.
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const SCRIPT = fileURLToPath(new URL('../fetch-archive-count.mjs', import.meta.url))
const OUTPUT = fileURLToPath(new URL('../../src/generated/archive.json', import.meta.url))

let server: Server
let api: string

beforeAll(async () => {
  server = createServer((_req, res) => {
    res.writeHead(503, { 'Content-Type': 'text/plain' })
    res.end('fake outage')
  })
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
  api = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => new Promise<void>((done) => server.close(() => done())))

function run(env: Record<string, string>): Promise<{ code: number | null; stderr: string }> {
  return new Promise((done, fail) => {
    const { ARCHIVE_STRICT: _inherited, GITHUB_TOKEN: _token, ...base } = process.env
    const child = spawn(process.execPath, [SCRIPT], {
      env: { ...base, ARCHIVE_GITHUB_API: api, ...env },
      stdio: ['ignore', 'ignore', 'pipe'],
    })
    let stderr = ''
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('error', fail)
    child.on('close', (code) => done({ code, stderr }))
  })
}

const readOutput = () => readFile(OUTPUT, 'utf8').catch(() => null)

describe('fetch-archive-count.mjs when GitHub fails', () => {
  it('falls back and exits 0 by default (local builds keep working offline)', async () => {
    const { code, stderr } = await run({})
    expect(code).toBe(0)
    expect(stderr).toMatch(/fetch failed/)
    expect(stderr).toMatch(/503/)
  })

  it('exits 1 without touching the result when ARCHIVE_STRICT=1', async () => {
    const before = await readOutput()
    const { code, stderr } = await run({ ARCHIVE_STRICT: '1' })
    expect(code).toBe(1)
    expect(stderr).toMatch(/ARCHIVE_STRICT/)
    expect(stderr).toMatch(/503/)
    expect(await readOutput()).toBe(before)
  })
})
