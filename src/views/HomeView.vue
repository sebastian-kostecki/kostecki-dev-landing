<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import HeroIntro from '@/components/hero/HeroIntro.vue'
import DuotonePhoto from '@/components/hero/DuotonePhoto.vue'
import SummaryPanel from '@/components/ui/SummaryPanel.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import PanelAlphaFeature from '@/components/ui/PanelAlphaFeature.vue'
import CommercialProjectGroup from '@/components/ui/CommercialProjectGroup.vue'
import SkillBadge from '@/components/ui/SkillBadge.vue'
import AiWorkflowSection from '@/components/ui/AiWorkflowSection.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <div class="flex flex-col">
    <section class="relative overflow-hidden">
      <div aria-hidden="true" class="gradient-hero absolute inset-0" />
      <div aria-hidden="true" class="grid-lines absolute inset-0" />

      <div
        class="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-24 pb-24 sm:px-6 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:px-8 lg:pt-40"
      >
        <HeroIntro />
        <SummaryPanel />
      </div>
    </section>

    <section class="px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <SectionHeading :index="content.about.index" :title="content.about.title" />
          <div class="corner-frame mx-3 max-w-[11rem] sm:max-w-[15rem]">
            <DuotonePhoto :placeholder-label="content.ui.photoPlaceholder" />
          </div>
        </div>
        <div class="space-y-5 text-base leading-relaxed text-muted-foreground lg:col-span-8">
          <p v-for="(paragraph, i) in content.about.paragraphs" :key="i">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <AiWorkflowSection />

    <section class="px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <SectionHeading
          :index="content.projects.homePreview.index"
          :title="content.projects.homePreview.title"
          :subtitle="content.projects.homePreview.subtitle"
        />
        <div class="space-y-5">
          <PanelAlphaFeature :project="content.projects.featured" compact />
          <PanelAlphaFeature :project="content.projects.openSource" compact />
          <CommercialProjectGroup :group="content.projects.commercialGroup" compact />
        </div>
        <div class="mt-10">
          <RouterLink
            to="/projects"
            class="inline-flex items-center gap-2 font-mono text-sm font-semibold text-primary transition-colors hover:text-primary-glow"
          >
            {{ content.ui.seeAllProjects }}
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <SectionHeading
          :index="content.skills.index"
          :title="content.skills.coreTitle"
          :subtitle="content.skills.coreDescription"
        />
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkillBadge
            v-for="skill in content.skills.core"
            :key="skill.name"
            :name="skill.name"
            :icon="skill.icon"
            :image="skill.image"
            :level="skill.level"
          />
        </div>
        <div class="mt-10">
          <RouterLink
            to="/skills"
            class="inline-flex items-center gap-2 font-mono text-sm font-semibold text-primary transition-colors hover:text-primary-glow"
          >
            {{ content.ui.exploreAllSkills }}
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="font-mono text-3xl font-bold text-foreground sm:text-4xl">
          {{ content.contact.ctaHeadline }}
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-muted-foreground">{{ content.contact.subtitle }}</p>
        <RouterLink to="/contact" class="btn-primary mt-8">
          {{ content.hero.ctaPrimary.label }}
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
