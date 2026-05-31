<script setup lang="ts">
defineProps<{
  id?: string
  title: string
  light?: boolean
  centered?: boolean
}>()
</script>

<template>
  <h2
    :id="id"
    class="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
    :class="[
      light ? 'text-white' : 'text-white',
      centered ? 'text-center' : 'text-center lg:text-left',
    ]"
  >
    {{ title }}
  </h2>
</template>
