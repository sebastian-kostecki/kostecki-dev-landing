<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import type { Project } from '@/types/content'
import { useContent } from '@/composables/useContent'
import { hostOf, isRepo } from '@/content/links'

const props = defineProps<{
  project: Project
}>()

const content = useContent()
const liveLink = computed(() => props.project.links.find((link) => link.primary))
const repoLink = computed(() => props.project.links.find((link) => isRepo(link.url)))
const host = computed(() => (liveLink.value ? hostOf(liveLink.value.url) : ''))
</script>

<template>
  <article class="panel panel-hover group flex flex-col overflow-hidden rounded-md">
    <img
      v-if="project.image"
      :src="project.image"
      :alt="project.imageAlt ?? content.ui.projectScreenshotAlt"
      width="1200"
      height="953"
      loading="lazy"
      decoding="async"
      class="aspect-[16/9] w-full border-b border-border object-cover object-top"
    />
    <div class="flex flex-1 flex-col p-5">
      <p class="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
        {{ content.ui.featuredProjectLabel }}
      </p>
      <h3 class="mt-2 font-mono text-lg font-semibold text-card-foreground">
        {{ project.title }}
      </h3>
      <p v-if="project.proves" class="mt-2 text-sm leading-relaxed text-muted-foreground">
        <span class="font-mono text-xs text-foreground">{{ content.ui.provesLabel }}:</span>
        {{ project.proves }}
      </p>
      <div class="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="rounded-sm border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-secondary-foreground"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          v-if="liveLink"
          :href="liveLink.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
        >
          {{ host }}
          <ArrowUpRight class="h-3.5 w-3.5" />
        </a>
        <a
          v-if="repoLink"
          :href="repoLink.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
        >
          <Icon icon="simple-icons:github" class="h-3.5 w-3.5" />
          {{ repoLink.title }}
          <ArrowUpRight class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </article>
</template>
