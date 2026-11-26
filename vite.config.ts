import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { umamiScriptTag } from './scripts/lib/umami.mjs'

// Adds the Umami tracker to the built index.html (and so to every prerendered page) when
// UMAMI_WEBSITE_ID is set. Never in dev: /u/script.js exists only behind Traefik in production.
function umami(): Plugin {
  return {
    name: 'kostecki:umami',
    apply: 'build',
    transformIndexHtml() {
      const tag = umamiScriptTag(process.env.UMAMI_WEBSITE_ID)
      if (!tag) {
        console.warn('umami: UMAMI_WEBSITE_ID is not set, this build has no analytics tracker')
        return []
      }
      return [tag]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    vue(),
    umami(),
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
