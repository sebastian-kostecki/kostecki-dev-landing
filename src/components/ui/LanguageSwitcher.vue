<script setup lang="ts">
import { useLocale, type Locale } from '@/composables/useLocale'
import { useContent } from '@/composables/useContent'

const { locale, setLocale } = useLocale()
const content = useContent()

const locales: Locale[] = ['pl', 'en']
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-sm border border-border bg-secondary/40 p-0.5 font-mono text-xs"
    role="group"
    :aria-label="content.ui.languageLabel"
  >
    <button
      v-for="code in locales"
      :key="code"
      type="button"
      class="rounded-sm px-2 py-1 font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="locale === code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
      :aria-pressed="locale === code"
      @click="setLocale(code)"
    >
      {{ code }}
    </button>
  </div>
</template>
