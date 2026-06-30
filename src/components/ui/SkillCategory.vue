<script setup lang="ts">
import { ref } from 'vue'
import SkillIcon from '@/components/ui/SkillIcon.vue'
import type { SkillCategory } from '@/types/content'

const props = defineProps<{
  category: SkillCategory
  index: number
}>()

const open = ref(false)
const panelId = `skill-cat-${props.index}`
</script>

<template>
  <div class="surface-card overflow-hidden">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:p-5"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <span class="flex items-center gap-3">
        <span class="font-mono text-sm text-muted">▸</span>
        <span class="font-display font-semibold text-white">{{ category.name }}</span>
        <span class="font-mono text-xs text-muted">{{ category.items.length }}</span>
      </span>
      <span class="font-mono text-sm text-accent" aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <div v-show="open" :id="panelId" class="flex flex-wrap gap-2 px-4 pb-5 lg:px-5">
      <span v-for="item in category.items" :key="item.name" class="tech-tag">
        <SkillIcon :item="item" size-class="h-4 w-4" />
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
