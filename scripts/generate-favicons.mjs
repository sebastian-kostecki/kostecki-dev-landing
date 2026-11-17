import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// ICO container with PNG images inside (supported by every current browser and by Windows
// since Vista): a 6-byte header, a 16-byte entry per image, then the PNG files as they are.
function pngsToIco(pngs, sizes) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  let offset = header.length + 16 * pngs.length
  const entries = pngs.map((png, i) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(sizes[i] % 256, 0) // width (0 means 256)
    entry.writeUInt8(sizes[i] % 256, 1) // height
    entry.writeUInt8(0, 2) // no palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...pngs])
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'favicon.svg')
const svg = await readFile(svgPath)

const png16 = await sharp(svg).resize(16, 16).png().toBuffer()
const png32 = await sharp(svg).resize(32, 32).png().toBuffer()
const png180 = await sharp(svg).resize(180, 180).png().toBuffer()

await writeFile(join(root, 'public', 'favicon.ico'), pngsToIco([png16, png32], [16, 32]))
await writeFile(join(root, 'public', 'apple-touch-icon.png'), png180)

console.log('Generated public/favicon.ico and public/apple-touch-icon.png')
