import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollReveal(
  elementRef: Ref<HTMLElement | null>,
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = elementRef.value
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.classList.add('reveal-visible')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}

export function useScrollPosition() {
  const scrollY = ref(0)

  function onScroll() {
    scrollY.value = window.scrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { scrollY }
}
