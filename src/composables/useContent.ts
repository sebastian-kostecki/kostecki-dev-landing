import { computed, type ComputedRef } from 'vue'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import type { SiteContent } from '@/types/content'
import { useLocale, type Locale } from '@/composables/useLocale'

const dictionaries: Record<Locale, SiteContent> = {
  pl: pl as SiteContent,
  en: en as SiteContent,
}

// Returns a ComputedRef. In templates the ref auto-unwraps, so
// `content.hero.name` works directly; in <script> use `content.value`.
export function useContent(): ComputedRef<SiteContent> {
  const { locale } = useLocale()
  return computed(() => dictionaries[locale.value])
}
