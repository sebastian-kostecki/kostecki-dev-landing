<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  icon?: string
  image?: string
  level?: string
}>()
</script>

<template>
  <div class="panel panel-hover group flex items-center gap-3 rounded-md px-4 py-3">
    <span
      v-if="icon || image"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary"
    >
      <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
      <img v-else-if="image" :src="image" :alt="name" class="h-4 w-4 object-contain" />
    </span>
    <div class="min-w-0">
      <p class="truncate font-mono text-sm font-medium text-card-foreground">{{ name }}</p>
      <p v-if="level" class="truncate text-xs text-muted-foreground">{{ level }}</p>
    </div>
  </div>
</template>
