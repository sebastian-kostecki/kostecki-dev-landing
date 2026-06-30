import { ref } from 'vue'

export type Locale = 'pl' | 'en'

const STORAGE_KEY = 'kostecki-locale'

function detectInitial(): Locale {
  if (typeof window === 'undefined') return 'pl'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'pl' || stored === 'en') return stored
  const browser = window.navigator.language?.toLowerCase() ?? ''
  return browser.startsWith('en') ? 'en' : 'pl'
}

// Module-level singleton so every component shares the same locale state.
const locale = ref<Locale>(detectInitial())

export function useLocale() {
  function setLocale(next: Locale) {
    locale.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    }
  }
  return { locale, setLocale }
}
