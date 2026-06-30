<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-bg py-12 lg:py-16">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid gap-8 md:grid-cols-2">
        <div class="text-center md:text-left">
          <p class="font-display font-bold text-white">{{ content.footer.servicesTitle }}</p>
          <ul class="mt-3 space-y-2 text-sm text-muted">
            <li v-for="service in content.footer.services" :key="service">{{ service }}</li>
          </ul>
        </div>
        <div class="text-center md:text-left">
          <p class="font-display font-bold text-white">{{ content.footer.mediaTitle }}</p>
          <ul class="mt-3 space-y-2">
            <li v-for="social in content.footer.social" :key="social.name">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <Icon :icon="social.icon" class="h-4 w-4" aria-hidden="true" />
                {{ social.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row"
      >
        <div class="flex items-center gap-3">
          <a
            href="#"
            class="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            aria-label="Strona główna"
          >
            <BrandMark :size="22" decorative />
          </a>
          <p class="font-mono text-center text-sm text-muted md:text-left">
            {{ content.footer.copyright }} &copy; {{ year }}
          </p>
        </div>
        <div class="flex gap-4">
          <a
            v-for="social in content.footer.social"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            :aria-label="social.name"
          >
            <Icon :icon="social.icon" class="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
