<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

function projectIndex(i: number) {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="gradient-hero absolute inset-x-0 top-0 h-80" />
    <div class="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        :index="content.projects.index"
        :title="content.projects.title"
        :subtitle="content.projects.subtitle"
      />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="(project, i) in content.projects.personal.items"
          :key="project.title"
          :project="project"
          :index="projectIndex(i)"
        />
      </div>
    </div>
  </div>
</template>
