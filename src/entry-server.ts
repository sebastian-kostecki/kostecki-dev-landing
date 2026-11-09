import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import App from '@/App.vue'
import { routes } from '@/router/routes'
import { useContent } from '@/composables/useContent'
import { pageMeta, type PageMeta } from '@/seo/page-meta'

export { staticPaths, staticRoutes } from '@/router/routes'
export { escapeText, injectPage } from '@/seo/html-template'
export { buildSitemap } from '@/seo/sitemap'
export { buildJsonLd } from '@/seo/structured-data'
export { buildLlmsTxt } from '@/seo/llms'
export { dictionaries } from '@/composables/useContent'

export async function render(
  path: string,
): Promise<{ html: string; routeName: string; meta: PageMeta }> {
  const app = createSSRApp(App)
  const router = createRouter({ history: createMemoryHistory(), routes })
  app.use(router)

  const failure = await router.push(path)
  if (failure) throw new Error(`render(${path}): navigation failed`, { cause: failure })
  await router.isReady()

  const name = router.currentRoute.value.name
  if (name === undefined) throw new Error(`render(${path}): path matched no named route`)
  const routeName = String(name)
  const html = await renderToString(app)
  const meta = pageMeta(routeName, useContent().value, path)

  return { html, routeName, meta }
}
