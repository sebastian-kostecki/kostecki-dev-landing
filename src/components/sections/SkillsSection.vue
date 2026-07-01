<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SkillIcon from '@/components/ui/SkillIcon.vue'
import SkillCategory from '@/components/ui/SkillCategory.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
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
  <section id="skills" ref="sectionRef" class="py-20 lg:py-28" aria-labelledby="skills-heading">
    <div class="container mx-auto px-4 lg:px-8">
      <SectionHeading
        id="skills-heading"
        :command="content.skills.command"
        :title="content.skills.title"
      />

      <div class="mt-10 reveal">
        <div class="surface-card p-5 lg:p-6">
          <h3 class="font-display text-lg font-semibold text-white">{{ content.skills.coreTitle }}</h3>
          <div class="mt-4 flex flex-wrap gap-3">
            <span v-for="item in content.skills.core" :key="item.name" class="tech-tag !px-4 !py-2 !text-sm">
              <SkillIcon :item="item" size-class="h-5 w-5" />
              {{ item.name }}
            </span>
          </div>
          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {{ content.skills.coreDescription }}
          </p>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 reveal">
        <SkillCategory
          v-for="(category, index) in content.skills.categories"
          :key="category.name"
          :category="category"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>
