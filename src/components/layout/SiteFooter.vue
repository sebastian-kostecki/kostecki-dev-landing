<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="w-full border-t border-border/60 bg-background">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="font-mono text-sm font-semibold text-foreground">{{ content.ui.brandName }}</p>
          <p class="mt-2 max-w-xs text-sm text-muted-foreground">{{ content.ui.footerTagline }}</p>
        </div>

        <nav class="flex flex-col gap-2" :aria-label="content.ui.navLabel">
          <RouterLink
            v-for="link in content.nav"
            :key="link.to"
            :to="link.to"
            class="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <a
            v-for="social in content.footer.social"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Icon :icon="social.icon" class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="font-mono text-xs text-muted-foreground">
          © {{ year }} — {{ content.footer.copyright }}
        </p>
        <p class="font-mono text-xs text-muted-foreground">{{ content.ui.footerStack }}</p>
      </div>
    </div>
  </footer>
</template>
