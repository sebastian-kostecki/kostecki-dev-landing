import { _api, addCollection, type IconifyJSON } from '@iconify/vue'
import collections from './generated/icons.json'

// Icons are bundled (scripts/build-icons.mjs -> src/generated/icons.json), so
// @iconify/vue never fetches them from api.iconify.design.
export function registerIcons(): void {
  for (const collection of collections as unknown as IconifyJSON[]) {
    if (!addCollection(collection)) {
      throw new Error(`Cannot register icon collection "${collection.prefix}"`)
    }
  }

  // An icon the build script did not bundle (e.g. a name built dynamically) must fail
  // loudly instead of calling @iconify/vue's default API; connect-src 'self' would
  // block that call and the icon would vanish without a trace.
  _api.setAPIModule('', {
    prepare: (provider, prefix, icons) => [{ type: 'icons', provider, prefix, icons }],
    send: (_host, params, callback) => {
      console.error('[icons] icon is not bundled, run `pnpm generate:icons`:', params)
      callback('abort', 424)
    },
  })
}
