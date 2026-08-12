import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'public', 'og-image.png')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="#141416" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <rect x="120" y="215" width="160" height="160" rx="16" fill="rgba(230,57,70,0.1)" stroke="rgba(230,57,70,0.4)" stroke-width="3"/>
  <path
    d="M175 255 L145 295 L175 335 M185 335 L215 255 M225 255 L255 295 L225 335"
    fill="none"
    stroke="#e63946"
    stroke-width="10"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <text x="340" y="280" fill="#ffffff" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="64" font-weight="800">Sebastian Kostecki</text>
  <text x="340" y="360" fill="#a1a1aa" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="36" font-weight="500">Backend Developer · PHP · Laravel</text>
  <text x="340" y="430" fill="#e63946" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="28" font-weight="600">kostecki.dev</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log('Generated public/og-image.png')
