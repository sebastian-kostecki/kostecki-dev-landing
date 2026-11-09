import { createRenderer, ssrContextKey } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { routes } from '@/router/routes'

// Minimal no-op DOM so the client-side setup path (watchers included) runs in node.
const { createApp } = createRenderer<object, object>({
  patchProp: () => {},
  insert: () => {},
  remove: () => {},
  createElement: () => ({}),
  createText: () => ({}),
  createComment: () => ({}),
  setText: () => {},
  setElementText: () => {},
  parentNode: () => null,
  nextSibling: () => null,
})

describe('App before the initial navigation resolves', () => {
  it('mounts without errors while the route has no name yet', () => {
    const errors: unknown[] = []
    const app = createApp(App)
    app.config.errorHandler = (err) => {
      errors.push(err)
    }
    // vitest compiles SFCs in SSR mode, which expects an ssr context to register modules in.
    app.provide(ssrContextKey, {})
    app.use(createRouter({ history: createMemoryHistory(), routes }))

    app.mount({})

    expect(errors).toEqual([])
  })
})
