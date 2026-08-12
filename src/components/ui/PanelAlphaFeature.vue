<script setup lang="ts">
import { ArrowUpRight, Check } from '@lucide/vue'
import type { FeaturedProject } from '@/types/content'

withDefaults(
  defineProps<{
    project: FeaturedProject
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)
</script>

<template>
  <article class="panel panel-hover relative overflow-hidden rounded-md p-6 sm:p-8">
    <div
      aria-hidden="true"
      class="absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
    />

    <div class="relative">
      <p class="font-mono text-xs tracking-[0.25em] text-primary uppercase">
        {{ project.eyebrow }}
      </p>

      <div class="mt-4 grid gap-8" :class="compact ? '' : 'lg:grid-cols-[1fr_1.15fr]'">
        <div>
          <h3 class="font-mono text-2xl font-bold text-card-foreground sm:text-3xl">
            {{ project.title }}
          </h3>
          <p class="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            {{ project.description }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
            >
              {{ tag }}
            </span>
          </div>

          <a
            v-if="project.link?.url"
            :href="project.link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary mt-7"
          >
            {{ project.link.title }}
            <ArrowUpRight class="h-4 w-4" />
          </a>
        </div>

        <div v-if="!compact">
          <p class="font-mono text-sm font-semibold text-foreground">
            {{ project.contributionTitle }}
          </p>
          <ul class="mt-4 grid gap-3">
            <li
              v-for="responsibility in project.responsibilities"
              :key="responsibility"
              class="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <Check class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{{ responsibility }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
