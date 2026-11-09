import { addCollection, type IconifyJSON } from '@iconify/vue'
import collections from './generated/icons.json'

// Icons are bundled (scripts/build-icons.mjs -> src/generated/icons.json), so
// @iconify/vue never fetches them from api.iconify.design.
export function registerIcons(): void {
  for (const collection of collections as unknown as IconifyJSON[]) {
    if (!addCollection(collection)) {
      throw new Error(`Cannot register icon collection "${collection.prefix}"`)
    }
  }
}
