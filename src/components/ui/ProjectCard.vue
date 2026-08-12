<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import type { Project } from '@/types/content'
import { useContent } from '@/composables/useContent'

const props = defineProps<{
  project: Project
  index?: string
}>()

const content = useContent()

const status = computed(() =>
  props.project.badge === 'wip' ? content.value.ui.wipBadge : undefined,
)

const demoUrl = computed(() => {
  const link = props.project.links.find((item) => {
    const title = item.title.toLowerCase()
    return title.includes('strona') || title.includes('website') || title.includes('demo')
  })
  return link?.url
})

const repoUrl = computed(() => {
  const link = props.project.links.find((item) => item.title.toLowerCase().includes('github'))
  return link?.url
})
</script>

<template>
  <article class="panel panel-hover group relative flex flex-col rounded-md p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <span v-if="index" class="font-mono text-xs tracking-[0.2em] text-primary">{{ index }}</span>
        <span
          v-if="status"
          class="rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-primary uppercase"
        >
          {{ status }}
        </span>
      </div>
      <ArrowUpRight
        class="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
      />
    </div>

    <h3 class="mt-4 font-mono text-lg font-semibold text-card-foreground">{{ project.title }}</h3>
    <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{{ project.subtitle }}</p>

    <div class="mt-5 flex flex-wrap gap-1.5">
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="rounded-sm border border-border bg-secondary/60 px-2 py-1 font-mono text-[11px] text-secondary-foreground"
      >
        {{ tag }}
      </span>
    </div>

    <div
      v-if="demoUrl || repoUrl"
      class="mt-6 flex items-center gap-4 border-t border-border/60 pt-4"
    >
      <a
        v-if="demoUrl"
        :href="demoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary-glow"
      >
        {{ content.ui.liveDemo }}
        <ArrowUpRight class="h-3.5 w-3.5" />
      </a>
      <a
        v-if="repoUrl"
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {{ content.ui.sourceCode }}
        <Icon icon="simple-icons:github" class="h-3.5 w-3.5" />
      </a>
    </div>
  </article>
</template>
