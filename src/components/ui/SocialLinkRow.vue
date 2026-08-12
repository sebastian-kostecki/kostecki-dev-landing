<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import type { ContactMethod } from '@/types/content'

const props = defineProps<{
  href: string
  label: string
  value: string
  type: ContactMethod['type']
}>()

const iconName = computed(() => {
  switch (props.type) {
    case 'linkedin':
      return 'simple-icons:linkedin'
    case 'github':
      return 'simple-icons:github'
    case 'phone':
      return 'lucide:phone'
    case 'email':
    default:
      return 'lucide:mail'
  }
})

const isExternal = computed(() => !props.href.startsWith('mailto:'))
</script>

<template>
  <a
    :href="href"
    class="panel panel-hover group flex items-center gap-4 rounded-md p-5"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <span
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary"
    >
      <Icon :icon="iconName" class="h-5 w-5" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {{ label }}
      </p>
      <p class="truncate font-mono text-sm font-medium text-card-foreground">{{ value }}</p>
    </div>
    <ArrowUpRight
      class="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
    />
  </a>
</template>
