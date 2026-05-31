<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Mail, Phone } from '@lucide/vue'
import type { ContactMethod } from '@/types/content'
import type { Component } from 'vue'

const props = defineProps<{
  method: ContactMethod
  index: number
}>()

const iconMap: Record<ContactMethod['type'], Component | string> = {
  email: Mail,
  phone: Phone,
  linkedin: 'simple-icons:linkedin',
  github: 'simple-icons:github',
}

const icon = iconMap[props.method.type]
</script>

<template>
  <div
    class="surface-card flex flex-col items-center p-6 text-center reveal"
    :style="{ transitionDelay: `${index * 100}ms` }"
  >
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
      aria-hidden="true"
    >
      <component :is="icon" v-if="typeof icon !== 'string'" class="h-7 w-7 text-white" />
      <Icon v-else :icon="icon" class="h-7 w-7 text-white" />
    </div>
    <p class="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{{ method.label }}</p>
    <a
      :href="method.href"
      class="mt-1 text-sm font-medium text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
      :target="method.type === 'linkedin' ? '_blank' : undefined"
      :rel="method.type === 'linkedin' ? 'noopener noreferrer' : undefined"
    >
      {{ method.value }}
    </a>
  </div>
</template>
