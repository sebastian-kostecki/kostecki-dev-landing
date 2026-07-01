<script setup lang="ts">
import { useLocale, type Locale } from '@/composables/useLocale'
import { useContent } from '@/composables/useContent'

const { locale, setLocale } = useLocale()
const content = useContent()

const locales: Locale[] = ['pl', 'en']
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 p-0.5 font-mono text-xs"
    role="group"
    :aria-label="content.ui.languageLabel"
  >
    <button
      v-for="code in locales"
      :key="code"
      type="button"
      class="rounded-md px-2 py-1 font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      :class="
        locale === code
          ? 'bg-accent text-white'
          : 'text-muted hover:text-white'
      "
      :aria-pressed="locale === code"
      @click="setLocale(code)"
    >
      {{ code }}
    </button>
  </div>
</template>
