<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { useContent } from '@/composables/useContent'
import { useLocale } from '@/composables/useLocale'

const content = useContent()
const { locale } = useLocale()
const route = useRoute()

function setMetaContent(selector: string, value: string) {
  const element = document.querySelector(selector)
  if (element) element.setAttribute('content', value)
}

const routeMeta = computed(() => {
  const name = route.name
  if (name === 'projects') return content.value.routes.projects
  if (name === 'skills') return content.value.routes.skills
  if (name === 'contact') return content.value.routes.contact
  if (name === 'cv') return content.value.routes.cv
  if (name === 'not-found') return content.value.routes.notFound
  return content.value.routes.home
})

function applyMeta() {
  const { meta } = content.value
  const page = routeMeta.value
  const ogLocale = meta.lang === 'pl' ? 'pl_PL' : 'en_US'
  const title = page.title
  const description = page.description

  document.title = title
  document.documentElement.lang = meta.lang
  setMetaContent('meta[name="description"]', description)
  setMetaContent('meta[property="og:title"]', title)
  setMetaContent('meta[property="og:description"]', description)
  setMetaContent('meta[property="og:locale"]', ogLocale)
  setMetaContent('meta[name="twitter:title"]', title)
  setMetaContent('meta[name="twitter:description"]', description)
}

onMounted(applyMeta)
watch([locale, routeMeta], applyMeta)
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
