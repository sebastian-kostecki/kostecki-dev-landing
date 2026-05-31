import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'public', 'og-image.png')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="#141416" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <path d="M120 200 L280 430 M280 200 L120 430" fill="none" stroke="#e63946" stroke-width="12" stroke-linecap="round"/>
  <circle cx="200" cy="315" r="14" fill="#ffffff"/>
  <text x="340" y="280" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="800">Sebastian Kostecki</text>
  <text x="340" y="360" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="36" font-weight="500">Backend Developer · PHP · Laravel</text>
  <text x="340" y="430" fill="#e63946" font-family="system-ui, sans-serif" font-size="28" font-weight="600">kostecki.dev</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log('Generated public/og-image.png')
