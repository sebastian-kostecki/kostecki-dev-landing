<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SkillGroup from '@/components/ui/SkillGroup.vue'
import { useContent } from '@/composables/useContent'

const { skills } = useContent()
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
    id="skills"
    ref="sectionRef"
    class="bg-surface py-16 lg:py-24"
    aria-labelledby="skills-heading"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <SectionHeading id="skills-heading" :title="skills.title" light />
      <div class="mt-10 space-y-6">
        <SkillGroup
          v-for="(group, index) in skills.groups"
          :key="index"
          :group="group"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>
