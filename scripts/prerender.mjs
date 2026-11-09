import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')
const NOT_FOUND_PATH = '/__not-found__'
const APP_PLACEHOLDER = '<div id="app"></div>'

function targetFile(routePath) {
  return routePath === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, ...routePath.split('/').filter(Boolean), 'index.html')
}

function escapeText(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function run() {
  const { render, injectPage, staticRoutes, dictionaries } = await import(
    pathToFileURL(ssrEntry).href
  )

  const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
  const placeholderCount = template.split(APP_PLACEHOLDER).length - 1
  if (placeholderCount !== 1) {
    throw new Error(
      `dist/index.html must contain the ${APP_PLACEHOLDER} placeholder exactly once, found ${placeholderCount} (already prerendered? run the client build first)`,
    )
  }

  const pl = dictionaries.pl
  const written = []

  for (const { path: routePath, name } of staticRoutes) {
    const { html, meta } = await render(routePath)
    const file = targetFile(routePath)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, injectPage(template, { appHtml: html, meta }))
    written.push({ file, expectedTitle: pl.routes[name].title, routePath })
  }

  const notFound = await render(NOT_FOUND_PATH)
  const notFoundFile = path.join(distDir, '404.html')
  await writeFile(
    notFoundFile,
    injectPage(template, { appHtml: notFound.html, meta: notFound.meta, noindex: true }),
  )
  written.push({ file: notFoundFile, expectedTitle: pl.routes.notFound.title, routePath: '404' })

  for (const { file, expectedTitle, routePath } of written) {
    const content = await readFile(file, 'utf8')
    if (!content.includes(`<title>${escapeText(expectedTitle)}</title>`)) {
      throw new Error(`${routePath}: ${path.relative(root, file)} lacks <title>${expectedTitle}</title>`)
    }
    if (content.includes(APP_PLACEHOLDER) || !/<div id="app">\s*\S/.test(content)) {
      throw new Error(`${routePath}: ${path.relative(root, file)} has an empty #app`)
    }
  }

  console.log('[prerender] wrote:')
  for (const { file } of written) console.log(`  ${path.relative(root, file)}`)
}

try {
  await run()
} catch (error) {
  console.error(`[prerender] failed: ${error instanceof Error ? error.message : String(error)}`)
  if (error instanceof Error && error.stack) console.error(error.stack)
  if (error instanceof Error && error.cause) console.error('Caused by:', error.cause)
  process.exit(1)
}
