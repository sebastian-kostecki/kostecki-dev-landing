<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { SkillGroup as SkillGroupType } from '@/types/content'

defineProps<{
  group: SkillGroupType
  index: number
}>()
</script>

<template>
  <div
    class="surface-card p-6 lg:p-8 reveal"
    :style="{ transitionDelay: `${index * 100}ms` }"
  >
    <div class="flex flex-wrap justify-center gap-4 lg:justify-start">
      <div
        v-for="item in group.items"
        :key="item.name"
        class="flex w-24 flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
      >
        <Icon :icon="item.icon" class="h-10 w-10 text-white" aria-hidden="true" />
        <span class="text-center text-xs font-medium text-muted">{{ item.name }}</span>
      </div>
    </div>
    <p class="mt-6 text-center text-sm leading-relaxed text-muted lg:text-left">
      {{ group.description }}
    </p>
  </div>
</template>
