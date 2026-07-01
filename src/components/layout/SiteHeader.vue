<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Menu, X } from '@lucide/vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useScrollPosition } from '@/composables/useScrollReveal'
import { useContent } from '@/composables/useContent'

const content = useContent()
const { scrollY } = useScrollPosition()

const menuOpen = ref(false)
const isMobile = ref(false)
const mobileNavId = 'mobile-nav-panel'

const isVisible = computed(() => scrollY.value > 80)
const showHeader = computed(() => isMobile.value || isVisible.value)
const hasCv = computed(() => content.value.cv.href.length > 0)

let mobileQuery: MediaQueryList | null = null

function updateIsMobile() {
  isMobile.value = mobileQuery?.matches ?? false
  if (!isMobile.value) menuOpen.value = false
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 767px)')
  updateIsMobile()
  mobileQuery.addEventListener('change', updateIsMobile)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  mobileQuery?.removeEventListener('change', updateIsMobile)
  document.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
})

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="[
      showHeader
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

      <nav class="hidden md:block" :aria-label="content.ui.sectionsNavLabel">
        <ul class="flex items-center gap-6">
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
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-border bg-white/5 p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          :aria-expanded="menuOpen"
          :aria-controls="mobileNavId"
          :aria-label="menuOpen ? content.ui.closeMenu : content.ui.openMenu"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" class="h-5 w-5" aria-hidden="true" />
          <Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-if="menuOpen"
      class="fixed inset-0 top-[65px] z-40 bg-bg/60 md:hidden"
      aria-hidden="true"
      @click="closeMenu"
    />

    <nav
      v-show="menuOpen"
      :id="mobileNavId"
      class="relative z-50 border-t border-border bg-bg/95 backdrop-blur-lg md:hidden"
      :aria-label="content.ui.sectionsNavLabel"
    >
      <ul class="container mx-auto flex flex-col gap-1 px-4 py-4 lg:px-8">
        <li v-for="item in content.nav" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="block rounded-lg px-3 py-2.5 font-mono text-sm text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>
        </li>
        <li v-if="hasCv" class="mt-2 border-t border-border pt-3">
          <a
            :href="content.cv.href"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary w-full text-xs"
            @click="closeMenu"
          >
            {{ content.ui.downloadCv }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
