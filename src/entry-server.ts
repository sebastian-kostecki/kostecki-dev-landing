import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import App from '@/App.vue'
import { routes } from '@/router/routes'
import { useContent } from '@/composables/useContent'
import { pageMeta, type PageMeta } from '@/seo/page-meta'

export { staticPaths, staticRoutes } from '@/router/routes'
export { dictionaries } from '@/composables/useContent'

export async function render(
  path: string,
): Promise<{ html: string; routeName: string; meta: PageMeta }> {
  const app = createSSRApp(App)
  const router = createRouter({ history: createMemoryHistory(), routes })
  app.use(router)

  await router.push(path)
  await router.isReady()

  const routeName = String(router.currentRoute.value.name ?? 'home')
  const html = await renderToString(app)
  const meta = pageMeta(routeName, useContent().value, path)

  return { html, routeName, meta }
}
