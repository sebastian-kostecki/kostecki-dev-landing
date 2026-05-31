<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ContactCard from '@/components/ui/ContactCard.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useContent } from '@/composables/useContent'

const { contact } = useContent()
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = sectionRef.value
  if (!el) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cards = el.querySelectorAll('.reveal')

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add('reveal-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  )

  cards.forEach((card) => observer.observe(card))
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="bg-surface py-16 lg:py-24"
    aria-labelledby="contact-heading"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading id="contact-heading" :title="contact.title" light centered />
        <p class="mt-4 text-center text-muted">{{ contact.subtitle }}</p>
      </RevealOnScroll>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
        <ContactCard
          v-for="(method, index) in contact.methods"
          :key="method.type"
          :method="method"
          :index="index"
        />
      </div>

      <RevealOnScroll>
        <div class="mt-16 rounded-2xl border border-border bg-white/5 p-8 text-center lg:p-12 lg:text-left">
          <h3 class="font-display text-2xl font-bold text-white lg:text-3xl">
            {{ contact.ctaHeadline }}
          </h3>
          <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              :href="contact.ctaPrimary.href"
              class="btn-primary"
              :target="contact.ctaPrimary.href.startsWith('http') ? '_blank' : undefined"
              :rel="contact.ctaPrimary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ contact.ctaPrimary.label }}
            </a>
            <a
              :href="contact.ctaSecondary.href"
              class="btn-secondary"
              :target="contact.ctaSecondary.href.startsWith('http') ? '_blank' : undefined"
              :rel="contact.ctaSecondary.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              {{ contact.ctaSecondary.label }}
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
