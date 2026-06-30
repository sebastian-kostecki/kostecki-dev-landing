<script setup lang="ts">
import { computed } from 'vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useScrollPosition } from '@/composables/useScrollReveal'
import { useContent } from '@/composables/useContent'

const content = useContent()
const { scrollY } = useScrollPosition()

const isVisible = computed(() => scrollY.value > 80)
const hasCv = computed(() => content.value.cv.href.length > 0)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="[
      isVisible
        ? 'translate-y-0 border-b border-border bg-bg/80 opacity-100 backdrop-blur-lg'
        : '-translate-y-full opacity-0 pointer-events-none',
    ]"
    :aria-label="content.ui.navLabel"
  >
    <div class="container mx-auto flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
      <a
        href="#"
        class="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        :aria-label="content.ui.homeLabel"
      >
        <BrandMark :size="28" decorative />
      </a>

      <nav aria-label="Sekcje strony">
        <ul class="hidden items-center gap-6 md:flex">
          <li v-for="item in content.nav" :key="item.id">
            <a :href="`#${item.id}`" class="nav-link font-mono">{{ item.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <a
          v-if="hasCv"
          :href="content.cv.href"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary hidden text-xs md:inline-flex md:px-4 md:py-2"
        >
          {{ content.ui.downloadCv }}
        </a>
      </div>
    </div>
  </header>
</template>
