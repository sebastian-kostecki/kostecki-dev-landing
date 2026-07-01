<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ContactCard from '@/components/ui/ContactCard.vue'
import RevealOnScroll from '@/components/ui/RevealOnScroll.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
const sectionRef = ref<HTMLElement | null>(null)
const hasCv = computed(() => content.value.cv.href.length > 0)

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
  <section id="contact" ref="sectionRef" class="bg-surface py-20 lg:py-28" aria-labelledby="contact-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <RevealOnScroll>
        <SectionHeading
          id="contact-heading"
          :command="content.contact.command"
          :title="content.contact.title"
        />
        <p class="mt-4 text-center text-muted lg:text-left">{{ content.contact.subtitle }}</p>
      </RevealOnScroll>

      <div class="mt-10 grid gap-6 sm:grid-cols-2">
        <ContactCard
          v-for="(method, index) in content.contact.methods"
          :key="method.type"
          :method="method"
          :index="index"
        />
      </div>

      <RevealOnScroll>
        <div class="mt-12 rounded-2xl border border-border bg-white/5 p-8 lg:p-12">
          <h3 class="font-display text-2xl font-bold text-white lg:text-3xl">
            {{ content.contact.ctaHeadline }}
          </h3>
          <div class="mt-6 flex flex-col gap-4 sm:flex-row">
            <a
              :href="content.hero.ctaPrimary.href"
              class="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ content.hero.ctaPrimary.label }}
            </a>
            <a
              v-if="hasCv"
              :href="content.cv.href"
              class="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ content.ui.downloadCv }}
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
