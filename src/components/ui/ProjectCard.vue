<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/content'
import { useContent } from '@/composables/useContent'

const props = defineProps<{
  project: Project
  index: number
}>()

const content = useContent()

const gradientClasses = [
  'from-accent/40 via-purple-500/30 to-blue-500/30',
  'from-blue-500/40 via-cyan-500/30 to-emerald-500/30',
  'from-orange-500/40 via-amber-500/30 to-red-500/30',
  'from-violet-500/40 via-fuchsia-500/30 to-pink-500/30',
]

const gradientClass = gradientClasses[(props.project.placeholderIndex ?? props.index) % gradientClasses.length]

const imageAlt = computed(
  () => `${content.value.ui.projectScreenshotAlt} ${props.project.title}`,
)
</script>

<template>
  <article
    class="group flex h-full flex-col surface-card overflow-hidden transition-transform duration-300 hover:scale-[1.02] reveal"
    :style="{ transitionDelay: `${index * 100}ms` }"
  >
    <div class="relative aspect-[2/1] shrink-0 overflow-hidden">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="imageAlt"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width="640"
        height="320"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br"
        :class="gradientClass"
        aria-hidden="true"
      >
        <span class="font-display text-5xl font-bold text-white/20">
          {{ project.placeholderIndex ?? index + 1 }}
        </span>
      </div>
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
    <div class="flex flex-1 flex-col p-4 lg:p-5">
      <div class="flex flex-wrap items-center gap-2">
        <p class="mono-label">{{ content.ui.projectCardLabel }}</p>
        <span
          v-if="project.badge === 'wip'"
          class="rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-accent"
        >
          {{ content.ui.wipBadge }}
        </span>
      </div>
      <h3 class="mt-1 font-display text-lg font-bold text-white">{{ project.title }}</h3>
      <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ project.subtitle }}</p>
      <div class="mt-auto flex flex-wrap gap-2 pt-3">
        <a
          v-for="link in project.links"
          :key="link.url"
          :href="link.url"
          :class="[
            link.primary ? 'btn-primary' : 'btn-secondary',
            '!px-4 !py-2 text-xs',
          ]"
          :target="link.url.startsWith('http') ? '_blank' : undefined"
          :rel="link.url.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          {{ link.title }}
        </a>
      </div>
    </div>
  </article>
</template>
