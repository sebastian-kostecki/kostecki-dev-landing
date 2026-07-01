<script setup lang="ts">
defineProps<{
  id?: string
  title: string
  command?: string
  light?: boolean
  centered?: boolean
}>()
</script>

<template>
  <div :class="centered ? 'text-center' : 'text-center lg:text-left'">
    <p v-if="command" class="cmd-label">{{ command }}</p>
    <h2
      :id="id"
      class="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
    >
      {{ title }}
    </h2>
  </div>
</template>
