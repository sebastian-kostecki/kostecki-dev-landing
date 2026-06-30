<script setup lang="ts">
import type { MetricItem } from '@/types/content'

defineProps<{
  metrics: MetricItem[]
}>()
</script>

<template>
  <dl class="flex flex-wrap gap-x-8 gap-y-4">
    <div v-for="metric in metrics" :key="metric.label" class="flex flex-col">
      <dt class="order-2 metric-label">{{ metric.label }}</dt>
      <dd class="order-1 metric-value">{{ metric.value }}</dd>
    </div>
  </dl>
</template>
