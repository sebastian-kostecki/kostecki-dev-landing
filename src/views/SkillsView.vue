<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SkillBadge from '@/components/ui/SkillBadge.vue'
import { useContent } from '@/composables/useContent'

const content = useContent()
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="gradient-hero absolute inset-x-0 top-0 h-80" />
    <div class="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        :index="content.skills.index"
        :title="content.skills.title"
        :subtitle="content.skills.subtitle"
      />

      <div class="space-y-14">
        <section>
          <div class="mb-5 flex items-center gap-4">
            <h3 class="font-mono text-lg font-semibold text-foreground">
              {{ content.skills.coreTitle }}
            </h3>
            <span aria-hidden="true" class="h-px flex-1 bg-border" />
            <span class="font-mono text-xs text-muted-foreground">
              {{ content.skills.core.length }}
            </span>
          </div>
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
        </section>

        <section v-for="category in content.skills.categories" :key="category.name">
          <div class="mb-5 flex items-center gap-4">
            <h3 class="font-mono text-lg font-semibold text-foreground">{{ category.name }}</h3>
            <span aria-hidden="true" class="h-px flex-1 bg-border" />
            <span class="font-mono text-xs text-muted-foreground">{{ category.items.length }}</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkillBadge
              v-for="skill in category.items"
              :key="skill.name"
              :name="skill.name"
              :icon="skill.icon"
              :image="skill.image"
              :level="skill.level"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
