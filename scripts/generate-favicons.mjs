import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'favicon.svg')
const svg = await readFile(svgPath)

const png16 = await sharp(svg).resize(16, 16).png().toBuffer()
const png32 = await sharp(svg).resize(32, 32).png().toBuffer()
const png180 = await sharp(svg).resize(180, 180).png().toBuffer()

await writeFile(join(root, 'public', 'favicon.ico'), await toIco([png16, png32]))
await writeFile(join(root, 'public', 'apple-touch-icon.png'), png180)

console.log('Generated public/favicon.ico and public/apple-touch-icon.png')
