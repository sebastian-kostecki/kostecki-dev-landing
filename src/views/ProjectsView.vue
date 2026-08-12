<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import PanelAlphaFeature from '@/components/ui/PanelAlphaFeature.vue'
import CommercialProjectGroup from '@/components/ui/CommercialProjectGroup.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()

function projectIndex(index: number) {
  return String(index + 1).padStart(2, '0')
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

      <div class="space-y-6">
        <PanelAlphaFeature :project="content.projects.featured" />
        <CommercialProjectGroup :group="content.projects.commercialGroup" />
      </div>

      <section class="mt-24" aria-labelledby="personal-projects-heading">
        <SectionHeading
          heading-id="personal-projects-heading"
          :index="content.projects.personal.index"
          :title="content.projects.personal.title"
          :subtitle="content.projects.personal.subtitle"
        />

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="(project, index) in content.projects.personal.items"
            :key="project.title"
            :project="project"
            :index="projectIndex(index)"
          />
        </div>
      </section>
    </div>
  </div>
</template>
