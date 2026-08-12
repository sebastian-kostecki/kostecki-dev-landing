<script setup lang="ts">
import type { MetricItem } from '@/types/content'

defineProps<{
  metrics: MetricItem[]
  techTags: string[]
  label: string
}>()
</script>

<template>
  <div class="panel rounded-md p-6">
    <p class="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {{ label }}
    </p>
    <dl class="mt-5 divide-y divide-border">
      <div
        v-for="stat in metrics"
        :key="stat.label"
        class="flex items-baseline justify-between py-3"
      >
        <dt class="text-sm text-muted-foreground">{{ stat.label }}</dt>
        <dd class="font-mono text-xl font-bold text-foreground">{{ stat.value }}</dd>
      </div>
    </dl>
    <div class="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-5">
      <span
        v-for="tag in techTags"
        :key="tag"
        class="rounded-sm border border-primary/25 bg-primary/10 px-2 py-1 font-mono text-[11px] text-primary"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>
