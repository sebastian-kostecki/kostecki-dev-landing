<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useContent } from '@/composables/useContent'

const SCROLL_THRESHOLD_PX = 80

const content = useContent()
const route = useRoute()
const open = ref(false)
const scrolledPastThreshold = ref(false)
const isMobile = ref(false)

const hasCv = computed(() => content.value.cv.href.length > 0)
const isHome = computed(() => route.path === '/')
const headerVisible = computed(() => {
  if (!isHome.value) return true
  if (open.value) return true
  if (isMobile.value) return true
  return scrolledPastThreshold.value
})

function isActive(to: string) {
  return route.path === to
}

function updateScrollState() {
  scrolledPastThreshold.value = window.scrollY > SCROLL_THRESHOLD_PX
}

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 767px)').matches
  if (!isMobile.value) open.value = false
}

watch(
  () => route.path,
  () => {
    open.value = false
    updateScrollState()
  },
)

let mobileQuery: MediaQueryList | null = null

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })

  mobileQuery = window.matchMedia('(max-width: 767px)')
  updateIsMobile()
  mobileQuery.addEventListener('change', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  mobileQuery?.removeEventListener('change', updateIsMobile)
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all print:hidden duration-300 motion-reduce:transition-none"
    :class="
      headerVisible
        ? 'translate-y-0 border-b border-border/60 bg-background/70 opacity-100 backdrop-blur-xl'
        : 'pointer-events-none -translate-y-full opacity-0'
    "
    :aria-hidden="headerVisible ? undefined : true"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-3" :aria-label="content.ui.homeLabel">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 font-mono text-xs font-bold text-primary transition-colors group-hover:bg-primary/20"
        >
          &lt;/&gt;
        </span>
        <span class="font-mono text-sm font-semibold tracking-tight text-foreground">
          {{ content.ui.brandName }}
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-6 md:flex" :aria-label="content.ui.navLabel">
        <RouterLink
          v-for="link in content.nav"
          :key="link.to"
          :to="link.to"
          class="group relative flex items-baseline gap-1.5 py-2 font-mono text-sm transition-colors"
          :class="
            isActive(link.to) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          "
        >
          <span
            class="text-[10px]"
            :class="isActive(link.to) ? 'text-primary' : 'text-muted-foreground/60'"
          >
            {{ link.index }}
          </span>
          {{ link.label }}
          <span
            aria-hidden="true"
            class="absolute inset-x-0 -bottom-px h-px origin-left bg-primary transition-transform duration-200"
            :class="isActive(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
          />
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <LanguageSwitcher />
        <RouterLink v-if="hasCv" :to="content.cv.href" class="btn-secondary !px-3 !py-2 text-xs">
          {{ content.ui.downloadCv }}
        </RouterLink>
      </div>

      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-foreground md:hidden"
        :aria-label="open ? content.ui.closeMenu : content.ui.openMenu"
        :aria-expanded="open"
        @click="open = !open"
      >
        <X v-if="open" class="h-4 w-4" />
        <Menu v-else class="h-4 w-4" />
      </button>
    </div>

    <div v-if="open" class="border-t border-border/60 bg-background md:hidden">
      <nav
        class="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6"
        :aria-label="content.ui.navLabel"
      >
        <RouterLink
          v-for="link in content.nav"
          :key="link.to"
          :to="link.to"
          class="flex items-baseline gap-2 border-b border-border/40 py-3 font-mono text-sm transition-colors last:border-0"
          :class="
            isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          "
          @click="open = false"
        >
          <span class="text-[10px] text-muted-foreground/60">{{ link.index }}</span>
          {{ link.label }}
        </RouterLink>
        <div class="flex items-center gap-3 py-3">
          <LanguageSwitcher />
          <RouterLink
            v-if="hasCv"
            :to="content.cv.href"
            class="btn-secondary !px-3 !py-2 text-xs"
            @click="open = false"
          >
            {{ content.ui.downloadCv }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>
