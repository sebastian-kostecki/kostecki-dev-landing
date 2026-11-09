<script setup lang="ts">
import { ArrowUpRight, Check } from '@lucide/vue'
import type { FeaturedProject } from '@/types/content'

defineProps<{
  project: FeaturedProject
}>()
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

      <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h3 class="font-mono text-2xl font-bold text-card-foreground sm:text-3xl">
            {{ project.title }}
          </h3>
          <div
            class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground"
          >
            <span>{{ project.context.employer }}</span>
            <span aria-hidden="true" class="text-primary">/</span>
            <span>{{ project.context.role }}</span>
            <span aria-hidden="true" class="text-primary">/</span>
            <span>{{ project.context.period }}</span>
          </div>
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

          <div v-if="project.link?.url" class="mt-7 flex flex-wrap items-center gap-3">
            <a
              v-if="project.link?.url"
              :href="project.link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              {{ project.link.title }}
              <ArrowUpRight class="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
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
            <li
              v-if="project.openSourceContribution"
              class="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <Check class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <span>{{ project.openSourceContribution.text }}</span>
                <p class="mt-1 text-xs text-muted-foreground/80">
                  {{ project.openSourceContribution.context }}
                </p>
                <a
                  :href="project.openSourceContribution.link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
                >
                  {{ project.openSourceContribution.link.title }}
                  <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
