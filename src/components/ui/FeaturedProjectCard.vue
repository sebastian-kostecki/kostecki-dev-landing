<script setup lang="ts">
import { ArrowUpRight, Check } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import type { Project } from '@/types/content'
import { useContent } from '@/composables/useContent'
import { isRepo } from '@/content/links'

defineProps<{
  project: Project
}>()

const content = useContent()
</script>

<template>
  <article class="panel panel-hover overflow-hidden rounded-md">
    <div class="grid" :class="project.image ? 'lg:grid-cols-[1fr_1.1fr]' : ''">
      <div class="flex flex-col p-6 sm:p-8">
        <p class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
          {{ content.ui.featuredProjectLabel }}
        </p>
        <h3 class="mt-4 font-mono text-2xl font-bold text-card-foreground">{{ project.title }}</h3>
        <p class="mt-4 leading-relaxed text-muted-foreground">{{ project.subtitle }}</p>

        <ul v-if="project.highlights?.length" class="mt-5 grid gap-2.5">
          <li
            v-for="highlight in project.highlights"
            :key="highlight"
            class="flex gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <Check class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{{ highlight }}</span>
          </li>
        </ul>

        <div class="mt-6 flex flex-wrap gap-1.5">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-sm border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-secondary-foreground"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mt-auto flex flex-wrap items-center gap-4 pt-7">
          <a
            v-for="link in project.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :class="link.primary ? 'btn-primary' : 'btn-secondary'"
          >
            {{ link.title }}
            <Icon v-if="isRepo(link.url)" icon="simple-icons:github" class="h-4 w-4" />
            <ArrowUpRight v-else class="h-4 w-4" />
          </a>
          <span v-if="project.note" class="font-mono text-xs text-muted-foreground">
            {{ project.note }}
          </span>
        </div>
      </div>

      <div
        v-if="project.image"
        class="border-t border-border bg-secondary/40 p-4 sm:p-6 lg:border-t-0 lg:border-l"
      >
        <img
          :src="project.image"
          :alt="project.imageAlt ?? content.ui.projectScreenshotAlt"
          width="1200"
          height="953"
          loading="lazy"
          decoding="async"
          class="h-auto w-full rounded-sm border border-border/60"
        />
      </div>
    </div>
  </article>
</template>
