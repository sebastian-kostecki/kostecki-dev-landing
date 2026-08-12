<script setup lang="ts">
import type { CommercialProjectItem } from '@/types/content'

defineProps<{
  item: CommercialProjectItem
  index: string
}>()
</script>

<template>
  <article class="rounded-md border border-border/70 bg-secondary/30 p-4">
    <div class="flex items-start gap-3">
      <span class="mt-0.5 font-mono text-xs tracking-[0.15em] text-primary">{{ index }}</span>
      <div>
        <h4 class="font-mono text-sm font-semibold text-card-foreground">{{ item.title }}</h4>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ item.description }}</p>
      </div>
    </div>
  </article>
</template>
