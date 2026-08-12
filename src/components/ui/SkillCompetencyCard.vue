<script setup lang="ts">
import type { SkillCategory } from '@/types/content'

defineProps<{
  category: SkillCategory
}>()
</script>

<template>
  <article class="panel rounded-md p-5 sm:p-6">
    <h3 class="font-mono text-base font-semibold text-card-foreground">
      {{ category.name }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
      {{ category.description }}
    </p>
    <ul class="mt-5 flex flex-wrap gap-2" :aria-label="category.name">
      <li
        v-for="tag in category.tags"
        :key="tag"
        class="rounded-sm border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-secondary-foreground"
      >
        {{ tag }}
      </li>
    </ul>
  </article>
</template>
