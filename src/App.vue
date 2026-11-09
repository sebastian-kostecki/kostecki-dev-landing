<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'
import { pageMeta } from '@/seo/page-meta'

const content = useContent()
const { locale } = useLocale()
const route = useRoute()

function setMetaContent(selector: string, value: string) {
  const element = document.querySelector(selector)
  if (element) element.setAttribute('content', value)
}

function upsertHeadElement(selector: string, create: () => HTMLElement): HTMLElement {
  const existing = document.querySelector<HTMLElement>(selector)
  if (existing) return existing
  const element = create()
  document.head.appendChild(element)
  return element
}

function applyCanonical(canonical: string | null) {
  if (canonical === null) {
    document.querySelector('link[rel="canonical"]')?.removeAttribute('href')
    document.querySelector('meta[property="og:url"]')?.removeAttribute('content')
    upsertHeadElement('meta[name="robots"]', () => {
      const robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      return robots
    }).setAttribute('content', 'noindex')
    return
  }

  upsertHeadElement('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    return link
  }).setAttribute('href', canonical)

  upsertHeadElement('meta[property="og:url"]', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:url')
    return meta
  }).setAttribute('content', canonical)

  document.querySelector('meta[name="robots"]')?.remove()
}

const meta = computed(() => pageMeta(String(route.name ?? ''), content.value, route.path))

function applyMeta() {
  // The initial navigation is async: until it resolves the route has no name and
  // pageMeta would fall back to home, overwriting the prerendered head.
  if (route.name === undefined) return

  const { title, description, lang, ogLocale, ogLocaleAlternate, canonical } = meta.value

  document.title = title
  document.documentElement.lang = lang
  setMetaContent('meta[name="description"]', description)
  setMetaContent('meta[property="og:title"]', title)
  setMetaContent('meta[property="og:description"]', description)
  setMetaContent('meta[property="og:locale"]', ogLocale)
  setMetaContent('meta[property="og:locale:alternate"]', ogLocaleAlternate)
  setMetaContent('meta[name="twitter:title"]', title)
  setMetaContent('meta[name="twitter:description"]', description)
  applyCanonical(canonical)
}

onMounted(applyMeta)
watch([locale, meta], applyMeta)
</script>

<template>
  <a href="#main-content" class="skip-link">{{ content.ui.skipToContent }}</a>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main id="main-content" class="flex-1">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
