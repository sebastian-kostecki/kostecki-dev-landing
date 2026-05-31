<script setup lang="ts">
import type { Project } from '@/types/content'

const props = defineProps<{
  project: Project
  index: number
}>()

const gradientClasses = [
  'from-accent/40 via-purple-500/30 to-blue-500/30',
  'from-blue-500/40 via-cyan-500/30 to-emerald-500/30',
  'from-orange-500/40 via-amber-500/30 to-red-500/30',
  'from-violet-500/40 via-fuchsia-500/30 to-pink-500/30',
]

const gradientClass = gradientClasses[(props.project.placeholderIndex ?? props.index) % gradientClasses.length]
</script>

<template>
  <article
    class="group surface-card overflow-hidden transition-transform duration-300 hover:scale-[1.02] reveal"
    :style="{ transitionDelay: `${index * 100}ms` }"
  >
    <div class="relative aspect-video overflow-hidden">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="`Zrzut ekranu projektu ${project.title}`"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width="640"
        height="360"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br"
        :class="gradientClass"
        aria-hidden="true"
      >
        <span class="font-display text-6xl font-bold text-white/20">
          {{ project.placeholderIndex ?? index + 1 }}
        </span>
      </div>
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
    <div class="p-6">
      <h3 class="font-display text-xl font-bold text-white">{{ project.title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-muted">{{ project.subtitle }}</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <a
          v-for="link in project.links"
          :key="link.url"
          :href="link.url"
          :class="link.primary ? 'btn-primary' : 'btn-secondary'"
          :target="link.url.startsWith('http') ? '_blank' : undefined"
          :rel="link.url.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          {{ link.title }}
        </a>
      </div>
    </div>
  </article>
</template>
