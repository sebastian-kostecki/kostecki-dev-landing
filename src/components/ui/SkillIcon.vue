<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { SkillItem } from '@/types/content'

defineProps<{
  item: SkillItem
  sizeClass?: string
}>()
</script>

<template>
  <img
    v-if="item.image"
    :src="item.image"
    :alt="item.name"
    class="object-contain"
    :class="sizeClass ?? 'h-7 w-7'"
  />
  <Icon
    v-else-if="item.icon"
    :icon="item.icon"
    class="text-white"
    :class="sizeClass ?? 'h-7 w-7'"
    aria-hidden="true"
  />
</template>
