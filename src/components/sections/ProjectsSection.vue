<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
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
  <section
    id="projects"
    ref="sectionRef"
    class="py-20 lg:py-28"
    aria-labelledby="projects-heading"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <SectionHeading
        id="projects-heading"
        :command="content.projects.command"
        :title="content.projects.title"
      />
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <ProjectCard
          v-for="(project, index) in content.projects.items"
          :key="project.title"
          :project="project"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>
