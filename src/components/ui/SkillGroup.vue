<script setup lang="ts">
import type { SkillGroup as SkillGroupType } from '@/types/content'
import SkillIcon from '@/components/ui/SkillIcon.vue'

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
    <div
      v-if="group.layout === 'compact'"
      class="flex flex-wrap justify-center gap-3 lg:justify-start"
    >
      <div
        v-for="item in group.items"
        :key="item.name"
        class="flex w-[4.75rem] flex-col items-center gap-1.5 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
      >
        <SkillIcon :item="item" size-class="h-7 w-7" />
        <span class="text-center text-[10px] font-medium leading-tight text-muted">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div v-else-if="group.layout === 'tags'" class="flex flex-wrap justify-center gap-2 lg:justify-start">
      <span
        v-for="item in group.items"
        :key="item.name"
        class="rounded-lg border border-border bg-white/5 px-3 py-1.5 text-xs font-medium text-muted"
      >
        {{ item.name }}
      </span>
    </div>
    <div v-else class="flex flex-wrap justify-center gap-4 lg:justify-start">
      <div
        v-for="item in group.items"
        :key="item.name"
        class="flex w-24 flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
      >
        <SkillIcon :item="item" size-class="h-10 w-10" />
        <span class="text-center text-xs font-medium text-muted">{{ item.name }}</span>
      </div>
    </div>
    <p class="mt-6 text-center text-sm leading-relaxed text-muted lg:text-left">
      {{ group.description }}
    </p>
  </div>
</template>
